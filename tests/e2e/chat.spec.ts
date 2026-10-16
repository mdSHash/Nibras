import { test, expect, useChatResponder } from './support/fixtures';
import { content, eventById, header, openAppWithEvent, panelTitle } from './support/app';
import { CITATION_LABELS, MOCK_COMPANION_ID, MOCK_QURAN_KEY, mockChatAnswer } from './support/chatMock';
import type { Page } from '@playwright/test';

const QUESTION = 'ماذا حدث في غزوة بدر؟';

const chatDialog = (page: Page) => page.getByRole('dialog').filter({ has: page.getByPlaceholder('اكتب سؤالك هنا...') });

async function openChat(page: Page): Promise<void> {
  if (await chatDialog(page).isVisible()) return;
  await header.chat(page).click();
  await expect(chatDialog(page)).toBeVisible();
}

async function ask(page: Page, question: string): Promise<void> {
  await openChat(page);
  await chatDialog(page).getByPlaceholder('اكتب سؤالك هنا...').fill(question);
  await chatDialog(page).getByRole('button', { name: 'إرسال' }).click();
  await expect(chatDialog(page).getByText(mockChatAnswer.answer.slice(0, 40)).first()).toBeVisible();
}

test('the chat sends the question to the API and renders the answer with citation chips @phone', async ({ page, network }) => {
  await openAppWithEvent(page);
  await openChat(page);
  // Starter questions (ExampleQuestions in ChatPanel.tsx) are shown before the first question.
  await expect(chatDialog(page).getByRole('button', { name: /؟$/ }).first()).toBeVisible();
  await ask(page, QUESTION);
  expect(network.chatRequests).toEqual([{ message: QUESTION }]);
  for (const label of Object.values(CITATION_LABELS)) {
    await expect(chatDialog(page).getByRole('button', { name: label, exact: true }).first()).toBeVisible();
  }
  await expect(chatDialog(page).getByRole('button', { name: mockChatAnswer.followUps[0] })).toBeVisible();
});

test('a follow-up question carries the previous context', async ({ page, network }) => {
  await openAppWithEvent(page);
  await ask(page, QUESTION);
  // useChat.ts allows one question every 3.5 s.
  await page.waitForTimeout(3_600);
  await chatDialog(page).getByRole('button', { name: mockChatAnswer.followUps[0] }).click();
  await expect.poll(() => network.chatRequests.length).toBe(2);
  expect(network.chatRequests[1]).toEqual({
    message: mockChatAnswer.followUps[0],
    context: { recordIds: mockChatAnswer.context.recordIds, previousQuestion: QUESTION },
  });
});

test('citations open the right event, person, Quran passage and battle', async ({ page }) => {
  await openAppWithEvent(page);
  await ask(page, QUESTION);

  await test.step('event', async () => {
    await chatDialog(page).getByRole('button', { name: CITATION_LABELS.event, exact: true }).click();
    await expect(panelTitle(page)).toHaveText(eventById('battle-badr').title);
  });

  await test.step('person', async () => {
    await openChat(page);
    await chatDialog(page).getByRole('button', { name: CITATION_LABELS.companion, exact: true }).click();
    const name = content.companions.find((c) => c.id === MOCK_COMPANION_ID)!.name;
    const bio = page.getByRole('dialog', { name });
    await expect(bio).toBeVisible();
    await bio.getByRole('button', { name: 'إغلاق' }).click();
    await expect(bio).toBeHidden();
  });

  await test.step('Quran passage', async () => {
    await openChat(page);
    await chatDialog(page).getByRole('button', { name: CITATION_LABELS.quran, exact: true }).click();
    const verses = page.getByRole('dialog', { name: MOCK_QURAN_KEY });
    await expect(verses).toBeVisible();
    await verses.getByRole('button', { name: 'إغلاق' }).click();
    await expect(verses).toBeHidden();
  });

  await test.step('battle', async () => {
    await openChat(page);
    await chatDialog(page).getByRole('button', { name: CITATION_LABELS.battle, exact: true }).click();
    const badrTitle = content.events.find((e) => e.id === 'battle-badr')!.title;
    await expect(page.locator('h1[lang="ar"]')).toHaveText(badrTitle, { timeout: 30_000 });
    await page.getByRole('button', { name: 'رجوع' }).click();
    await expect(page.locator('h1[lang="ar"]')).toBeHidden();
  });
});

test.describe('API errors', () => {
  test.use({ allowedConsoleErrors: [/status of 503/] });

  test('an API error shows the Arabic error message', async ({ page }) => {
    useChatResponder(page, () => ({ status: 503, json: { error: 'unavailable', messageAr: 'الخدمة غير متاحة الآن' } }));
    await openAppWithEvent(page);
    await openChat(page);
    await chatDialog(page).getByPlaceholder('اكتب سؤالك هنا...').fill(QUESTION);
    await chatDialog(page).getByRole('button', { name: 'إرسال' }).click();
    await expect(chatDialog(page).getByText('الخدمة غير متاحة الآن')).toBeVisible();
  });
});
