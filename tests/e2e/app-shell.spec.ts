import { test, expect } from './support/fixtures';
import type { Page } from '@playwright/test';
import { behavior, eventById, header, headerControl, mapState, markerCounts, openApp, openAppWithEvent, panelTitle, settledMarkerCounts, waitForMapIdle } from './support/app';
import { expectUiBaseline } from './support/uiBaseline';

// The start view in Map.tsx: center [24.4672, 39.6112], zoom 6.
const START = { lat: 24.4672, lng: 39.6112, zoom: 6 };

test('first load: request count and markers at the start view match the UI baseline @phone', async ({ page }, testInfo) => {
  // Map tiles are left out: how many load depends on the timing of the flight animation.
  // Font files too (Phase 2B): how many load depends on how long the pre-rendered text is shown.
  // Since Phase 3A they are served with the site instead of from fonts.gstatic.com.
  let requests = 0;
  page.on('request', (request) => {
    const url = request.url();
    if (!url.includes('server.arcgisonline.com') && !/\.woff2?$/.test(new URL(url).pathname)) requests++;
  });
  await openAppWithEvent(page);
  await page.waitForLoadState('networkidle');
  // Count what a visitor sees once the map is re-measured and on the event's view (see settledMarkerCounts).
  const { coordinates } = eventById(behavior.autoSelectedEventId).location;
  expectUiBaseline(testInfo, 'markersAfterAutoSelect', await settledMarkerCounts(page, coordinates));
  // The exact request count is compared on Windows only: on the slow Linux CI runner it varies by
  // one with timing (13 or 14). The bundle budget in npm run verify guards the code split there.
  if (process.platform !== 'linux') expectUiBaseline(testInfo, 'firstLoadRequests', requests);
});

test('the map shows markers; clicking a single marker opens its event @phone', async ({ page }) => {
  await openAppWithEvent(page);
  // Escape clears the selection (closeAllModals); on phones the panel's close button is off-screen.
  await page.keyboard.press('Escape');
  await expect(panelTitle(page)).toBeHidden();
  // Measure markers only once the flight to the auto-selected event has ended.
  await waitForMapIdle(page);
  const counts = await markerCounts(page);
  expect(counts.icons).toBeGreaterThan(0);
  // A single event marker (no cluster number) whose center is not covered by
  // another marker or the header, clicked where a visitor would click it.
  const point = await page.locator('.leaflet-marker-pane .leaflet-marker-icon').evaluateAll((icons) => {
    for (const icon of icons) {
      const r = icon.getBoundingClientRect();
      if (r.width < 30 || /^\d+$/.test((icon.textContent ?? '').trim())) continue;
      const x = r.x + r.width / 2;
      const y = r.y + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const top = document.elementFromPoint(x, y);
      if (top && icon.contains(top)) return { x, y };
    }
    return null;
  });
  expect(point, 'an uncovered single marker is on screen').not.toBeNull();
  await page.mouse.click(point!.x, point!.y);
  await expect(panelTitle(page)).toBeVisible();
  const title = (await panelTitle(page).textContent()) ?? '';
  const event = behavior.timelineOrder.map(eventById).find((e) => e.title === title);
  expect(event, 'the opened panel is one of the events').toBeDefined();
  // The selected marker carries the event's place name.
  await expect(page.locator('.leaflet-marker-pane').getByText(event!.location.name, { exact: true })).toBeVisible();
});

test('map reset flies back to the start view', async ({ page }) => {
  await openAppWithEvent(page);
  await expect.poll(async () => (await mapState(page)).zoom, { timeout: 10_000 }).toBeGreaterThan(START.zoom);
  await (await headerControl(page, 'resetMap')).click();
  await expect.poll(async () => mapState(page), { timeout: 10_000 }).toMatchObject({ zoom: START.zoom });
  const state = await mapState(page);
  expect(state.lat).toBeCloseTo(START.lat, 1); // the flight ends on a whole pixel
  expect(state.lng).toBeCloseTo(START.lng, 1);
});

test('help modal opens and closes @phone', async ({ page }) => {
  await openApp(page);
  await (await headerControl(page, 'help')).click();
  const dialog = page.getByRole('dialog', { name: /دليل/ });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'إغلاق' }).first().click();
  await expect(dialog).toBeHidden();
});

test('dark mode toggles the dark class on the page @phone', async ({ page }) => {
  await openApp(page);
  await (await headerControl(page, 'darkMode')).click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  await expect(await headerControl(page, 'darkMode')).toHaveAccessibleName('تبديل إلى الوضع النهاري');
  await (await headerControl(page, 'darkMode')).click();
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
});

test('the fullscreen button enters and leaves fullscreen', async ({ page }) => {
  await openApp(page);
  await (await headerControl(page, 'fullscreen')).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await (await headerControl(page, 'fullscreen')).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
});

// Was known failure 2 in the Phase 0A baseline on phones (fixed in Phase 2C: the ⋮ menu).
test('every header button is inside the viewport @phone', async ({ page }, testInfo) => {
  await openApp(page);
  // The header's buttons are listed by name; the ⋮ menu's rows are checked with the menu open.
  const outside = async (): Promise<string[]> => {
    const names: string[] = [];
    for (const [name, locate] of Object.entries(header)) {
      for (const button of await locate(page).all()) {
        const box = await button.evaluate((b) => {
          if ((b as HTMLElement).offsetParent === null) return null; // not displayed in this layout
          const r = b.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: innerWidth, vh: innerHeight };
        });
        if (box && (box.left < 0 || box.right > box.vw || box.top < 0 || box.bottom > box.vh)) names.push(name);
      }
    }
    return names;
  };
  expect(await outside()).toEqual([]);
  if (testInfo.project.name.startsWith('phone')) {
    await header.menu(page).click();
    await expect(page.getByRole('menuitem')).toHaveCount(5);
    expect(await outside()).toEqual([]);
  }
});

test('the phone header menu: arrow keys move, Escape closes only the menu, a tap outside closes it @phone', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('phone'), 'the ⋮ menu is shown below 640 px only');
  await openAppWithEvent(page);
  const menu = page.getByRole('menu', { name: 'المزيد من الخيارات' });
  await header.menu(page).click();
  await expect(menu).toBeVisible();
  const rows = menu.getByRole('menuitem');
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(rows.last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(header.menu(page)).toBeFocused();
  await expect(panelTitle(page)).toBeVisible(); // the event stays open
  await header.menu(page).click();
  await expect(menu).toBeVisible();
  await page.mouse.click(180, 400);
  await expect(menu).toBeHidden();
});

test.describe('map moves to the selected event', () => {
  // Desktop: MapUpdater centers on the event at zoom 8 (phones shift the center and use zoom 7).
  const [eventLat, eventLng] = eventById(behavior.autoSelectedEventId).location.coordinates;
  const roundedView = async (page: Page) => {
    const s = await mapState(page);
    return { zoom: s.zoom, lat: Number(s.lat.toFixed(3)), lng: Number(s.lng.toFixed(3)) };
  };
  const eventView = { zoom: 8, lat: Number(eventLat.toFixed(3)), lng: Number(eventLng.toFixed(3)) };

  // Was known failure 1 in the Phase 0A baseline (fixed in Phase 0B).
  test('a map with no size when the first event is selected does not blank the page', async ({ page }) => {
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.id = 'nibras-test-hide-map';
      style.textContent = '[data-tour-id="map-container"]{display:none !important}';
      document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
    });
    await openAppWithEvent(page);
    await page.waitForTimeout(1_500);
    await expect(header.chat(page)).toBeVisible();
    // Once the map is shown it jumps to the event that was selected while it was hidden.
    await page.evaluate(() => document.getElementById('nibras-test-hide-map')?.remove());
    await expect.poll(() => roundedView(page)).toEqual(eventView);
  });

  test.describe('with reduced motion', () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });
    test('the map jumps to the event without a flight', async ({ page }) => {
      await openAppWithEvent(page);
      // A flight takes 1 s; an instant move is already there.
      await expect.poll(() => roundedView(page), { timeout: 400 }).toEqual(eventView);
    });
  });
});

// Were known failures 5, 6 and 7 in the Phase 0A baseline (fixed in Phase 3A).
test('the map shows the tile provider attribution', async ({ page }) => {
  await openApp(page);
  const attribution = page.locator('.leaflet-control-attribution');
  await expect(attribution).toBeVisible();
  await expect(attribution).toContainText('Esri');
});

test('the tour target data-tour-id="search-button" is unique', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('[data-tour-id="search-button"]')).toHaveCount(1);
});

test('arrow-key navigation does not show a toast every time', async ({ page }) => {
  await openAppWithEvent(page);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  // An immediate count: toHaveCount(0) would retry until the 3 s toast is gone.
  expect(await page.getByText('الحدث التالي', { exact: true }).count()).toBe(0);
});

test.describe('dark mode is remembered', () => {
  // Was known failure 8 in the Phase 0A baseline (fixed in Phase 2C).
  test('after a reload', async ({ page }) => {
    await openApp(page);
    await (await headerControl(page, 'darkMode')).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await page.reload();
    await openApp(page);
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test.describe('with a dark system setting', () => {
    test.use({ colorScheme: 'dark' });

    test('the app starts dark until the visitor chooses light', async ({ page }) => {
      await openApp(page);
      await expect(page.locator('html')).toHaveClass(/\bdark\b/);
      await (await headerControl(page, 'darkMode')).click();
      await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
      await page.reload();
      await openApp(page);
      await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    });

    test('the system setting is followed while the visitor has not chosen', async ({ page }) => {
      await openApp(page);
      await page.emulateMedia({ colorScheme: 'light' });
      await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
      await page.emulateMedia({ colorScheme: 'dark' });
      await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    });
  });
});
