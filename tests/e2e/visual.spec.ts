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
