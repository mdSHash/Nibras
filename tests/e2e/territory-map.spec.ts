// The territory map on the real Relief tiles (3G): contrast measured on real screenshot pixels, labels
// clear of markers, markers still clickable, the legend, the credit and the tiles under the base path.
import type { Page } from '@playwright/test';
import { test, expect, STORAGE } from './support/fixtures';
import { headerControl, openApp, clickAnimated, waitForMapIdle } from './support/app';

test.use({ realTiles: true });

// One picture per main stage of the map.
const MOMENTS = ['battle-badr', 'prophet-death', 'conquest_khorasan', 'event-109-%D9%85%D8%B9%D8%B1%D9%83%D8%A9-%D8%B5%D9%81%D9%8A%D9%86'];
const AA = 4.5;

interface Box {
  kind: 'label' | 'legend';
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: number[];
}

async function openMoment(page: Page, slug: string, theme: 'light' | 'dark'): Promise<void> {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE.theme, theme]);
  await page.addInitScript(keys => keys.forEach(k => localStorage.setItem(k, 'true')), [STORAGE.helpSeen, STORAGE.chatSeen]);
  await page.goto(`event/${slug}/`);
  await expect(page.locator('.territory-legend')).toBeVisible({ timeout: 30_000 });
  await waitForMapIdle(page);
}

async function setView(page: Page, center: [number, number], zoom: number): Promise<void> {
  await page.addStyleTag({ content: '[data-tour-id="event-panel"]{display:none !important}' });
  await page.evaluate(
    ([c, z]) => {
      const maps = (window as unknown as { __nibrasTestMaps: { setView: (c: unknown, z: unknown, o: unknown) => void; invalidateSize: () => void }[] }).__nibrasTestMaps;
      maps[0].invalidateSize();
      maps[0].setView(c, z, { animate: false });
    },
    [center, zoom] as const,
  );
  await page.waitForTimeout(1_500); // Tiles load and the labels are placed.
  await page.waitForFunction(() => [...document.querySelectorAll<HTMLImageElement>('.leaflet-tile-pane img')].every(i => i.complete));
}

/** Every visible label and legend line, as boxes around its text. Text the app's own UI covers is not seen, so it is left out. */
const textBoxes = (page: Page): Promise<Box[]> =>
  page.evaluate(() => {
    const out: Box[] = [];
    const push = (el: HTMLElement, kind: Box['kind']) => {
      const r = el.getBoundingClientRect();
      if (getComputedStyle(el).visibility === 'hidden' || r.width < 2 || r.left < 0 || r.top < 0 || r.right > innerWidth || r.bottom > innerHeight) return;
      if (kind === 'label') {
        const points = [[0.5, 0.5], [0.1, 0.15], [0.9, 0.15], [0.1, 0.85], [0.9, 0.85]];
        if (points.some(([a, b]) => !document.elementFromPoint(r.left + r.width * a, r.top + r.height * b)?.closest('.leaflet-container'))) return;
      }
      const range = document.createRange();
      range.selectNodeContents(el);
      const t = range.getBoundingClientRect();
      const x = Math.max(t.left, r.left + 2);
      const y = Math.max(t.top, r.top + 2);
      out.push({
        kind,
        text: el.textContent ?? '',
        x,
        y,
        w: Math.min(t.right, r.right - 2) - x,
        h: Math.min(t.bottom, r.bottom - 2) - y,
        color: (getComputedStyle(el).color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number),
      });
    };
    document.querySelectorAll<HTMLElement>('.territory-label').forEach(e => push(e, 'label'));
    document.querySelectorAll<HTMLElement>('.territory-legend__text').forEach(e => push(e, 'legend'));
    return out;
  });

/**
 * The lowest contrast of each text against the real pixels behind it: a screenshot with the text made
 * transparent and everything above the map hidden, worst pixel in each box.
 */
async function measure(page: Page, boxes: Box[]): Promise<{ text: string; ratio: number }[]> {
  const style = await page.addStyleTag({
    content: `*{visibility:hidden !important}
      .leaflet-tile-pane,.leaflet-tile-pane *,.leaflet-overlay-pane,.leaflet-overlay-pane *,.territory-legend,.territory-legend *{visibility:visible !important}
      .territory-label:not([style*="hidden"]){visibility:visible !important}
      .territory-label,.territory-legend__text,.territory-legend__chevron{color:transparent !important}`,
  });
  const shot = (await page.screenshot()).toString('base64');
  await style.evaluate(el => (el as HTMLElement).remove());
  return page.evaluate(
    async ({ shot, boxes }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${shot}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(image, 0, 0);
      const channel = (c: number) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
      const lum = (r: number, g: number, b: number) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      return boxes.map(b => {
        const { data } = ctx.getImageData(Math.floor(b.x), Math.floor(b.y), Math.max(1, Math.ceil(b.w)), Math.max(1, Math.ceil(b.h)));
        const ink = lum(b.color[0], b.color[1], b.color[2]);
        let ratio = 99;
        for (let i = 0; i < data.length; i += 4) {
          const ground = lum(data[i], data[i + 1], data[i + 2]);
          ratio = Math.min(ratio, (Math.max(ink, ground) + 0.05) / (Math.min(ink, ground) + 0.05));
        }
        return { text: b.text, ratio: Math.round(ratio * 100) / 100 };
      });
    },
    { shot, boxes },
  );
}

/** Labels that touch an event marker, a cluster or the selected event's name. */
const labelsOnMarkers = (page: Page): Promise<string[]> =>
  page.evaluate(() => {
    const marks = [...document.querySelectorAll('.leaflet-marker-pane > *, .leaflet-tooltip-pane > *')].map(e => e.getBoundingClientRect());
    return [...document.querySelectorAll<HTMLElement>('.territory-label')]
      .filter(l => getComputedStyle(l).visibility !== 'hidden')
      .filter(l => {
        const r = l.getBoundingClientRect();
        return marks.some(m => r.right > m.left && r.left < m.right && r.bottom > m.top && r.top < m.bottom);
      })
      .map(l => l.textContent ?? '');
  });

/** Markers whose middle is on the map but gives a click to something else than a marker. */
const blockedMarkers = (page: Page): Promise<number> =>
  page.evaluate(() => {
    let blocked = 0;
    for (const m of document.querySelectorAll('.leaflet-marker-pane > *')) {
      const r = m.getBoundingClientRect();
      const x = (r.left + r.right) / 2;
      const y = (r.top + r.bottom) / 2;
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
      const hit = document.elementFromPoint(x, y);
      if (hit?.closest('.territory-label, .territory-area')) blocked++;
    }
    return blocked;
  });

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme}`, () => {
    for (const slug of MOMENTS) {
      test(`labels and legend read at 4.5:1 and stay off the markers: ${slug} @phone`, async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium', 'one engine is enough for pixels');
        const phone = testInfo.project.name === 'phone';
        await openMoment(page, slug, theme);
        await setView(page, [27, 42], phone ? 4 : 5);
        if (phone) await page.getByRole('button', { name: 'مفتاح الخريطة' }).click();

        const boxes = await textBoxes(page);
        expect(boxes.filter(b => b.kind === 'label').length, 'names on the map').toBeGreaterThan(phone ? 1 : 5);
        expect(boxes.filter(b => b.kind === 'legend').length, 'legend lines').toBeGreaterThan(2);
        const low = (await measure(page, boxes)).filter(r => r.ratio < AA);
        expect(low).toEqual([]);
        expect(await labelsOnMarkers(page)).toEqual([]);
        expect(await blockedMarkers(page)).toBe(0);
      });
    }

    test('the contrast measure can fail: with no label backgrounds it does @phone', async ({ page, browserName }, testInfo) => {
      test.skip(browserName !== 'chromium', 'one engine is enough for pixels');
      await openMoment(page, 'prophet-death', theme);
      await setView(page, [27, 42], testInfo.project.name === 'phone' ? 4 : 5);
      await page.addStyleTag({ content: '.territory-label{background:transparent !important}' });
      const low = (await measure(page, await textBoxes(page))).filter(r => r.ratio < AA);
      expect(low.length, 'labels below 4.5:1 once their background is gone').toBeGreaterThan(0);
    });

    test('at the event view too @phone', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'one engine is enough for pixels');
      await openMoment(page, 'battle-badr', theme);
      const low = (await measure(page, await textBoxes(page))).filter(r => r.ratio < AA);
      expect(low).toEqual([]);
      expect(await labelsOnMarkers(page)).toEqual([]);
    });
  });
}

test('the Relief tiles load from the site itself, under the base path, and change with the theme @phone', async ({ page, baseURL }) => {
  const tiles: string[] = [];
  page.on('response', response => {
    if (response.url().includes('/map-tiles/')) {
      tiles.push(response.url());
      expect(response.status(), response.url()).toBe(200);
    }
  });
  await openApp(page);
  await expect.poll(() => tiles.length).toBeGreaterThan(0);
  expect(tiles[0].startsWith(`${baseURL}map-tiles/relief-light/`)).toBe(true);
  tiles.length = 0;
  await clickAnimated(await headerControl(page, 'darkMode'));
  await expect.poll(() => tiles.some(url => url.includes('/map-tiles/relief-dark/'))).toBe(true);
});

test('an unsettled row looks uncertain, and the legend says what it means', async ({ page }) => {
  await openMoment(page, 'battle-badr', 'light');
  await expect(page.locator('path.territory-area.uncertain').first()).toBeAttached();
  await expect(page.locator('.territory-legend')).toContainText('غير مؤكدة');
  await expect(page.locator('.territory-legend')).toContainText('الحدود كلها مرسومة تقريبًا');
  // Land on terms is hatched, by a pattern that exists in the map's SVG.
  await openMoment(page, 'prophet-death', 'light');
  const fill = await page.locator('path.territory-area.k-treaty').first().getAttribute('fill');
  expect(fill).toBe('url(#territory-hatch)');
  await expect(page.locator('.leaflet-overlay-pane pattern#territory-hatch')).toBeAttached();
});

test('a click on the land says who held it, and that the border is drawn', async ({ page }) => {
  await openMoment(page, 'prophet-death', 'light');
  await setView(page, [33, 55], 5);
  await page.mouse.click(720, 450);
  const popup = page.locator('.leaflet-popup');
  await expect(popup).toContainText('الساسانية');
  await expect(popup).toContainText('الحدود مرسومة تقريبًا');
});

test.describe('on a phone', () => {
  test('the legend is a chip that opens and closes by touch and by keyboard @phone', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'wide screens show the legend open');
    await openMoment(page, 'prophet-death', 'light');
    const chip = page.getByRole('button', { name: 'مفتاح الخريطة' });
    await expect(chip).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.territory-legend__list')).toHaveCount(0);
    await chip.click();
    await expect(chip).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.territory-legend__list')).toContainText('صلح أو معاهدة');
    await page.keyboard.press('Escape');
    await expect(chip).toHaveAttribute('aria-expanded', 'false');
    await expect(chip).toBeFocused();
  });
});

test.describe('when the map data does not load', () => {
  test.use({ allowedConsoleErrors: [/Failed to load resource/] });
  test('it says so in Arabic and can try again', async ({ page }) => {
    await page.route('**/assets/territories-*.json', route => route.abort());
    await page.goto('./');
    await expect(page.getByText('تعذّر تحميل حدود الخريطة')).toBeVisible({ timeout: 30_000 });
    await page.unroute('**/assets/territories-*.json');
    await page.getByRole('button', { name: 'إعادة المحاولة' }).click();
    await expect(page.locator('.territory-legend')).toBeVisible();
    await expect(page.getByText('تعذّر تحميل حدود الخريطة')).toHaveCount(0);
  });
});
