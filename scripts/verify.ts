// npm run verify — the one command that proves the app still does what the
// baseline says (docs/REFACTOR_PLAN.md, "Testing and verification"). Runs every
// check in order and stops at the first failure.
//
//   npm run verify                         run everything
//   npm run verify -- --update-numbers     also record the test counts in tests/baseline/numbers.json
//   npm run verify -- --only=tsc,eslint    run only these steps (ids below); CI splits the steps into
//                                          parallel jobs this way
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readNumbers, writeNumbers } from './baseline/bundle-report';
import { ROOT } from './baseline/lib';

const REPORT_DIR = join(ROOT, 'tmp', 'verify');
// The test build points the chat at a host the Playwright tests mock.
const TEST_CHAT_API_URL = 'http://chat.test/api/chat';
// CI runners have fewer cores than a dev laptop; the WebGL replays need the headroom.
const FEATURE_WORKERS = process.env.CI ? 2 : 3;

// Reference screenshots are per platform. Until this platform's set is committed
// (Linux comes from the CI "baseline-linux" artifact), the visual step writes the
// images instead of comparing, and says so in the summary. (It uses --update-snapshots=all:
// in this Playwright version "missing" writes the image but still fails the test.)
const VISUAL_DIR = join(ROOT, 'tests', 'baseline', 'visual');
function hasVisualBaseline(): boolean {
  if (!existsSync(VISUAL_DIR)) return false;
  return readdirSync(VISUAL_DIR, { recursive: true }).some((name) => String(name).endsWith(`-${process.platform}.png`));
}
const visualBaselineMissing = !hasVisualBaseline();

// The browser-only UI numbers are per platform too (tests/e2e/support/uiBaseline.ts).
// Where this platform has none yet, the tests record them in UI_RECORD_DIR and they
// are merged into this platform's file here, for review before committing.
const UI_RECORD_DIR = join(ROOT, 'tmp', 'ui-baseline');
const UI_BASELINE_NAME = process.platform === 'win32' ? 'behavior-ui.json' : `behavior-ui-${process.platform}.json`;
function mergeRecordedUiBaseline(): string | undefined {
  if (!existsSync(UI_RECORD_DIR)) return undefined;
  const data: Record<string, Record<string, unknown>> = {};
  for (const file of readdirSync(UI_RECORD_DIR).sort()) {
    const [project, key] = file.replace(/.json$/, '').split('~');
    data[project] = { ...data[project], [key]: JSON.parse(readFileSync(join(UI_RECORD_DIR, file), 'utf8')) };
  }
  if (Object.keys(data).length === 0) return undefined;
  writeFileSync(join(ROOT, 'tests', 'baseline', UI_BASELINE_NAME), `${JSON.stringify(data, null, 2)}
`);
  return UI_BASELINE_NAME;
}

interface Step {
  id: string;
  name: string;
  command?: string;
  env?: Record<string, string>;
  skip?: string;
  after?: () => string | undefined;
}

interface PlaywrightReport {
  stats: { expected: number; unexpected: number; flaky: number; skipped: number };
  suites: PlaywrightSuite[];
}
interface PlaywrightSuite {
  suites?: PlaywrightSuite[];
  specs?: { tests: { annotations: { type: string }[] }[] }[];
}

const counts: Record<string, number> = {};

function playwrightSummary(file: string, label: string): string | undefined {
  const path = join(REPORT_DIR, file);
  if (!existsSync(path)) return undefined;
  const report = JSON.parse(readFileSync(path, 'utf8')) as PlaywrightReport;
  let knownFailures = 0;
  const walk = (suite: PlaywrightSuite): void => {
    suite.suites?.forEach(walk);
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests) if (test.annotations.some((a) => a.type === 'fail')) knownFailures++;
    }
  };
  report.suites.forEach(walk);
  const { expected, unexpected, flaky, skipped } = report.stats;
  // Skipped tests still exist (e.g. the Linux-only skips); the guard below is about removed tests.
  counts[`${label}Tests`] = expected + unexpected + flaky + skipped;
  counts[`${label}KnownFailures`] = knownFailures;
  return `${expected} passed (${knownFailures} known failures), ${unexpected} failed, ${flaky} flaky, ${skipped} skipped`;
}

const steps: Step[] = [
  // Validates content/ (Zod, every link) and writes src/generated/, which everything below reads.
  { id: 'content', name: 'Content build (Zod)', command: 'npx tsx scripts/build-content.ts' },
  { id: 'tsc', name: 'Type check', command: 'npx tsc --noEmit' },
  { id: 'eslint', name: 'ESLint', command: 'npx eslint .' },
  {
    id: 'vitest',
    name: 'Unit tests (Vitest)',
    command: `npx vitest run --reporter=default --reporter=json --outputFile.json=${join(REPORT_DIR, 'vitest.json')}`,
    after: () => {
      const report = JSON.parse(readFileSync(join(REPORT_DIR, 'vitest.json'), 'utf8')) as { numPassedTests: number; numTotalTests: number };
      counts.vitestTests = report.numTotalTests;
      return `${report.numPassedTests}/${report.numTotalTests} passed`;
    },
  },
  { id: 'snapshot', name: 'Content snapshot', command: 'npx tsx scripts/baseline/content-snapshot.ts' },
  { id: 'behavior', name: 'Behavior map', command: 'npx tsx scripts/baseline/behavior-map.ts' },
  { id: 'build', name: 'Production build', command: 'npx vite build', env: { VITE_CHAT_API_URL: TEST_CHAT_API_URL } },
  { id: 'bundle', name: 'Bundle budget', command: 'npx tsx scripts/baseline/bundle-report.ts' },
  {
    // Three workers locally: the 12 battle replays render with WebGL and saturate a laptop CPU at four.
    id: 'features',
    name: 'Feature tests (Playwright)',
    command: `npx playwright test --project=desktop --project=phone --grep-invert @visual --workers=${FEATURE_WORKERS} --reporter=line,json`,
    env: { PLAYWRIGHT_JSON_OUTPUT_NAME: join(REPORT_DIR, 'playwright-features.json') },
    after: () => playwrightSummary('playwright-features.json', 'playwrightFeature'),
  },
  {
    // The @phone smoke subset in the Safari (WebKit) and Firefox engines, functional only.
    id: 'engines',
    name: 'Phone smoke (WebKit, Firefox)',
    command: 'npx playwright test --project=phone-webkit --project=phone-firefox --workers=2 --reporter=line,json',
    env: { PLAYWRIGHT_JSON_OUTPUT_NAME: join(REPORT_DIR, 'playwright-engines.json') },
    after: () => playwrightSummary('playwright-engines.json', 'playwrightEngines'),
  },
  {
    // Two workers: under heavier load the map's resting point can drift (see visual.spec.ts).
    id: 'visual',
    name: 'Visual snapshots (Playwright)',
    command: `npx playwright test --project=desktop --project=phone --grep @visual --workers=2 --reporter=line,json${visualBaselineMissing ? ' --update-snapshots=all' : ''}`,
    env: { PLAYWRIGHT_JSON_OUTPUT_NAME: join(REPORT_DIR, 'playwright-visual.json') },
    after: () => {
      const summary = playwrightSummary('playwright-visual.json', 'playwrightVisual');
      return visualBaselineMissing
        ? `no ${process.platform} baseline yet: wrote the images, compared nothing (${summary})`
        : summary;
    },
  },
];

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)} s`;
}

// --only=a,b runs just those steps (in the usual order); the rest show as "not selected".
function selectedStepIds(): Set<string> | undefined {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  if (!arg) return undefined;
  const ids = new Set(arg.slice('--only='.length).split(',').map((id) => id.trim()).filter(Boolean));
  const unknown = [...ids].filter((id) => !steps.some((step) => step.id === id));
  if (unknown.length > 0) {
    console.error(`Unknown step id(s): ${unknown.join(', ')}. Known: ${steps.map((step) => step.id).join(', ')}`);
    process.exit(2);
  }
  return ids;
}

function main(): void {
  const only = selectedStepIds();
  mkdirSync(REPORT_DIR, { recursive: true });
  rmSync(UI_RECORD_DIR, { recursive: true, force: true });
  const rows: string[][] = [];
  let failed = false;
  for (const step of steps) {
    if (only && !only.has(step.id)) {
      rows.push([step.name, 'not selected', '', '']);
      continue;
    }
    if (failed) {
      rows.push([step.name, 'not run', '', '']);
      continue;
    }
    if (step.skip || !step.command) {
      rows.push([step.name, 'skipped', '', step.skip ?? '']);
      continue;
    }
    console.log(`\n▶ ${step.name}: ${step.command}`);
    const started = Date.now();
    const result = spawnSync(step.command, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...step.env, FORCE_COLOR: process.env.FORCE_COLOR ?? '1' },
    });
    const duration = formatSeconds(Date.now() - started);
    let note = '';
    try {
      note = step.after?.() ?? '';
    } catch {
      note = '(no report)';
    }
    const ok = result.status === 0;
    rows.push([step.name, ok ? 'passed' : 'FAILED', duration, note]);
    if (!ok) failed = true;
  }

  const widths = [0, 1, 2].map((i) => Math.max(...rows.map((r) => r[i].length)));
  console.log('\nnpm run verify — summary');
  for (const row of rows) console.log(`  ${row[0].padEnd(widths[0])}  ${row[1].padEnd(widths[1])}  ${row[2].padStart(widths[2])}  ${row[3]}`);

  const recorded = mergeRecordedUiBaseline();
  if (recorded) {
    console.log(`
No ${process.platform} UI baseline yet: recorded the marker and request numbers in tests/baseline/${recorded} (not compared). Review, then commit it.`);
  }

  if (!failed) {
    const numbers = readNumbers();
    const recorded = (numbers.tests ?? {}) as Record<string, number>;
    for (const [key, value] of Object.entries(counts)) {
      if (key.endsWith('Tests') && recorded[key] !== undefined && value < recorded[key]) {
        console.error(`\n${key}: ${value} tests, fewer than the ${recorded[key]} in tests/baseline/numbers.json — was a test removed?`);
        failed = true;
      }
    }
    if (process.argv.includes('--update-numbers')) {
      // Merge, so a run of some steps (--only) keeps the other steps' counts.
      writeNumbers({ ...numbers, tests: { ...recorded, ...counts } });
      console.log('\nRecorded the test counts in tests/baseline/numbers.json');
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
