// Bringing the app to rest before a screenshot, shared by the visual snapshots
// (tests/e2e/visual.spec.ts) and the style snapshots (tests/style/).
import { expect, type Page } from '@playwright/test';
import { content, panelTitle } from './app';

/** Lets JS-driven motion (map flights, panel springs) come to rest before a shot. */
export async function settle(page: Page, ms = 2_000): Promise<void> {
  await page.waitForTimeout(ms);
  await page.evaluate(() => document.fonts.ready);
}

/** Waits until the map view and every scroll position stop changing (smooth scrolls, flights). */
export async function waitUntilStill(page: Page): Promise<void> {
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
export async function pinView(page: Page): Promise<void> {
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

/** Everything a screenshot waits for: scrolls back at the top, no focus ring, texts loaded, map pinned. */
export async function prepareShot(page: Page): Promise<void> {
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
}
