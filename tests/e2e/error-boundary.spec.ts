// Error boundaries (Phase 0B): a crash in one part shows the Arabic fallback in
// its place and the rest of the app keeps working. The crash is real: the help
// modal's code chunk fails to load, as it would after a deploy or a network drop.
import type { Page } from '@playwright/test';
import { test, expect } from './support/fixtures';
import { header, openApp } from './support/app';

test.use({
  // Expected noise from the forced failure: the blocked request, and React logging the caught error.
  // (A list of several patterns must be passed as [value, options]: Playwright reads any array
  // whose second item is an object as that pair.)
  allowedConsoleErrors: [
    [
      /Failed to load resource/,
      /dynamically imported module|Importing a module script failed|error loading dynamically imported module/i,
      /HelpModal/,
      /error occurred in/i,
      // Firefox prints the logged Error object as the bare text "Error".
      /^Error$/,
    ],
    { scope: 'test' },
  ],
});

async function breakHelpModal(page: Page): Promise<void> {
  await page.route('**/assets/HelpModal-*.js', route => route.abort());
}

const fallback = (page: Page) => page.getByRole('alert').filter({ hasText: 'حدث خطأ غير متوقع' });

/** WCAG contrast ratios of the fallback's text against the card background. */
async function fallbackContrast(page: Page): Promise<Record<string, number>> {
  return fallback(page).evaluate(card => {
    const rgb = (color: string): number[] => {
      const canvas = document.createElement('canvas').getContext('2d')!;
      canvas.fillStyle = color;
      canvas.fillRect(0, 0, 1, 1);
      return [...canvas.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const luminance = (c: number[]) =>
      c
        .map(v => v / 255)
        .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (fg: string, bg: string) => {
      const [a, b] = [luminance(rgb(fg)), luminance(rgb(bg))].sort((x, y) => y - x);
      return Number(((a + 0.05) / (b + 0.05)).toFixed(2));
    };
    const cardBg = getComputedStyle(card).backgroundColor;
    const [title, text] = [card.querySelector('h2')!, card.querySelector('p')!];
    const [reload, close] = [...card.querySelectorAll('button')];
    return {
      title: ratio(getComputedStyle(title).color, cardBg),
      text: ratio(getComputedStyle(text).color, cardBg),
      reload: ratio(getComputedStyle(reload).color, getComputedStyle(reload).backgroundColor),
      close: ratio(getComputedStyle(close).color, cardBg),
    };
  });
}

test('a panel that fails to load shows the Arabic fallback and the rest keeps working @phone', async ({ page }) => {
  await breakHelpModal(page);
  await openApp(page);
  await header.help(page).click();

  await expect(fallback(page)).toBeVisible();
  await expect(fallback(page).getByRole('button', { name: 'إعادة التحميل' })).toBeVisible();

  // Closing the broken panel removes the message; the header and search still work.
  await fallback(page).getByRole('button', { name: 'إغلاق' }).click();
  await expect(fallback(page)).toBeHidden();
  await header.search(page).click();
  await expect(page.getByRole('textbox', { name: 'بحث' })).toBeVisible();
});

test('the fallback text is readable in light and dark mode', async ({ page }) => {
  await breakHelpModal(page);
  await openApp(page);
  for (const mode of ['light', 'dark']) {
    if (mode === 'dark') await header.darkMode(page).click();
    await header.help(page).click();
    await expect(fallback(page)).toBeVisible();
    const contrast = await fallbackContrast(page);
    for (const [part, value] of Object.entries(contrast)) {
      expect(value, `${mode} mode: ${part} contrast`).toBeGreaterThanOrEqual(4.5);
    }
    await fallback(page).getByRole('button', { name: 'إغلاق' }).click();
    await expect(fallback(page)).toBeHidden();
  }
});
