// The states the style snapshots record (playwright.style.config.ts), each in
// every project: light/dark × system light/dark on desktop and phone, phone
// sideways, tablet, reduced motion.
import type { Page, TestInfo } from '@playwright/test';
import { test, expect, capture } from './fixtures';
import { clickAnimated, eventById, header, headerControl, openAppWithEvent, panel, panelTitle } from '../e2e/support/app';
import { settle } from '../e2e/support/still';
import { defaultChatReply } from '../e2e/support/chatMock';
import { useChatResponder } from '../e2e/support/fixtures';

// One event of each era, a battle with a replay and Badr (video).
const EVENTS = ['fijar-war', 'hijra-medina', 'ridda-wars-start', 'conquest-damascus', 'alexandria-reconquest', 'battle-camel', 'battle-uhud', 'battle-badr'];

// Hover and focus are recorded in these projects only (they take a while).
const INTERACTIVE_PROJECTS = ['desktop-app-light-system-light', 'desktop-app-dark-system-dark', 'phone-app-light-system-light'];

async function start(page: Page): Promise<void> {
  await openAppWithEvent(page);
  await settle(page, 3_500); // the 2.5 s flight to the first event
}

/** Opens an event by its address, as a shared link does. */
async function openEvent(page: Page, id: string): Promise<void> {
  await page.goto(`./event/${id}/`);
  await expect(panelTitle(page)).toHaveText(eventById(id).title, { timeout: 30_000 });
  await settle(page, 3_500);
}

/** Hovers, then focuses, each visible control inside `scope`, recording that control's styles. */
async function interactive(page: Page, testInfo: TestInfo, name: string, scope: string): Promise<void> {
  if (!INTERACTIVE_PROJECTS.includes(testInfo.project.name)) return;
  const controls = page.locator(`${scope} :is(button, a[href], [role="button"], [role="menuitem"], input)`).locator('visible=true');
  const count = Math.min(await controls.count(), 24);
  const probe = page.locator('[data-style-probe]');
  for (let i = 0; i < count; i++) {
    const control = controls.nth(i);
    await control.evaluate((el) => el.setAttribute('data-style-probe', ''));
    if (!(testInfo.project.use as { hasTouch?: boolean }).hasTouch) {
      await control.hover({ force: true });
      await page.waitForTimeout(500);
      await capture(page, testInfo, `${name}-hover-${i}`, { scope: probe, keepFocus: true });
    }
    await control.focus();
    await page.waitForTimeout(300);
    await capture(page, testInfo, `${name}-focus-${i}`, { scope: probe, keepFocus: true });
    await control.evaluate((el) => el.removeAttribute('data-style-probe'));
  }
  await page.mouse.move(0, 0);
}

test.describe('style', () => {
  test('start view', async ({ page }, testInfo) => {
    await start(page);
    await capture(page, testInfo, 'start');
    await interactive(page, testInfo, 'header', 'header');
    await interactive(page, testInfo, 'timeline', '[data-tour-id="timeline"]');
  });

  for (const id of EVENTS) {
    test(`event panel ${id}`, async ({ page }, testInfo) => {
      await openEvent(page, id);
      await capture(page, testInfo, `event-${id}`);
      if (id === 'battle-badr') await interactive(page, testInfo, 'panel', '[data-tour-id="event-panel"]');
    });
  }

  test('search open', async ({ page }, testInfo) => {
    await start(page);
    await header.search(page).click();
    const drawer = page.getByRole('dialog', { name: 'قائمة البحث' });
    await expect(drawer).toBeVisible();
    await drawer.locator('input').first().fill('بدر');
    await settle(page);
    await capture(page, testInfo, 'search');
    await interactive(page, testInfo, 'search', '[role="dialog"]');
  });

  test('person bio', async ({ page }, testInfo) => {
    await openEvent(page, 'battle-badr');
    await panel(page).getByRole('button', { name: eventById('battle-badr').companionRoles[0].name }).first().click();
    await settle(page);
    await capture(page, testInfo, 'person');
  });

  test('Quran passage', async ({ page }, testInfo) => {
    await openEvent(page, 'battle-badr');
    await panel(page).getByRole('button', { name: /عرض الآيات/ }).first().click();
    await expect(page.getByRole('dialog', { name: 'سورة الأنفال: 9' })).toBeVisible();
    await settle(page);
    await capture(page, testInfo, 'quran');
    await interactive(page, testInfo, 'quran', '[role="dialog"][aria-labelledby="quran-modal-title"]');
  });

  test('help', async ({ page }, testInfo) => {
    await start(page);
    await (await headerControl(page, 'help')).click();
    await expect(page.getByRole('dialog', { name: /دليل/ })).toBeVisible();
    await settle(page);
    await capture(page, testInfo, 'help');
  });

  test('chat with an answer', async ({ page }, testInfo) => {
    useChatResponder(page, defaultChatReply);
    await start(page);
    await header.chat(page).click();
    const input = page.getByPlaceholder('اكتب سؤالك هنا...');
    await input.fill('ماذا حدث في غزوة بدر؟');
    await page.getByRole('button', { name: 'إرسال' }).click();
    await expect(page.getByRole('button', { name: 'متى كانت غزوة أحد؟' })).toBeVisible();
    await input.blur();
    await settle(page);
    await capture(page, testInfo, 'chat');
  });

  test('phone menu', async ({ page }, testInfo) => {
    await start(page);
    test.skip(!(await header.menu(page).isVisible()), 'the ⋮ menu exists only on narrow screens');
    await header.menu(page).click();
    await settle(page, 1_000);
    await capture(page, testInfo, 'menu');
    await interactive(page, testInfo, 'menu', '[role="menu"]');
  });

  test('timeline player mode', async ({ page }, testInfo) => {
    await start(page);
    const play = page.getByRole('button', { name: 'تشغيل', exact: true }).locator('visible=true').first();
    test.skip(!(await play.isVisible()), 'no player button in this layout');
    await play.click();
    await expect(page.getByTitle('الخروج من وضع التشغيل').locator('visible=true')).not.toHaveCount(0);
    await page.waitForTimeout(300);
    const timeline = page.locator('[data-tour-id="timeline"]');
    await capture(page, testInfo, 'player-playing', { scope: timeline, keepFocus: true });
    // Stop autoplay where it started (the 3 s narration stub would move it on).
    await page.getByRole('button', { name: 'إيقاف', exact: true }).locator('visible=true').first().click();
    await settle(page, 1_000);
    await capture(page, testInfo, 'player', { scope: timeline });
  });

  test('map popup on a cluster', async ({ page }, testInfo) => {
    await start(page);
    const cluster = page.locator('.leaflet-marker-icon.custom-marker').filter({ hasText: /\d|[٠-٩]/ }).locator('visible=true').first();
    test.skip((await cluster.count()) === 0, 'no cluster on screen');
    await cluster.click({ force: true });
    const popup = page.locator('.leaflet-popup');
    test.skip(!(await popup.isVisible().catch(() => false)), 'the cluster opened no popup in this layout');
    await settle(page, 1_000);
    await capture(page, testInfo, 'popup', { scope: popup, keepFocus: true });
  });

  test.describe('first visit', () => {
    test.use({ firstVisit: true });

    test('tour prompt and first step', async ({ page }, testInfo) => {
      await page.goto('./');
      const prompt = page.getByRole('dialog', { name: /مرحباً بك في نبراس/ });
      await expect(prompt).toBeVisible({ timeout: 30_000 });
      await settle(page, 2_000);
      await capture(page, testInfo, 'tour-prompt', { keepFocus: true });
      await clickAnimated(prompt.getByRole('button', { name: 'ابدأ الجولة' }));
      await expect(page.getByRole('button', { name: 'إغلاق الجولة' })).toBeVisible();
      await settle(page, 2_000);
      await capture(page, testInfo, 'tour-step', { keepFocus: true });
    });
  });

  test('battle video player (stub)', async ({ page }, testInfo) => {
    await openEvent(page, 'battle-badr');
    await page.getByRole('button', { name: 'مشاهدة المعركة' }).click();
    const player = page.getByRole('dialog', { name: eventById('battle-badr').title });
    await expect(player).toBeVisible();
    await page.waitForFunction(() => 'hold' in ((window as unknown as { __fakeYouTube?: object }).__fakeYouTube ?? {}));
    await page.evaluate(() => (window as unknown as { __fakeYouTube: { hold(s: number): void } }).__fakeYouTube.hold(12));
    await settle(page, 1_500);
    await capture(page, testInfo, 'video');
  });
});
