// The app's dark-mode button decides every part's colors (Phase 3B): before,
// Tailwind's `dark:` classes followed the system setting, so with the app dark
// and the system light the Quran window and the tour stayed light. Playwright
// runs with a light system, so pressing the button is that mixed case. Text
// must pass WCAG AA (4.5, or 3 for large text) in both modes.
import type { Locator, Page } from '@playwright/test';
import { test, expect, STORAGE } from './support/fixtures';
import { headerControl, openApp, openEventBySearch, panel } from './support/app';
import { cairoToday, daysAgo, mockAccounts, signedIn, won } from './support/accountMock';

interface Reading {
  name: string;
  ratio: number;
  large: boolean;
  background: number[];
}

/** Contrast of each text element in `root` against its background (translucent layers composited). */
async function readings(root: Locator, selectors: Record<string, string>): Promise<Reading[]> {
  return root.evaluate((el, selectors) => {
    const canvas = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
    const rgba = (color: string): number[] => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = color;
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    // The background behind `node`: its own and its ancestors' colors, top layer first, until one is opaque.
    const backgroundOf = (node: Element): number[] => {
      const layers: number[][] = [];
      for (let n: Element | null = node; n; n = n.parentElement) {
        const c = rgba(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] >= 1) break;
      }
      let out = [255, 255, 255];
      for (const [r, g, b, a] of layers.reverse()) out = [r, g, b].map((v, i) => v * a + out[i] * (1 - a));
      return out;
    };
    const luminance = (c: number[]) =>
      c
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    return Object.entries(selectors).map(([name, selector]) => {
      const node = el.querySelector(selector);
      if (!node) throw new Error(`no ${name} (${selector})`);
      const style = getComputedStyle(node);
      const background = backgroundOf(node);
      const [fr, fg, fb, fa] = rgba(style.color);
      const text = [fr, fg, fb].map((v, i) => v * fa + background[i] * (1 - fa));
      const [a, b] = [luminance(text), luminance(background)].sort((x, y) => y - x);
      const size = parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      return { name, ratio: Number(((a + 0.05) / (b + 0.05)).toFixed(2)), large, background };
    });
  }, selectors);
}

function expectReadable(results: Reading[], mode: string): void {
  for (const { name, ratio, large } of results) {
    expect(ratio, `${mode} mode: ${name} contrast`).toBeGreaterThanOrEqual(large ? 3 : 4.5);
  }
}

const isDark = (background: number[]) => background.reduce((sum, v) => sum + v, 0) / 3 < 128;

async function setMode(page: Page, mode: 'light' | 'dark'): Promise<void> {
  const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (dark !== (mode === 'dark')) await (await headerControl(page, 'darkMode')).click();
}

test('the Quran window follows the dark-mode button and its text passes AA', async ({ page }) => {
  await openApp(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  for (const mode of ['light', 'dark'] as const) {
    await setMode(page, mode);
    await panel(page).getByRole('button', { name: /عرض الآيات/ }).first().click();
    const quran = page.getByRole('dialog', { name: 'سورة الأنفال: 9' });
    await expect(quran).toBeVisible();
    await expect(quran.locator('p.text-center')).toBeVisible();
    const results = await readings(quran, {
      reference: '#quran-modal-title',
      details: '#quran-modal-title + p',
      verses: 'p.text-center',
      link: 'a[href]',
    });
    expectReadable(results, mode);
    expect(isDark(results[2].background), `${mode} mode: the verses' background follows the button`).toBe(mode === 'dark');
    await quran.getByRole('button', { name: 'اقفل' }).click();
    await expect(quran).toBeHidden();
  }
});

test.describe('first visit', () => {
  test.use({ firstVisit: true });

  for (const mode of ['light', 'dark'] as const) {
    test(`the tour cards follow the ${mode} mode and their text passes AA`, async ({ page }) => {
      // The visitor's choice from an earlier visit, while the system stays light.
      await page.addInitScript(([key, m]) => localStorage.setItem(key, m), [STORAGE.theme, mode] as const);
      await page.goto('./');
      const card = page.getByTestId('tour-site').getByRole('dialog');
      await expect(card).toBeVisible({ timeout: 30_000 });
      const asking = await readings(card, { title: 'h2', text: '.tc-line', button: '.tc-btn', go: '.tc-btn.go' });
      expectReadable(asking, mode);
      expect(isDark(asking[1].background), 'the card is dark like the app').toBe(mode === 'dark');
      await card.getByRole('button', { name: 'من غير صوت' }).click();
      await card.getByRole('button', { name: 'اللي بعده ‹' }).click();
      expectReadable(await readings(card, { text: '.tc-line', where: '.tc-btn.link', back: '.tc-btn', go: '.tc-btn.go' }), mode);
    });
  }
});

test('«تحدي اليوم» tour: the cards pass AA in both modes @phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const mode of ['light', 'dark'] as const) {
    await page.goto('challenge/');
    await page.evaluate((m) => localStorage.setItem('nibras.challenge.theme', m), mode);
    await page.reload();
    const levels = page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ });
    if (mode === 'light') await levels.click();
    await page.getByRole('button', { name: 'إزاي ألعب؟' }).click();
    const card = page.getByTestId('tour-game').getByRole('dialog');
    await expect(card).toBeVisible();
    const results = await readings(card, { title: 'h2', text: '.tc-line', where: '.tc-btn.link', go: '.tc-btn.go' });
    expectReadable(results, mode);
    expect(isDark(results[1].background)).toBe(mode === 'dark');
    await page.keyboard.press('Escape');
  }
});

test('«تحدي اليوم» accounts: the board and «حسابي» pass AA in both modes @phone', async ({ page }) => {
  const m = await mockAccounts(page, [won(daysAgo(1)), { ...won(daysAgo(2)), won: false }, won(cairoToday(), 'era')]);
  m.name = 'نور';
  await signedIn(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const mode of ['light', 'dark'] as const) {
    await page.goto('challenge/#board');
    await page.evaluate((dark) => {
      localStorage.setItem('nibras.challenge.theme', dark ? 'dark' : 'light');
      localStorage.setItem('nibras.challenge.v1', JSON.stringify({ version: 1, level: 'easy', date: '2000-01-01', results: {}, streaks: { easy: { current: 0, best: 0, lastWin: null }, mid: { current: 0, best: 0, lastWin: null }, hard: { current: 0, best: 0, lastWin: null } } }));
    }, mode === 'dark');
    await page.reload();
    await expect(page.locator('.bd-row.pinned')).toBeVisible();
    const body = await page.evaluate(() => (getComputedStyle(document.body).backgroundColor.match(/\d+/g) ?? []).slice(0, 3).map(Number));
    expect(isDark(body)).toBe(mode === 'dark');
    expectReadable(await readings(page.locator('main'), { rank: '.bd-row .bd-rank', name: '.bd-row .bd-name', score: '.bd-row .bd-score', 'my name': '.bd-row.pinned .bd-name small', 'my score': '.bd-row.pinned .bd-score', note: '.acc-small' }), mode);
    await page.goto('challenge/#account');
    await expect(page.locator('.cal-day.won')).not.toHaveCount(0);
    expectReadable(await readings(page.locator('main'), { 'empty day': '.cal-day:not(.won):not(.lost):not(.empty)', 'won day': '.cal-day.won', 'lost day': '.cal-day.lost', win: '.hist .ok', loss: '.hist .no', delete: '.btn.danger', label: '.streaks small' }), mode);
  }
});
