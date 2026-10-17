import { test, expect, STORAGE } from './support/fixtures';
import { behavior, clickAnimated, eventById, header, openApp, panelTitle } from './support/app';

test.describe('first visit @phone', () => {
  test.use({ firstVisit: true });

  test('intro finishes, the first event is selected and the tour prompt appears', async ({ page }) => {
    await openApp(page);
    await expect(panelTitle(page)).toHaveText(eventById(behavior.autoSelectedEventId).title);
    const prompt = page.getByRole('dialog', { name: /مرحباً بك في نبراس/ });
    await expect(prompt).toBeVisible();
    await clickAnimated(prompt.getByRole('button', { name: 'تخطي' }));
    await expect(prompt).toBeHidden();
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE.tourPrompted)).toBe('true');
  });

  test('the tour prompt does not appear on the second visit', async ({ page }) => {
    await openApp(page);
    const prompt = page.getByRole('dialog', { name: /مرحباً بك في نبراس/ });
    await expect(prompt).toBeVisible();
    await clickAnimated(prompt.getByRole('button', { name: 'تخطي' }));
    await page.reload();
    await openApp(page);
    await expect(panelTitle(page)).toHaveText(eventById(behavior.autoSelectedEventId).title);
    await page.waitForTimeout(2_000);
    await expect(prompt).toBeHidden();
  });

  // Was known failure 9 in the Phase 0A baseline (fixed in Phase 2C).
  test('the intro can be skipped with a tap', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'تخطي المقدمة' })).toBeAttached(); // the intro is up
    await page.mouse.click(200, 200);
    // The intro goes at once (it would play for 4.2 s), then the app appears.
    await expect(page.getByRole('button', { name: 'تخطي المقدمة' })).toHaveCount(0, { timeout: 1_000 });
    await expect(header.chat(page)).toBeVisible();
  });

  test('a key skips the intro, and it does not play on the next visit', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'تخطي المقدمة' })).toBeAttached(); // the intro is up
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'تخطي المقدمة' })).toHaveCount(0, { timeout: 1_000 });
    await expect(header.chat(page)).toBeVisible();
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE.introSeen)).toBe('true');
    await page.reload();
    // Well before the 4.2 s the intro would take.
    await expect(header.chat(page)).toBeVisible({ timeout: 3_000 });
  });

  test('starting the tour opens its first step', async ({ page }) => {
    await openApp(page);
    const prompt = page.getByRole('dialog', { name: /مرحباً بك في نبراس/ });
    await clickAnimated(prompt.getByRole('button', { name: 'ابدأ الجولة' }));
    await expect(prompt).toBeHidden();
    await expect(page.getByRole('button', { name: 'إغلاق الجولة' })).toBeVisible();
    await page.getByRole('button', { name: 'إغلاق الجولة' }).click();
    await expect(page.getByRole('button', { name: 'إغلاق الجولة' })).toBeHidden();
  });
});

test('returning visitor: header is usable and no prompt is shown @phone', async ({ page }) => {
  await openApp(page);
  await expect(header.chat(page)).toBeVisible();
  await expect(page.getByRole('dialog', { name: /مرحباً بك في نبراس/ })).toBeHidden();
});
