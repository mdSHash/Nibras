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
