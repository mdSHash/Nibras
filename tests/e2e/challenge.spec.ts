// «تحدي اليوم» (Phase 5): the standalone game at /Nibras/challenge/. Plays every mode at every
// level to the result, at phone width, with no console errors (the fixture fails on any).
import type { Page } from '@playwright/test';
import { test, expect } from './support/fixtures';

const MODES = ['من أكون؟', 'المعركة', 'المكان', 'السنة', 'الرقم', 'القائد', 'العهد', 'رتّب'];
const LEVELS = ['لسه ببتدي', 'عارف شوية', 'أستاذ فيها'];

async function playToResult(page: Page): Promise<void> {
  for (let i = 0; i < 8 && !(await page.locator('.win').isVisible()); i++) {
    if (await page.locator('.order').isVisible()) {
      // A different order each attempt (a repeated order is ignored by the game).
      for (let left = await page.locator('.pool .opt').count(); left > 0; left--) await page.locator('.pool .opt').nth(i % left).click();
      await page.getByRole('button', { name: 'اتأكد من الترتيب' }).click();
    } else {
      await page.locator('.opts .opt:not([disabled])').first().click();
    }
  }
  await expect(page.locator('.win')).toBeVisible();
}

test.describe('daily challenge', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens on the level sheet, then every mode at every level plays to the result @phone', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('challenge/');
    await expect(page.getByRole('dialog', { name: 'إنت قد إيه عارف؟' })).toBeVisible();
    for (const [i, level] of LEVELS.entries()) {
      if (i === 0) await page.getByRole('dialog').getByRole('button', { name: new RegExp(level) }).click();
      else {
        await page.locator('.chip').click();
        await page.getByRole('dialog').getByRole('button', { name: new RegExp(level) }).click();
      }
      await expect(page.locator('.chip')).toHaveText(level);
      for (const mode of MODES) {
        await page.getByRole('tab', { name: new RegExp(`^${mode}`) }).click();
        await playToResult(page);
        await expect(page.getByRole('tab', { name: new RegExp(`^${mode}`) }).locator('.mark')).toBeVisible();
      }
    }
  });

  test('a wrong pick adds a tile row with a link into Nibras, and the result survives a reload', async ({ page }) => {
    await page.goto('challenge/');
    await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
    const options = page.locator('.opts .opt');
    for (let i = 0; i < 5; i++) {
      await options.nth(i).click();
      if (await page.locator('.win').isVisible()) break;
      await expect(page.locator('.grid .row').first().locator('a')).toHaveAttribute('href', /\/Nibras\/person\//);
    }
    await expect(page.locator('.win')).toBeVisible();
    await page.reload();
    await expect(page.locator('.win')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('practice rounds start from the result and say they do not count', async ({ page }) => {
    await page.goto('challenge/');
    await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
    await playToResult(page);
    await page.getByRole('button', { name: 'العب أسئلة زيادة (تدريب)' }).click();
    await expect(page.locator('.banner')).toContainText('مش بتتحسب');
    await playToResult(page);
    await expect(page.getByRole('button', { name: 'سؤال تاني' })).toBeVisible();
  });

  test('is installable: manifest and service worker are served', async ({ page, request }) => {
    await page.goto('challenge/');
    const href = await page.locator('link[rel="manifest"]').getAttribute('href');
    const manifest = await (await request.get(`challenge/${href}`)).json();
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect((await request.get('challenge/sw.js')).ok()).toBe(true);
  });
});
