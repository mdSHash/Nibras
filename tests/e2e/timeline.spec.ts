import { test, expect, knownFailure } from './support/fixtures';
import { behavior, eventById, header, openAppWithEvent, panelTitle } from './support/app';
import type { Page } from '@playwright/test';

const combo = (id: string) => behavior.filterCombinations.find((c) => c.id === id)!;

/**
 * On desktop the open event panel covers part of the timeline dock (known
 * failure below), so the dock is used the way a visitor can: panel hidden first.
 * The hidden panel leaves the DOM; expectSelected re-opens it to read the title.
 */
async function hidePanel(page: Page): Promise<void> {
  const hide = page.getByRole('button', { name: 'إخفاء اللوحة' }).locator('visible=true');
  if (await hide.count()) await hide.first().click();
}

async function expectSelected(page: Page, eventId: string): Promise<void> {
  await page.getByRole('button', { name: 'إظهار لوحة الحدث' }).locator('visible=true').first().click();
  await expect(panelTitle(page)).toHaveText(eventById(eventId).title);
  await hidePanel(page);
}

async function clickEraPill(page: Page, label: string): Promise<void> {
  await page.getByRole('button', { name: label, exact: true }).locator('visible=true').first().click();
}

test('each era pill jumps to its anchor event', async ({ page }) => {
  await openAppWithEvent(page);
  await hidePanel(page);
  for (const [pill, anchorId] of Object.entries(combo('type=all&era=all').eraAnchors)) {
    await test.step(pill, async () => {
      await clickEraPill(page, pill);
      await expectSelected(page, anchorId!);
    });
  }
});

test('with the battles filter, era pills jump to the first battle of each era', async ({ page }) => {
  await openAppWithEvent(page);
  await header.search(page).click();
  const drawer = page.getByRole('dialog', { name: 'قائمة البحث' });
  await drawer.getByRole('button', { name: 'المعارك فقط', exact: true }).click();
  await drawer.getByRole('button', { name: 'إغلاق القائمة' }).click();
  await hidePanel(page);
  for (const [pill, anchorId] of Object.entries(combo('type=battles&era=all').eraAnchors)) {
    await test.step(pill, async () => {
      await clickEraPill(page, pill);
      await expectSelected(page, anchorId!);
    });
  }
});

test('clicking an event on the timeline rail selects it', async ({ page }) => {
  await openAppWithEvent(page);
  await hidePanel(page);
  const target = eventById(behavior.timelineOrder[3]);
  await page.getByRole('button', { name: target.title, exact: true }).locator('visible=true').first().click();
  await expectSelected(page, target.id);
});

test('player mode autoplay narrates each title and advances to the next event', async ({ page, network }) => {
  await openAppWithEvent(page);
  await hidePanel(page);
  const [first, second] = behavior.timelineOrder.map(eventById);
  await page.getByRole('button', { name: 'تشغيل', exact: true }).locator('visible=true').first().click();
  await expect(page.getByTitle('الخروج من وضع التشغيل').locator('visible=true')).toHaveCount(1);
  await expect.poll(() => network.audioRequests).toContain(first.narration.titleFile);
  // The stub narration lasts 3 s; then the timeline moves on and narrates the next title.
  await expect.poll(() => network.audioRequests, { timeout: 15_000 }).toContain(second.narration.titleFile);
  await page.getByRole('button', { name: 'إيقاف', exact: true }).locator('visible=true').first().click();
  await page.getByTitle('الخروج من وضع التشغيل').locator('visible=true').first().click();
  await expect(page.getByTitle('الخروج من وضع التشغيل').locator('visible=true')).toHaveCount(0);
  await expectSelected(page, second.id);
});

test.describe('known failure', () => {
  // Timeline.tsx:260 narrates the title with rate = playback speed; no audio file
  // exists for 2× or 3×, so the request fails, console.error is logged and the
  // timeline falls back to a timed pause.
  test('autoplay at 2× narrates without errors', async ({ page, network }) => {
    knownFailure('no narration files exist for 2×/3× speed');
    await openAppWithEvent(page);
    await hidePanel(page);
    await page.getByRole('button', { name: 'تشغيل', exact: true }).locator('visible=true').first().click();
    await page.getByRole('button', { name: 'إيقاف', exact: true }).locator('visible=true').first().click();
    await page.getByRole('button', { name: 'السرعة 1x' }).locator('visible=true').first().click();
    await page.getByRole('button', { name: 'تشغيل', exact: true }).locator('visible=true').first().click();
    await expect.poll(() => network.audioRequests.length, { timeout: 10_000 }).toBeGreaterThan(1);
    await page.waitForTimeout(1_000);
  });
});

// Was known failure 11 in the Phase 0A baseline (fixed in Phase 2C: the desktop
// event panel ends above the timeline dock).
test('with the event panel open, the timeline dock controls are clickable', async ({ page }) => {
  await openAppWithEvent(page);
  for (const name of ['تشغيل', 'العهد النبوي']) {
    const button = page.getByRole('button', { name, exact: true }).locator('visible=true').first();
    const hit = await button.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return !!top && (el === top || el.contains(top));
    });
    expect(hit, `${name} receives the click`).toBe(true);
  }
});
