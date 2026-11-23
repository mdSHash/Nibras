// The narrated tours (Phase 7, «كروت بالرسم»): Nibras's first-visit tour and «تحدي اليوم»'s.
// Each opens by itself on a first visit only, can be declined or closed, replays from its button,
// shows every card's text, and plays a card's recording when it has a fresh one (src/generated/
// tours.json says which); without one, or with «من غير صوت», it plays nothing and the text shows.
import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import type { GeneratedTours, TourId } from '../../shared/tours';
import { test, expect, STORAGE } from './support/fixtures';
import { headerControl, openApp, openAppWithEvent } from './support/app';

const TOURS = JSON.parse(readFileSync(new URL('../../src/generated/tours.json', import.meta.url), 'utf8')) as GeneratedTours;
const tourDialog = (page: Page, id: TourId) => page.getByTestId(`tour-${id}`).getByRole('dialog');

/** Goes through every card with «اللي بعده», checking each one's title and full text, then closes on the last. */
async function readAllCards(page: Page, id: TourId): Promise<void> {
  const dialog = tourDialog(page, id);
  for (const [i, step] of TOURS[id].steps.entries()) {
    await expect(dialog.getByRole('heading')).toHaveText(step.title);
    await expect(dialog.locator('.tc-line')).toHaveText(`${step.text.split(/\s+/).join(' ')} `);
    await dialog.getByRole('button', { name: i === TOURS[id].steps.length - 1 ? 'يلا نبدأ ✓' : 'اللي بعده ‹' }).click();
  }
  await expect(page.getByTestId(`tour-${id}`)).toHaveCount(0);
}

test.describe('Nibras tour, first visit @phone', () => {
  test.use({ firstVisit: true });

  test('asks once after the intro; «مش دلوقتي» closes it and it does not come back', async ({ page }) => {
    await openApp(page);
    const dialog = tourDialog(page, 'site');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading')).toHaveText(TOURS.site.steps[0].title);
    await expect(dialog).toContainText(TOURS.site.ask);
    await dialog.getByRole('button', { name: 'مش دلوقتي' }).click();
    await expect(page.getByTestId('tour-site')).toHaveCount(0);
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE.tourPrompted)).toBe('true');
    await page.reload();
    await openApp(page);
    await page.waitForTimeout(1_500);
    await expect(page.getByTestId('tour-site')).toHaveCount(0);
  });

  test('«من غير صوت»: every card shows its text, nothing plays, and the last card ends it', async ({ page, network }) => {
    await openApp(page);
    await tourDialog(page, 'site').getByRole('button', { name: 'من غير صوت' }).click();
    await readAllCards(page, 'site');
    expect(network.audioRequests.filter((u) => u.startsWith('tour-'))).toEqual([]);
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE.tourPrompted)).toBe('true');
  });

  test('«وريني 🔊» plays the card\'s recording when it has one, and shows the text either way', async ({ page, network }) => {
    await openApp(page);
    const first = TOURS.site.steps[0];
    await tourDialog(page, 'site').getByRole('button', { name: 'وريني 🔊' }).click();
    await expect(tourDialog(page, 'site').locator('.tc-line')).toContainText(first.text.split(/\s+/)[0]);
    if (first.clip) {
      await expect.poll(() => network.audioRequests.includes(`tour-site-${first.id}.${first.clip}.m4a`)).toBe(true);
    } else {
      // Not recorded yet (the daily narration run records the cards): the whole line shows at once.
      await page.waitForTimeout(500);
      expect(network.audioRequests.filter((u) => u.startsWith('tour-'))).toEqual([]);
      await expect(tourDialog(page, 'site').locator('.tc-line.all')).toBeVisible();
    }
  });
});

test.describe('Nibras tour, from the compass @phone', () => {
  test('a returning visitor is not asked; the compass opens the cards at once, Escape closes them', async ({ page }) => {
    await openApp(page);
    await page.waitForTimeout(800);
    await expect(page.getByTestId('tour-site')).toHaveCount(0);
    await (await headerControl(page, 'tour')).click();
    const dialog = tourDialog(page, 'site');
    await expect(dialog.getByRole('button', { name: 'اللي بعده ‹' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'مش دلوقتي' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /اكتم الصوت|شغّل الصوت/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('tour-site')).toHaveCount(0);
  });

  test('«وريني فين» on a card inside the event panel opens an event and lights the part up', async ({ page }) => {
    await openAppWithEvent(page);
    await (await headerControl(page, 'tour')).click();
    const dialog = tourDialog(page, 'site');
    const at = TOURS.site.steps.findIndex((s) => s.id === 'people');
    for (let i = 0; i < at; i++) await dialog.getByRole('button', { name: 'اللي بعده ‹' }).click();
    await expect(dialog.getByRole('heading')).toHaveText(TOURS.site.steps[at].title);
    await dialog.getByRole('button', { name: 'وريني فين' }).click();
    await expect(page.locator('.tc-ring')).toBeVisible();
    await expect(page.locator('.tc-ring')).toHaveCount(0, { timeout: 4_000 });
    await page.getByRole('button', { name: 'اقفل الجولة' }).click();
    await expect(page.getByTestId('tour-site')).toHaveCount(0);
  });
});

test.describe('«تحدي اليوم» tour @phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.describe('first visit', () => {
    test.use({ firstVisit: true });

    test('asks after the level is picked, once', async ({ page }) => {
      await page.goto('challenge/');
      await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
      const dialog = tourDialog(page, 'game');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText(TOURS.game.ask);
      await dialog.getByRole('button', { name: 'مش دلوقتي' }).click();
      await expect(page.getByTestId('tour-game')).toHaveCount(0);
      expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE.gameTour)).toBe('1');
      await page.reload();
      await expect(page.locator('.cards')).toBeVisible();
      await page.waitForTimeout(800);
      await expect(page.getByTestId('tour-game')).toHaveCount(0);
    });
  });

  test('«إزاي ألعب؟» replays it; every card shows its text, and the game still plays after', async ({ page, network }) => {
    await page.goto('challenge/');
    await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
    await expect(page.getByTestId('tour-game')).toHaveCount(0);
    await page.getByRole('button', { name: 'إزاي ألعب؟' }).click();
    await page.getByRole('button', { name: 'اكتم الصوت' }).click();
    await readAllCards(page, 'game');
    expect(network.audioRequests.filter((u) => u.startsWith('tour-'))).toEqual([]);
    await page.locator('.cards .opt').first().click();
    await expect(page.locator('.cards .pc').first()).toBeVisible();
  });
});
