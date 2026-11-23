import { test, expect, STORAGE } from './support/fixtures';
import { behavior, eventById, header, openApp, panelTitle } from './support/app';

test.describe('first visit @phone', () => {
  test.use({ firstVisit: true });

  test('intro finishes, the first event is selected and the tour asks (tours.spec.ts has the rest)', async ({ page }) => {
    await openApp(page);
    await expect(panelTitle(page)).toHaveText(eventById(behavior.autoSelectedEventId).title);
    await expect(page.getByTestId('tour-site').getByRole('dialog')).toBeVisible();
  });

  // Was known failure 9 in the Phase 0A baseline (fixed in Phase 2C).
  test('the intro can be skipped with a tap', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'عدّي المقدمة' })).toBeAttached(); // the intro is up
    await page.mouse.click(200, 200);
    // The intro goes at once (it would play for 4.2 s), then the app appears.
    await expect(page.getByRole('button', { name: 'عدّي المقدمة' })).toHaveCount(0, { timeout: 2_000 });
    await expect(header.chat(page)).toBeVisible();
  });

  test('a key skips the intro, and it does not play on the next visit', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'عدّي المقدمة' })).toBeAttached(); // the intro is up
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'عدّي المقدمة' })).toHaveCount(0, { timeout: 2_000 });
    await expect(header.chat(page)).toBeVisible();
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE.introSeen)).toBe('true');
    // Record whether the intro shows at all on the next visit (timing would depend on the machine).
    await page.addInitScript(() => {
      new MutationObserver(() => {
        if ([...document.querySelectorAll('button')].some((b) => b.textContent?.trim() === 'عدّي المقدمة')) {
          (window as Window & { __nibrasIntroShown?: boolean }).__nibrasIntroShown = true;
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await page.reload();
    await expect(header.chat(page)).toBeVisible();
    expect(await page.evaluate(() => (window as Window & { __nibrasIntroShown?: boolean }).__nibrasIntroShown)).toBeUndefined();
  });
});

test('returning visitor: header is usable and no prompt is shown @phone', async ({ page }) => {
  await openApp(page);
  await expect(header.chat(page)).toBeVisible();
  await expect(page.getByTestId('tour-site')).toHaveCount(0);
});
