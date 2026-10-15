// npm run verify — the one command that proves the app still does what the
// baseline says (docs/REFACTOR_PLAN.md, "Testing and verification"). Runs every
// check in order and stops at the first failure.
//
//   npm run verify                      run everything
//   npm run verify -- --update-numbers  also record the test counts in tests/baseline/numbers.json
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readNumbers, writeNumbers } from './baseline/bundle-report';
import { ROOT } from './baseline/lib';

const REPORT_DIR = join(ROOT, 'tmp', 'verify');
// The test build points the chat at a host the Playwright tests mock.
const TEST_CHAT_API_URL = 'http://chat.test/api/chat';

interface Step {
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
  counts[`${label}Tests`] = expected + unexpected + flaky;
  counts[`${label}KnownFailures`] = knownFailures;
  return `${expected} passed (${knownFailures} known failures), ${unexpected} failed, ${flaky} flaky, ${skipped} skipped`;
}

const steps: Step[] = [
  { name: 'Type check', command: 'npx tsc --noEmit' },
  { name: 'ESLint', skip: 'not set up yet (Phase 0B)' },
  {
    name: 'Unit tests (Vitest)',
    command: `npx vitest run --reporter=default --reporter=json --outputFile.json=${join(REPORT_DIR, 'vitest.json')}`,
    after: () => {
      const report = JSON.parse(readFileSync(join(REPORT_DIR, 'vitest.json'), 'utf8')) as { numPassedTests: number; numTotalTests: number };
      counts.vitestTests = report.numTotalTests;
      return `${report.numPassedTests}/${report.numTotalTests} passed`;
    },
  },
  { name: 'Content validation (Zod)', skip: 'not set up yet (Phase 0B)' },
  { name: 'Content snapshot', command: 'npx tsx scripts/baseline/content-snapshot.ts' },
  { name: 'Behavior map', command: 'npx tsx scripts/baseline/behavior-map.ts' },
  { name: 'Production build', command: 'npx vite build', env: { VITE_CHAT_API_URL: TEST_CHAT_API_URL } },
  { name: 'Bundle budget', command: 'npx tsx scripts/baseline/bundle-report.ts' },
  {
    // Three workers: the 12 battle replays render with WebGL and saturate a laptop CPU at four.
    name: 'Feature tests (Playwright)',
    command: 'npx playwright test --grep-invert @visual --workers=3 --reporter=line,json',
    env: { PLAYWRIGHT_JSON_OUTPUT_NAME: join(REPORT_DIR, 'playwright-features.json') },
    after: () => playwrightSummary('playwright-features.json', 'playwrightFeature'),
  },
  {
    // Two workers: under heavier load the map's resting point can drift (see visual.spec.ts).
    name: 'Visual snapshots (Playwright)',
    command: 'npx playwright test --grep @visual --workers=2 --reporter=line,json',
    env: { PLAYWRIGHT_JSON_OUTPUT_NAME: join(REPORT_DIR, 'playwright-visual.json') },
    after: () => playwrightSummary('playwright-visual.json', 'playwrightVisual'),
  },
];

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)} s`;
}

function main(): void {
  mkdirSync(REPORT_DIR, { recursive: true });
  const rows: string[][] = [];
  let failed = false;
  for (const step of steps) {
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
      writeNumbers({ ...numbers, tests: counts });
      console.log('\nRecorded the test counts in tests/baseline/numbers.json');
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
