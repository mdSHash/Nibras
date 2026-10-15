// Browser-only baseline numbers: marker and cluster counts at the start view and
// first-load request counts, per project. They depend on font rendering (map size),
// so like the screenshots they are kept per platform: tests/baseline/behavior-ui.json
// for Windows (where the baseline was captured), behavior-ui-<platform>.json elsewhere.
// Compared on every run; rewritten only with UPDATE_BASELINE=1 (after approval).
// On a platform with no file yet the numbers are recorded instead of compared
// (tmp/ui-baseline/, merged into that platform's file by npm run verify) for review.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type TestInfo } from '@playwright/test';

const ROOT = join(import.meta.dirname, '..', '..', '..');
export const UI_BASELINE_FILE = join(
  ROOT,
  'tests',
  'baseline',
  process.platform === 'win32' ? 'behavior-ui.json' : `behavior-ui-${process.platform}.json`,
);
export const UI_RECORD_DIR = join(ROOT, 'tmp', 'ui-baseline');

type UiBaseline = Record<string, Record<string, unknown>>;

function read(): UiBaseline {
  return existsSync(UI_BASELINE_FILE) ? (JSON.parse(readFileSync(UI_BASELINE_FILE, 'utf8')) as UiBaseline) : {};
}

export function expectUiBaseline(testInfo: TestInfo, key: string, actual: unknown): void {
  const project = testInfo.project.name;
  const name = UI_BASELINE_FILE.split(/[\\/]/).pop();
  if (process.env.UPDATE_BASELINE) {
    if (testInfo.config.workers > 1) throw new Error('Update the UI baseline with --workers=1 so writes do not race.');
    const data = read();
    data[project] = { ...data[project], [key]: actual };
    const sorted = Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync(UI_BASELINE_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
    return;
  }
  if (!existsSync(UI_BASELINE_FILE)) {
    // One file per value, so parallel workers never write the same file.
    mkdirSync(UI_RECORD_DIR, { recursive: true });
    writeFileSync(join(UI_RECORD_DIR, `${project}~${key}.json`), JSON.stringify(actual));
    testInfo.annotations.push({ type: 'ui-baseline', description: `recorded ${project}.${key} (no ${name} yet)` });
    return;
  }
  const expected = read()[project]?.[key];
  expect(expected, `tests/baseline/${name} has no ${project}.${key}; run with UPDATE_BASELINE=1 once`).toBeDefined();
  expect(actual, `${project}.${key} matches tests/baseline/${name}`).toEqual(expected);
}
