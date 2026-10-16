import { test, expect, knownFailure } from './support/fixtures';
import type { Page } from '@playwright/test';
import { behavior, eventById, header, mapState, markerCounts, openApp, openAppWithEvent, panelTitle, settledMarkerCounts, waitForMapIdle } from './support/app';
import { expectUiBaseline } from './support/uiBaseline';

// The start view in Map.tsx: center [24.4672, 39.6112], zoom 6.
const START = { lat: 24.4672, lng: 39.6112, zoom: 6 };

test('first load: request count and markers at the start view match the UI baseline @phone', async ({ page }, testInfo) => {
  // Map tiles are left out: how many load depends on the timing of the flight animation.
  let requests = 0;
  page.on('request', (request) => {
    if (!request.url().includes('server.arcgisonline.com')) requests++;
  });
  await openAppWithEvent(page);
  await page.waitForLoadState('networkidle');
  // Count once the map has stopped and been re-measured (see settledMarkerCounts).
  expectUiBaseline(testInfo, 'markersAfterAutoSelect', await settledMarkerCounts(page));
  expectUiBaseline(testInfo, 'firstLoadRequests', requests);
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
  await header.resetMap(page).click();
  await expect.poll(async () => mapState(page), { timeout: 10_000 }).toMatchObject({ zoom: START.zoom });
  const state = await mapState(page);
  expect(state.lat).toBeCloseTo(START.lat, 1); // the flight ends on a whole pixel
  expect(state.lng).toBeCloseTo(START.lng, 1);
});

test('help modal opens and closes @phone', async ({ page }) => {
  await openApp(page);
  await header.help(page).click();
  const dialog = page.getByRole('dialog', { name: /دليل/ });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'إغلاق' }).first().click();
  await expect(dialog).toBeHidden();
});

test('dark mode toggles the dark class on the page @phone', async ({ page }) => {
  await openApp(page);
  await header.darkMode(page).click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  await expect(header.darkMode(page)).toHaveAccessibleName('تبديل إلى الوضع النهاري');
  await header.darkMode(page).click();
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
});

test('the fullscreen button enters and leaves fullscreen', async ({ page }) => {
  await openApp(page);
  await header.fullscreen(page).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await header.fullscreen(page).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
});

test('every header button is inside the viewport @phone', async ({ page }, testInfo) => {
  if (testInfo.project.name.startsWith('phone')) knownFailure('at 375 px the dark-mode button is pushed off the left edge of the header');
  await openApp(page);
  // The top bar is a plain div (no <header>), so its buttons are listed by name.
  const outside: string[] = [];
  for (const [name, locate] of Object.entries(header)) {
    for (const button of await locate(page).all()) {
      const box = await button.evaluate((b) => {
        if ((b as HTMLElement).offsetParent === null) return null; // not displayed in this layout
        const r = b.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: innerWidth, vh: innerHeight };
      });
      if (box && (box.left < 0 || box.right > box.vw || box.top < 0 || box.bottom > box.vh)) outside.push(name);
    }
  }
  expect(outside).toEqual([]);
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

test.describe('known failures', () => {

  test('the map shows the tile provider attribution', async ({ page }) => {
    knownFailure('attributionControl={false} hides the required Esri attribution');
    await openApp(page);
    await expect(page.locator('.leaflet-control-attribution')).toBeVisible();
  });

  test('the tour target data-tour-id="search-button" is unique', async ({ page }) => {
    knownFailure('two elements carry data-tour-id="search-button"');
    await openApp(page);
    await expect(page.locator('[data-tour-id="search-button"]')).toHaveCount(1);
  });

  test('arrow-key navigation does not show a toast every time', async ({ page }) => {
    knownFailure('a toast appears on every next/previous arrow press');
    await openAppWithEvent(page);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    // An immediate count: toHaveCount(0) would retry until the 3 s toast is gone.
    expect(await page.getByText('الحدث التالي', { exact: true }).count()).toBe(0);
  });

  test('dark mode is remembered after a reload', async ({ page }) => {
    knownFailure('dark mode is not persisted');
    await openApp(page);
    await header.darkMode(page).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await page.reload();
    await openApp(page);
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('the intro can be skipped with a tap', async ({ page }) => {
    knownFailure('the 4.2 s intro plays on every visit with no way to skip');
    await page.goto('./');
    await page.waitForTimeout(400);
    await page.mouse.click(200, 200);
    await expect(header.chat(page)).toBeVisible({ timeout: 1_500 });
  });
});
