// The app's dark-mode button decides every part's colors (Phase 3B): before,
// Tailwind's `dark:` classes followed the system setting, so with the app dark
// and the system light the Quran window and the tour stayed light. Playwright
// runs with a light system, so pressing the button is that mixed case. Text
// must pass WCAG AA (4.5, or 3 for large text) in both modes.
import type { Locator, Page } from '@playwright/test';
import { test, expect } from './support/fixtures';
import { clickAnimated, headerControl, openApp, openEventBySearch, panel } from './support/app';

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
    await quran.getByRole('button', { name: 'إغلاق' }).click();
    await expect(quran).toBeHidden();
  }
});

test.describe('first visit', () => {
  test.use({ firstVisit: true });

  test('the tour follows the dark-mode button and its text passes AA', async ({ page }) => {
    // The visitor's choice from an earlier visit, while the system stays light.
    await page.addInitScript(() => localStorage.setItem('nibras.theme', 'dark'));
    await page.goto('./');
    const prompt = page.getByRole('dialog', { name: /مرحباً بك في نبراس/ });
    await expect(prompt).toBeVisible({ timeout: 30_000 });
    await clickAnimated(prompt.getByRole('button', { name: 'ابدأ الجولة' }));
    const close = page.getByRole('button', { name: 'إغلاق الجولة' });
    await expect(close).toBeVisible();
    const tooltip = close.locator('xpath=ancestor::div[contains(@class, "rounded-2xl")][1]');
    const results = await readings(tooltip, { title: 'h3', text: 'div.leading-relaxed' });
    expectReadable(results, 'dark');
    expect(isDark(results[1].background), 'the tour step is dark like the app').toBe(true);
  });
});
