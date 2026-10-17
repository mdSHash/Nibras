// Fixtures for the style snapshots (playwright.style.config.ts): the shared
// offline fixtures plus the app's own theme choice, and `capture`, which records
// a state's computed styles and screenshot and compares them with the base.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Locator, Page, TestInfo } from '@playwright/test';
import { test as base, expect, STORAGE } from '../e2e/support/fixtures';
import { prepareShot } from '../e2e/support/still';
import { dumpStyles, markMoving, type StyleDump } from './dump';

/** The app's dark-mode button: pressed to light or dark (stored), or never pressed (follows the system). */
export type AppTheme = 'light' | 'dark' | null;

export const test = base.extend<{ appTheme: AppTheme }>({
  appTheme: [null, { option: true }],
  page: async ({ page, appTheme }, use) => {
    if (appTheme) {
      await page.addInitScript(
        ({ key, value }) => localStorage.setItem(key, value),
        { key: STORAGE.theme, value: appTheme },
      );
    }
    await use(page);
  },
});

export { expect };

const MAX_LISTED = 60;

function compare(baseDump: StyleDump, dump: StyleDump): string[] {
  const lines: string[] = [];
  const moving = new Set([...baseDump.moving, ...dump.moving]);
  const paths = new Set([...Object.keys(baseDump.els), ...Object.keys(dump.els)]);
  for (const path of paths) {
    if (moving.has(path.replace(/::(before|after)$/, ''))) continue;
    const before = baseDump.els[path];
    const after = dump.els[path];
    if (before === undefined || after === undefined) {
      lines.push(`${before === undefined ? 'added' : 'removed'}: ${path} ${dump.labels[path] ?? baseDump.labels[path] ?? ''}`);
      continue;
    }
    const a = baseDump.rows[before];
    const b = dump.rows[after];
    if (a === b) continue;
    const pa = a.split('\n');
    const pb = b.split('\n');
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      if (pa[i] !== pb[i]) lines.push(`${path} ${dump.labels[path] ?? ''}\n    - ${pa[i]}\n    + ${pb[i]}`);
    }
  }
  return lines;
}

/**
 * A hovered or focused control: CSS transitions jump to their end, then three
 * samples 250 ms apart; a value still changing (a framer-motion loop or spring)
 * is recorded as "(moving)" instead of compared.
 */
async function dumpSettled(page: Page): Promise<StyleDump> {
  await page.evaluate(() => {
    if (document.getElementById('style-snapshot-still')) return;
    const style = document.createElement('style');
    style.id = 'style-snapshot-still';
    style.textContent = '[data-style-scope], [data-style-scope] * { transition: none !important; }';
    document.head.append(style);
  });
  const samples: StyleDump[] = [];
  for (let i = 0; i < 3; i++) {
    if (i > 0) await page.waitForTimeout(250);
    samples.push(await dumpStyles(page, '[data-style-scope]'));
  }
  const [first] = samples;
  const rows: string[] = [];
  const els: Record<string, number> = {};
  for (const path of Object.keys(first.els)) {
    const versions = samples.map((s) => (s.els[path] === undefined ? [] : s.rows[s.els[path]].split('\n')));
    const merged = versions[0].map((line, i) =>
      versions.every((v) => v[i] === line) ? line : `${line.slice(0, line.indexOf(':'))}: (moving)`,
    );
    els[path] = rows.push(merged.join('\n')) - 1;
  }
  return { rows, els, labels: first.labels, moving: first.moving };
}

/**
 * Records the state's computed styles and screenshot. With --update-snapshots
 * they become the base; otherwise both must equal the base exactly.
 * scope: record only this element (no screenshot). keepFocus: record as is
 * (hover and focus states), without settling the page first.
 */
export async function capture(
  page: Page,
  testInfo: TestInfo,
  name: string,
  options: { scope?: Locator; keepFocus?: boolean } = {},
): Promise<void> {
  if (!options.keepFocus) await prepareShot(page);
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-style-moving], [data-style-scope]')) {
      el.removeAttribute('data-style-moving');
      el.removeAttribute('data-style-scope');
    }
  });
  if (options.scope) await options.scope.first().evaluate((el) => el.setAttribute('data-style-scope', ''));
  // Leaflet adds markers in a different order from run to run; markers with the
  // same z-index then paint in a different order. Sort them the same way each time.
  await page.evaluate(() => {
    for (const pane of document.querySelectorAll('.leaflet-marker-pane, .leaflet-tooltip-pane, .leaflet-shadow-pane')) {
      const key = (el: Element) => `${String(Number((el as HTMLElement).style.zIndex || 0) + 1e6).padStart(9, '0')}|${el.outerHTML}`;
      const sorted = [...pane.children].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
      if (sorted.some((el, i) => el !== pane.children[i])) pane.append(...sorted);
    }
  });
  const probe = !!(options.scope && options.keepFocus);
  // Single controls in a hover or focus state: no screenshot, and no time to wait for loops.
  if (!probe) await markMoving(page);
  const dump = probe ? await dumpSettled(page) : await dumpStyles(page, options.scope ? '[data-style-scope]' : undefined);
  const file = testInfo.snapshotPath(`${name}.styles.json`);
  const diffFile = join(dirname(file), `${name}.diff.txt`);
  const updating = testInfo.config.updateSnapshots === 'all' || testInfo.config.updateSnapshots === 'changed';
  if (updating || !existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(dump));
  } else {
    const differences = compare(JSON.parse(readFileSync(file, 'utf8')) as StyleDump, dump);
    if (differences.length > 0) {
      writeFileSync(diffFile, `${differences.length} differences\n\n${differences.join('\n')}\n`);
    }
    expect.soft(differences.slice(0, MAX_LISTED), `computed styles of ${name} (all in ${diffFile})`).toEqual([]);
  }
  if (!options.scope) {
    await page.evaluate(() => document.documentElement.classList.add('style-snapshot-hide'));
    await expect.soft(page).toHaveScreenshot(`${name}.png`, { timeout: 15_000 });
    await page.evaluate(() => document.documentElement.classList.remove('style-snapshot-hide'));
  }
}
