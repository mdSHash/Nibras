// Visual snapshots of key screens (baseline part 4), desktop and phone. Map
// tiles are a plain color, fonts are local copies, Math.random is seeded and
// CSS animations are disabled, so screenshots repeat. Stored per platform in
// tests/baseline/visual/<project>/; update only after Mostafa approves.
import { test, expect, useChatResponder } from './support/fixtures';
import { content, header, openAppWithEvent, openEventBySearch, panel, panelTitle } from './support/app';
import { defaultChatReply } from './support/chatMock';
import type { Page } from '@playwright/test';

/** Lets JS-driven motion (map flights, panel springs) come to rest before a shot. */
async function settle(page: Page, ms = 2_000): Promise<void> {
  await page.waitForTimeout(ms);
  await page.evaluate(() => document.fonts.ready);
}

/** Waits until the map view and every scroll position stop changing (smooth scrolls, flights). */
async function waitUntilStill(page: Page): Promise<void> {
  const sample = () =>
    page.evaluate(() => {
      type LeafletMap = { getZoom(): number; getCenter(): { lat: number; lng: number } };
      const maps = (window as unknown as { __nibrasTestMaps: LeafletMap[] }).__nibrasTestMaps;
      const map = maps[maps.length - 1];
      const scrolls = [...document.querySelectorAll<HTMLElement>('*')]
        .filter((el) => el.scrollTop !== 0 || el.scrollLeft !== 0)
        .map((el) => `${el.scrollTop},${el.scrollLeft}`);
      return JSON.stringify([map?.getZoom(), map?.getCenter(), scrolls]);
    });
  let previous = await sample();
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(500);
    const current = await sample();
    if (current === previous) return;
    previous = current;
  }
}

/**
 * Removes two timing effects that are not app behavior: the map's resting point
 * depends on whether the panel opened before or after the flight, and test
 * clicks scroll the phone header bar. The map is set to the view MapUpdater
 * (Map.tsx) flies to for the selected event (after re-measuring the map, whose
 * cached size can predate the final layout), and the header bar to its start.
 */
async function pinView(page: Page): Promise<void> {
  const title = (await panelTitle(page).count()) ? await panelTitle(page).first().textContent() : null;
  const event = content.events.find((e) => e.title === title);
  await page.evaluate((coordinates) => {
    const toggle = document.querySelector('[data-tour-id="dark-mode-toggle"]');
    for (let el = toggle?.parentElement; el; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth) el.scrollLeft = 0;
    }
    if (!coordinates) return;
    type LeafletMap = {
      invalidateSize(animate: boolean): void;
      setView(center: [number, number], zoom: number, options: { animate: boolean }): void;
    };
    const maps = (window as unknown as { __nibrasTestMaps: LeafletMap[] }).__nibrasTestMaps;
    const map = maps[maps.length - 1];
    const isMobile = window.innerWidth < 640;
    // Leaflet can hold a size measured before the layout settled; measure again.
    map?.invalidateSize(false);
    map?.setView([coordinates[0] + (isMobile ? -1.8 : 0), coordinates[1]], isMobile ? 7 : 8, { animate: false });
  }, event?.location.coordinates ?? null);
  await page.waitForTimeout(500);
}

async function shot(page: Page, name: string): Promise<void> {
  // Clicking a chip scrolls its container by an amount that varies from run to
  // run; put every vertically scrolled element back at the top first.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll<HTMLElement>('*')) {
      if (el.scrollTop > 0) {
        el.style.scrollBehavior = 'auto';
        el.scrollTop = 0;
      }
    }
  });
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  // Texts that load on demand (Phase 2B) must have arrived.
  await expect(page.getByRole('status', { name: 'جارٍ التحميل' })).toHaveCount(0);
  await waitUntilStill(page);
  await pinView(page);
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
    await header.darkMode(page).click();
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
    await header.help(page).click();
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

  test('Badr replay at 40%', async ({ page }) => {
    await openAppWithEvent(page);
    await openEventBySearch(page, 'battle-badr', 'بدر');
    await panel(page).getByRole('button', { name: 'مشاهدة المعركة على الخريطة' }).click();
    await expect(page.getByText('جارٍ تحميل المعركة...')).toBeHidden({ timeout: 30_000 });
    const bar = page.getByRole('slider', { name: 'شريط التقدم' });
    const box = (await bar.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.4, box.y + box.height / 2);
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await page.mouse.move(0, 0);
    await settle(page, 2_500);
    await shot(page, 'badr-replay-40');
  });
});
