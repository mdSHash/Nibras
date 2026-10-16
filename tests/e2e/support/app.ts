// Helpers that drive the app the way a visitor does.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Locator, type Page } from '@playwright/test';

const ROOT = join(import.meta.dirname, '..', '..', '..');

export interface BaselineEvent {
  id: string;
  title: string;
  location: { name: string; coordinates: [number, number] };
  keyFigures: { name: string; companionId: string }[];
  companionRoles: { name: string; companionId: string }[];
  quran: { ref: string; key: string }[];
  battle: { battleId: string; scenarioId: string; available: boolean } | null;
  date: { hijriDisplay: string; gregorianDisplay: string };
  narration: { descriptionFile: string; titleFile: string };
}

export const content = JSON.parse(readFileSync(join(ROOT, 'tests', 'baseline', 'content.json'), 'utf8')) as {
  events: BaselineEvent[];
  companions: { id: string; name: string }[];
  battles: { id: string }[];
};
export const behavior = JSON.parse(readFileSync(join(ROOT, 'tests', 'baseline', 'behavior.json'), 'utf8')) as {
  timelineOrder: string[];
  autoSelectedEventId: string;
  filterCombinations: { id: string; type: string; era: string; count: number; eventIds: string[]; eraAnchors: Record<string, string | null> }[];
  search: { id: string; count: number; eventIds: string[] }[];
};
export const eventById = (id: string): BaselineEvent => {
  const event = content.events.find((e) => e.id === id);
  if (!event) throw new Error(`No event ${id} in the content baseline`);
  return event;
};

export const header = {
  // Two elements carry this tour id (one per layout); take the visible one.
  search: (page: Page) => page.locator('[data-tour-id="search-button"]:visible').first(),
  resetMap: (page: Page) => page.getByRole('button', { name: 'إعادة تعيين الخريطة' }),
  fullscreen: (page: Page) => page.getByRole('button', { name: 'ملء الشاشة' }),
  help: (page: Page) => page.getByRole('button', { name: 'دليل الاستخدام والاختصارات' }),
  chat: (page: Page) => page.getByRole('button', { name: 'اسأل المساعد الذكي' }),
  tour: (page: Page) => page.getByRole('button', { name: 'ابدأ الجولة التعريفية' }),
  darkMode: (page: Page) => page.locator('[data-tour-id="dark-mode-toggle"]'),
};

export const panel = (page: Page): Locator => page.locator('[data-tour-id="event-panel"]');
export const panelTitle = (page: Page): Locator => panel(page).locator('h1');

/** Opens the app and waits until the intro has finished and the header is usable. */
export async function openApp(page: Page): Promise<void> {
  await page.goto('./');
  // The intro takes 4.2 s; leave room for a busy machine (battle replays render in parallel).
  await expect(page.getByRole('button', { name: 'اسأل المساعد الذكي' })).toBeVisible({ timeout: 30_000 });
}

/** Opens the app and waits for the first timeline event to be selected (1 s after the intro). */
export async function openAppWithEvent(page: Page): Promise<void> {
  await openApp(page);
  await expect(panelTitle(page)).toHaveText(eventById(behavior.autoSelectedEventId).title, { timeout: 10_000 });
}

/** Selects an event through the search drawer, the way a visitor finds one. */
export async function openEventBySearch(page: Page, eventId: string, query?: string): Promise<void> {
  const event = eventById(eventId);
  await header.search(page).click();
  const drawer = page.getByRole('dialog').filter({ has: page.getByRole('listbox') });
  await drawer.getByRole('searchbox').or(drawer.locator('input')).first().fill(query ?? event.title);
  // Match the title element exactly: an option's summary can mention another event's name.
  await drawer.getByRole('option').filter({ has: page.getByText(event.title, { exact: true }) }).first().click();
  await expect(panelTitle(page)).toHaveText(event.title);
  // Escape would also close the event panel (closeAllModals in App.tsx); use the drawer's own button.
  if (await drawer.isVisible()) await drawer.getByRole('button', { name: 'إغلاق القائمة' }).click();
  await expect(drawer).toBeHidden();
  await expect(panelTitle(page)).toHaveText(event.title);
}

/**
 * Clicks an element that never stops animating (for example the floating tour
 * prompt), which Playwright's stability check would otherwise wait on forever.
 */
export async function clickAnimated(target: Locator): Promise<void> {
  await expect(target).toBeVisible();
  await target.click({ force: true });
}

/** Zoom, center and size of the Leaflet map (recorded by the fixture's init hook). */
export async function mapState(page: Page): Promise<{ zoom: number; lat: number; lng: number; width: number; height: number }> {
  return page.evaluate(() => {
    type LeafletMap = { getZoom(): number; getCenter(): { lat: number; lng: number }; getSize(): { x: number; y: number } };
    const maps = (window as unknown as { __nibrasTestMaps: LeafletMap[] }).__nibrasTestMaps;
    const map = maps[maps.length - 1];
    const center = map.getCenter();
    const size = map.getSize();
    return { zoom: map.getZoom(), lat: center.lat, lng: center.lng, width: size.x, height: size.y };
  });
}

/** Waits until the map has stopped moving (two equal readings 300 ms apart), e.g. after a flight. */
export async function waitForMapIdle(page: Page): Promise<void> {
  let previous = '';
  await expect
    .poll(
      async () => {
        const current = JSON.stringify(await mapState(page));
        const idle = current === previous;
        previous = current;
        return idle;
      },
      { intervals: [300], timeout: 15_000 },
    )
    .toBe(true);
}

type MarkerCounts = { icons: number; clusters: number; pointsInClusters: number };

/**
 * The markers a visitor sees at the start view, independent of load timing. The marker pane also
 * holds icons far off-screen, left from whatever area was clustered last, and how many depends on
 * timing (Leaflet keeps the container size it first measured: 676, 788 or the real 900 px high on
 * desktop, an existing app quirk), and the flight centres the event in that stale size. So, like the
 * visual shots (pinView), re-measure the map and set the view MapUpdater flies to for
 * `coordinates` (which also re-runs clustering), count only icons whose centre is on screen, and
 * wait for two equal readings.
 */
export async function settledMarkerCounts(page: Page, coordinates: [number, number]): Promise<MarkerCounts> {
  await waitForMapIdle(page);
  await page.evaluate(([lat, lng]) => {
    type LeafletMap = {
      invalidateSize(animate: boolean): void;
      setView(center: [number, number], zoom: number, options: { animate: boolean }): void;
    };
    const maps = (window as unknown as { __nibrasTestMaps: LeafletMap[] }).__nibrasTestMaps;
    const map = maps[maps.length - 1];
    const isMobile = window.innerWidth < 640;
    map.invalidateSize(false);
    map.setView([lat + (isMobile ? -1.8 : 0), lng], isMobile ? 7 : 8, { animate: false });
  }, coordinates);
  let previous = '';
  await expect
    .poll(
      async () => {
        const current = JSON.stringify(await markerCounts(page, { onScreenOnly: true }));
        const settled = current === previous;
        previous = current;
        return settled;
      },
      { intervals: [500], timeout: 15_000 },
    )
    .toBe(true);
  return JSON.parse(previous) as MarkerCounts;
}

/** Marker icons on the map at this moment: clusters (with their point counts) and single markers. */
export async function markerCounts(page: Page, options: { onScreenOnly?: boolean } = {}): Promise<MarkerCounts> {
  return page.locator('.leaflet-marker-pane .leaflet-marker-icon').evaluateAll((all, onScreenOnly) => {
    const icons = onScreenOnly
      ? all.filter((icon) => {
          const r = icon.getBoundingClientRect();
          const x = r.x + r.width / 2;
          const y = r.y + r.height / 2;
          return x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
        })
      : all;
    const counts = icons.map((icon) => (/^\d+$/.test((icon.textContent ?? '').trim()) ? Number(icon.textContent) : 0));
    return {
      icons: icons.length,
      clusters: counts.filter((n) => n > 0).length,
      pointsInClusters: counts.reduce((a, b) => a + b, 0),
    };
  }, options.onScreenOnly ?? false);
}
