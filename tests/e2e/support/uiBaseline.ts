// Browser-only baseline numbers (tests/baseline/behavior-ui.json): marker and
// cluster counts at the start view and first-load request counts, per project.
// Compared on every run; rewritten only with UPDATE_BASELINE=1 (after approval).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type TestInfo } from '@playwright/test';

const FILE = join(import.meta.dirname, '..', '..', 'baseline', 'behavior-ui.json');

type UiBaseline = Record<string, Record<string, unknown>>;

function read(): UiBaseline {
  return existsSync(FILE) ? (JSON.parse(readFileSync(FILE, 'utf8')) as UiBaseline) : {};
}

export function expectUiBaseline(testInfo: TestInfo, key: string, actual: unknown): void {
  const project = testInfo.project.name;
  if (process.env.UPDATE_BASELINE) {
    if (testInfo.config.workers > 1) throw new Error('Update the UI baseline with --workers=1 so writes do not race.');
    const data = read();
    data[project] = { ...data[project], [key]: actual };
    const sorted = Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync(FILE, `${JSON.stringify(sorted, null, 2)}\n`);
    return;
  }
  const expected = read()[project]?.[key];
  expect(expected, `tests/baseline/behavior-ui.json has no ${project}.${key}; run with UPDATE_BASELINE=1 once`).toBeDefined();
  expect(actual, `${project}.${key} matches tests/baseline/behavior-ui.json`).toEqual(expected);
}
