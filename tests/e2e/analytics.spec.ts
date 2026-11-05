// Visitor analytics (Phase 3E): each custom event fires from the real UI with only
// the agreed data. A stand-in `window.umami` records the calls; the real tracker
// never loads in a test build (the fixture fails any test that contacts a host it does not stub).
import type { Page } from '@playwright/test';
import { test, expect, useChatResponder } from './support/fixtures';
import { header, openApp, openAppWithEvent, openEventBySearch, panel } from './support/app';

type Call = [name: string, data: Record<string, unknown>];

async function recordCalls(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const calls: unknown[] = [];
    Object.assign(window, { __umamiCalls: calls, umami: { track: (name: string, data: object) => calls.push([name, data]) } });
  });
}

const calls = (page: Page): Promise<Call[]> => page.evaluate(() => (window as unknown as { __umamiCalls: Call[] }).__umamiCalls);
const named = async (page: Page, name: string): Promise<Call[]> => (await calls(page)).filter(([n]) => n === name);

const chatDialog = (page: Page) => page.getByRole('dialog').filter({ has: page.getByPlaceholder('اكتب سؤالك هنا...') });

async function ask(page: Page, question: string): Promise<void> {
  await header.chat(page).click();
  await chatDialog(page).getByPlaceholder('اكتب سؤالك هنا...').fill(question);
  await chatDialog(page).getByRole('button', { name: 'إرسال' }).click();
}

test('a test build never loads the tracker', async ({ page }) => {
  await openAppWithEvent(page);
  await expect(page.locator('script[src*="umami"]')).toHaveCount(0);
  expect(await page.evaluate(() => 'umami' in window)).toBe(false);
});

test('the event the app opens by itself is not counted; one the visitor opens is, and the search with it', async ({ page }) => {
  await recordCalls(page);
  await openAppWithEvent(page);
  expect(await named(page, 'event_opened')).toEqual([]);

  await openEventBySearch(page, 'battle-badr', 'بدر');
  await expect.poll(() => named(page, 'event_opened')).toEqual([['event_opened', { event: 'battle-badr' }]]);
  await expect.poll(() => named(page, 'search_used')).toEqual([['search_used', { results: 'some' }]]);
  // What the visitor typed goes nowhere.
  expect(JSON.stringify(await calls(page))).not.toContain('بدر');
});

test('an event opened by a shared link is counted once', async ({ page }) => {
  await recordCalls(page);
  await page.goto('event/battle-badr/');
  await expect(panel(page).locator('h1')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => named(page, 'event_opened')).toEqual([['event_opened', { event: 'battle-badr' }]]);
});

test('a search that finds nothing is counted as such, once, and only when the drawer closes', async ({ page }) => {
  await recordCalls(page);
  await openApp(page);
  await header.search(page).click();
  const drawer = page.getByRole('dialog').filter({ has: page.getByRole('listbox') });
  await drawer.locator('input').first().fill('كلمة لا وجود لها إطلاقا');
  await expect(drawer.getByText('٠ حدث').or(drawer.getByText('0 حدث'))).toBeVisible();
  expect(await named(page, 'search_used')).toEqual([]);

  await drawer.getByRole('button', { name: 'إغلاق القائمة' }).click();
  await expect.poll(() => named(page, 'search_used')).toEqual([['search_used', { results: 'none' }]]);

  // Opening and closing again without a new query counts nothing.
  await header.search(page).click();
  await drawer.getByRole('button', { name: 'إغلاق القائمة' }).click();
  await expect(drawer).toBeHidden();
  expect(await named(page, 'search_used')).toHaveLength(1);
});

test('narration counts once per listen: pausing and resuming is the same one', async ({ page }) => {
  await recordCalls(page);
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  await panel(page).getByRole('button', { name: 'تشغيل السرد' }).click();
  await expect.poll(() => named(page, 'narration_played')).toEqual([['narration_played', { event: 'battle-badr' }]]);

  await panel(page).getByRole('button', { name: 'إيقاف السرد' }).click();
  await panel(page).getByRole('button', { name: /تشغيل السرد|استئناف السرد/ }).first().click();
  await expect(panel(page).getByRole('button', { name: 'إيقاف السرد' })).toBeVisible();
  expect(await named(page, 'narration_played')).toHaveLength(1);
});

test('opening a battle with a video counts it as a video', async ({ page }) => {
  await recordCalls(page);
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  await page.getByRole('button', { name: 'مشاهدة المعركة' }).click();
  await expect(page).toHaveURL(/\/battle\/battle-of-badr\/$/);
  await expect.poll(() => named(page, 'battle_played')).toEqual([['battle_played', { event: 'battle-badr', kind: 'video' }]]);
});

test('a chat question counts with how it was answered, never its text', async ({ page }) => {
  const question = 'ماذا حدث في غزوة بدر؟';
  await recordCalls(page);
  await openAppWithEvent(page);
  await ask(page, question);
  await expect.poll(() => named(page, 'chat_asked')).toEqual([['chat_asked', { mode: 'composed' }]]);
  expect(JSON.stringify(await calls(page))).not.toContain(question);
});

test.describe('API errors', () => {
  test.use({ allowedConsoleErrors: [/status of 503/] });

  test('a chat question the API fails on counts as an error', async ({ page }) => {
    useChatResponder(page, () => ({ status: 503, json: { error: 'unavailable', messageAr: 'الخدمة غير متاحة الآن' } }));
    await recordCalls(page);
    await openAppWithEvent(page);
    await ask(page, 'ماذا حدث في غزوة بدر؟');
    await expect.poll(() => named(page, 'chat_asked')).toEqual([['chat_asked', { mode: 'error' }]]);
  });
});
