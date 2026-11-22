// Visual snapshots of key screens (baseline part 4), desktop and phone. Map
// tiles are a plain color, fonts are local copies, Math.random is seeded and
// CSS animations are disabled, so screenshots repeat. Stored per platform in
// tests/baseline/visual/<project>/; update only after Mostafa approves.
import { test, expect, useChatResponder } from './support/fixtures';
import { content, header, headerControl, openAppWithEvent, openEventBySearch, panel } from './support/app';
import { prepareShot, settle } from './support/still';
import { defaultChatReply } from './support/chatMock';
import type { Page } from '@playwright/test';

async function shot(page: Page, name: string): Promise<void> {
  await prepareShot(page);
  await expect(page).toHaveScreenshot(`${name}.png`, { timeout: 20_000 });
}

test.describe('visual @phone @visual', () => {
  // Settling and stillness checks add up; leave headroom when the machine is busy.
  test.describe.configure({ timeout: 90_000 });

  test('start view', async ({ page }) => {
    await openAppWithEvent(page);
    await settle(page, 3_500); // the 2.5 s flight to the first event
    await shot(page, 'start-view');
  });

  test('dark mode', async ({ page }) => {
    await openAppWithEvent(page);
    await (await headerControl(page, 'darkMode')).click();
    await settle(page, 3_500);
    await shot(page, 'dark-mode');
  });

  test('event panel', async ({ page }) => {
    await openAppWithEvent(page);
    await openEventBySearch(page, 'battle-badr', 'بدر');
    await settle(page, 3_500);
    // The play button shows only while the event has a fresh recording, and Phase 4 re-records
    // events over days; take it out so this shot shows the panel the same way with or without it
    // (narration itself: event-panel.spec.ts).
    await page.evaluate(() => {
      for (const b of document.querySelectorAll('button[aria-label="تشغيل السرد"]')) b.closest('.relative.shrink-0')?.remove();
    });
    await shot(page, 'event-panel-badr');
  });

  test('search open', async ({ page }) => {
    await openAppWithEvent(page);
    await settle(page, 3_000);
    await header.search(page).click();
    await expect(page.getByRole('dialog', { name: 'قائمة البحث' })).toBeVisible();
    await settle(page);
    await shot(page, 'search-open');
  });

  test('person bio', async ({ page }) => {
    await openAppWithEvent(page);
    await openEventBySearch(page, 'battle-badr', 'بدر');
    const person = content.events.find((e) => e.id === 'battle-badr')!.companionRoles[0];
    await panel(page).getByRole('button', { name: person.name }).first().click();
    await expect(page.getByRole('dialog', { name: content.companions.find((c) => c.id === person.companionId)!.name })).toBeVisible();
    await settle(page);
    await shot(page, 'person-bio');
  });

  test('Quran passage', async ({ page }) => {
    await openAppWithEvent(page);
    await openEventBySearch(page, 'battle-badr', 'بدر');
    await panel(page).getByRole('button', { name: /عرض الآيات/ }).first().click();
    await expect(page.getByRole('dialog', { name: 'سورة الأنفال: 9' })).toBeVisible();
    await settle(page);
    await shot(page, 'quran-passage');
  });

  test('help', async ({ page }) => {
    await openAppWithEvent(page);
    await settle(page, 3_000);
    await (await headerControl(page, 'help')).click();
    await expect(page.getByRole('dialog', { name: /دليل/ })).toBeVisible();
    await settle(page);
    await shot(page, 'help');
  });

  test('chat with an answer', async ({ page }) => {
    useChatResponder(page, defaultChatReply);
    await openAppWithEvent(page);
    await settle(page, 3_000);
    await header.chat(page).click();
    const input = page.getByPlaceholder('اكتب سؤالك هنا...');
    await input.fill('ماذا حدث في غزوة بدر؟');
    await page.getByRole('button', { name: 'إرسال' }).click();
    await expect(page.getByRole('button', { name: 'متى كانت غزوة أحد؟' })).toBeVisible();
    await input.blur();
    await settle(page);
    await shot(page, 'chat');
  });
});

// «تحدي اليوم» (Phase 5): the level sheet and the result card, light and dark, at 390 px (phone) and
// desktop. The day is fixed, so the question and its options are the same on every run; test builds
// have no Supabase settings, so the card shows no live numbers.
test.describe('daily challenge visual @phone @visual', () => {
  test.describe.configure({ timeout: 90_000 });
  const DAY = new Date('2026-11-20T10:00:00+02:00');

  async function openGame(page: Page, theme: 'light' | 'dark', isPhone: boolean): Promise<void> {
    if (isPhone) await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.setFixedTime(DAY);
    await page.addInitScript((t) => localStorage.setItem('nibras.challenge.theme', t), theme);
    await page.goto('challenge/');
    await expect(page.getByRole('dialog', { name: 'إنت قد إيه عارف؟' })).toBeVisible();
  }

  for (const theme of ['light', 'dark'] as const) {
    test(`level sheet, ${theme}`, async ({ page }, testInfo) => {
      await openGame(page, theme, testInfo.project.name === 'phone');
      await settle(page, 500);
      await prepareShot(page);
      await expect(page).toHaveScreenshot(`challenge-level-sheet-${theme}.png`, { timeout: 20_000 });
    });

    test(`result card, ${theme}`, async ({ page }, testInfo) => {
      await openGame(page, theme, testInfo.project.name === 'phone');
      await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
      // The same picks every run: the first option still open, until the round ends.
      for (let i = 0; i < 3 && !(await page.locator('.win').isVisible()); i++) await page.locator('.cards .opt:not([disabled])').first().click();
      await expect(page.locator('.win')).toBeVisible();
      // The page scrolls itself to the end once the round is over; wait for that, then shoot from the top
      // so the fixed bottom bar and the sticky header land in the same place every run.
      await settle(page, 1200);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await settle(page, 500);
      await prepareShot(page);
      await expect(page).toHaveScreenshot(`challenge-result-${theme}.png`, { fullPage: true, timeout: 20_000 });
    });
  }
});
