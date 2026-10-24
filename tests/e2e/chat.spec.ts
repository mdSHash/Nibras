import { test, expect, useChatResponder } from './support/fixtures';
import { content, eventById, header, openAppWithEvent, panelTitle } from './support/app';
import { CITATION_LABELS, MOCK_COMPANION_ID, MOCK_QURAN_KEY, mockChatAnswer, shapedAnswer } from './support/chatMock';
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

test('citations open the right event, person and Quran passage', async ({ page }) => {
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
});

test.describe('API errors', () => {
  test.use({ allowedConsoleErrors: [/status of (503|429)/] });

  test('the per-IP limit shows its Arabic message', async ({ page }) => {
    const message = 'لقد أرسلت أسئلة كثيرة في وقت قصير. حاول مرة أخرى بعد قليل.';
    useChatResponder(page, () => ({ status: 429, json: { error: 'too_many_requests', messageAr: message } }));
    await openAppWithEvent(page);
    await openChat(page);
    await chatDialog(page).getByPlaceholder('اكتب سؤالك هنا...').fill(QUESTION);
    await chatDialog(page).getByRole('button', { name: 'إرسال' }).click();
    await expect(chatDialog(page).getByText(message)).toBeVisible();
  });

  test('an API error shows the Arabic error message', async ({ page }) => {
    useChatResponder(page, () => ({ status: 503, json: { error: 'unavailable', messageAr: 'الخدمة غير متاحة الآن' } }));
    await openAppWithEvent(page);
    await openChat(page);
    await chatDialog(page).getByPlaceholder('اكتب سؤالك هنا...').fill(QUESTION);
    await chatDialog(page).getByRole('button', { name: 'إرسال' }).click();
    await expect(chatDialog(page).getByText('الخدمة غير متاحة الآن')).toBeVisible();
  });
});

test.describe('answer shapes and conversation flows (3J)', () => {
  const typeAndSend = async (page: Page, question: string) => {
    await openChat(page);
    await chatDialog(page).getByPlaceholder('اكتب سؤالك هنا...').fill(question);
    await chatDialog(page).getByRole('button', { name: 'إرسال' }).click();
  };

  test('paragraph, fact rows and numbered steps render with their headings @phone', async ({ page }, testInfo) => {
    const answer = await shapedAnswer('event:battle-badr', 'narrative');
    useChatResponder(page, () => ({ json: answer }));
    await openAppWithEvent(page);
    await typeAndSend(page, 'احكيلي عن غزوة بدر');
    const dialog = chatDialog(page);
    const steps = answer.blocks.find(b => b.type === 'steps')!;
    await expect(dialog.getByText('الأحداث بالترتيب:')).toBeVisible();
    await expect(dialog.getByRole('list').filter({ hasText: steps.type === 'steps' ? steps.items[0].slice(0, 20) : '' }).getByRole('listitem')).toHaveCount(steps.type === 'steps' ? steps.items.length : 0);
    await expect(dialog.getByText('أهم المعلومات:')).toBeVisible();
    await expect(dialog.getByRole('term').filter({ hasText: 'التاريخ' })).toBeVisible();
    await expect(dialog.getByText('مواقف الشخصيات:')).toBeVisible();
    await testInfo.attach('shaped-answer', { body: await dialog.screenshot(), contentType: 'image/png' });
  });

  test('a refusal offers starter questions, and pressing one asks it', async ({ page, network }) => {
    const starters = ['ما قصة صلح الحديبية؟', 'ماذا تعرف عن عمر بن الخطاب؟', 'من هم الخلفاء الراشدون؟'];
    const refusal = 'لا تتوفر لدي معلومات كافية عن هذا السؤال في بيانات نبراس.';
    useChatResponder(page, ({ message }) =>
      message === 'مين اخترع الكهربا؟'
        ? { json: { ...mockChatAnswer, answer: refusal, blocks: [{ type: 'text', text: refusal, citations: [] }], citations: [], grounded: false, mode: 'not_covered', context: { recordIds: [], carried: [] }, followUps: starters } }
        : { json: mockChatAnswer },
    );
    await openAppWithEvent(page);
    await typeAndSend(page, 'مين اخترع الكهربا؟');
    await expect(chatDialog(page).getByText(refusal)).toBeVisible();
    await page.waitForTimeout(3_600);
    await chatDialog(page).getByRole('button', { name: starters[0] }).click();
    await expect.poll(() => network.chatRequests.length).toBe(2);
    expect(network.chatRequests[1]).toEqual({ message: starters[0] });
  });

  test('an elliptic follow-up sends back the question the server answered («وأحد؟» then «والخندق؟»)', async ({ page, network }) => {
    const first = 'إمتى كانت غزوة بدر؟';
    useChatResponder(page, ({ message }) => ({
      json:
        message === 'وأحد؟'
          ? { ...mockChatAnswer, context: { recordIds: ['event:battle-uhud'], carried: [], question: first } }
          : mockChatAnswer,
    }));
    await openAppWithEvent(page);
    for (const question of [first, 'وأحد؟', 'والخندق؟']) {
      if (network.chatRequests.length > 0) await page.waitForTimeout(3_600);
      const before = network.chatRequests.length;
      await typeAndSend(page, question);
      await expect.poll(() => network.chatRequests.length).toBe(before + 1);
      await expect(chatDialog(page).getByText(mockChatAnswer.answer.slice(0, 40)).nth(before)).toBeVisible();
    }
    expect(network.chatRequests[1]).toEqual({ message: 'وأحد؟', context: { recordIds: ['event:battle-badr'], previousQuestion: first } });
    // The server said «وأحد؟» asked «إمتى كانت غزوة بدر؟» again; the next question gets that, not «وأحد؟».
    expect(network.chatRequests[2]).toEqual({ message: 'والخندق؟', context: { recordIds: ['event:battle-uhud'], previousQuestion: first } });
  });
});
