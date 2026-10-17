// Pre-rendered pages (Phase 2B): every address has its own HTML with its text,
// title and share tags, which the app replaces when it mounts; 404.html is the
// app shell GitHub Pages serves for unknown paths.
import { test, expect } from './support/fixtures';
import { eventById, panelTitle } from './support/app';

const BADR = eventById('battle-badr');

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('an event page shows its title and place, and scrolls @phone', async ({ page }) => {
    await page.goto('./event/battle-badr/');
    const main = page.locator('main.nb-static');
    await expect(main.getByRole('heading', { level: 1 })).toHaveText(BADR.title);
    await expect(main).toContainText(BADR.location.name);
    await expect(page).toHaveTitle(`${BADR.title} — نبراس`);
    // The static text scrolls although the app's CSS locks the body.
    const scrolls = await main.evaluate((el) => el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY === 'auto');
    expect(scrolls).toBe(true);
  });

  test('pages link to each other: event → person, home → event', async ({ page }) => {
    await page.goto('./event/battle-badr/');
    const person = page.locator('main.nb-static a[href*="/person/"]').first();
    const href = (await person.getAttribute('href'))!;
    await person.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator('main.nb-static h1')).not.toBeEmpty();
    await page.goto('./');
    await page.locator(`main.nb-static a[href$="/event/battle-badr/"]`).click();
    await expect(page.locator('main.nb-static h1')).toHaveText(BADR.title);
  });
});

test.describe('with a dark system setting', () => {
  test.use({ colorScheme: 'dark' });

  test('the static text is dark before the app loads', async ({ page }) => {
    // An empty app script: the page stays as pre-rendered.
    await page.route('**/assets/*.js', (route) => route.fulfill({ contentType: 'text/javascript', body: '' }));
    await page.goto('./event/battle-badr/');
    const main = page.locator('main.nb-static');
    await expect(main.getByRole('heading', { level: 1 })).toHaveText(BADR.title);
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    expect(await main.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(34, 26, 21)');
  });
});

test('the app replaces the static text and keeps the page title @phone', async ({ page }) => {
  await page.goto('./event/battle-badr/');
  await expect(panelTitle(page)).toHaveText(BADR.title, { timeout: 30_000 });
  await expect(page.locator('main.nb-static')).toHaveCount(0);
  await expect(page).toHaveTitle(`${BADR.title} — نبراس`);
});

test('404.html loads the app, which reports the unknown page', async ({ page }) => {
  await page.goto('./404.html');
  await expect(page.getByText('لم نجد هذه الصفحة، فعدنا بك إلى الخريطة')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
