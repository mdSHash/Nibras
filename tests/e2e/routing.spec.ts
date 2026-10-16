// Addresses (Phase 2): every event, person, Qur'an passage and replay has its
// own path, Back closes what was opened, and filters ride in the query.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { test, expect } from './support/fixtures';
import { behavior, content, eventById, header, openAppWithEvent, openEventBySearch, panel, panelTitle } from './support/app';
import { eventSlug } from '../../shared/routes';

const generated = JSON.parse(readFileSync(join(import.meta.dirname, '..', '..', 'src', 'generated', 'events.json'), 'utf8')) as {
  id: string;
  slug?: string;
}[];
const slugOf = (eventId: string): string => eventSlug(generated.find((e) => e.id === eventId)!);

/** The path after the site base, e.g. "/event/battle-badr/". */
const pathOf = (page: Page): string => new URL(page.url()).pathname.replace(/^\/Nibras/, '');
const queryOf = (page: Page): string => new URL(page.url()).search;

const BADR = 'battle-badr';
const SIFFIN = 'event-109-معركة-صفين';

test('a shared event link opens that event and keeps it @phone', async ({ page }) => {
  await page.goto(`./event/${slugOf(BADR)}/`);
  await expect(panelTitle(page)).toHaveText(eventById(BADR).title, { timeout: 30_000 });
  // The first-event auto-select (1 s after the intro) must not replace it.
  await page.waitForTimeout(1500);
  await expect(panelTitle(page)).toHaveText(eventById(BADR).title);
  expect(pathOf(page)).toBe(`/event/${slugOf(BADR)}/`);
});

test('an old link by event id moves to the event slug', async ({ page }) => {
  await page.goto(`./event/${encodeURIComponent(SIFFIN)}/`);
  await expect(panelTitle(page)).toHaveText(eventById(SIFFIN).title, { timeout: 30_000 });
  expect(pathOf(page)).toBe('/event/battle-of-siffin/');
});

test('the address follows the selected event and Back returns to the previous one', async ({ page }) => {
  await openAppWithEvent(page);
  const first = behavior.autoSelectedEventId;
  expect(pathOf(page)).toBe(`/event/${slugOf(first)}/`);
  await openEventBySearch(page, BADR, 'بدر');
  expect(pathOf(page)).toBe(`/event/${slugOf(BADR)}/`);
  await page.goBack();
  await expect(panelTitle(page)).toHaveText(eventById(first).title);
  await page.goForward();
  await expect(panelTitle(page)).toHaveText(eventById(BADR).title);
});

test('closing the panel returns to the map address', async ({ page }) => {
  await openAppWithEvent(page);
  await panel(page).getByRole('button', { name: 'إغلاق لوحة الحدث' }).click();
  await expect(panelTitle(page)).toBeHidden();
  expect(pathOf(page)).toBe('/');
});

test('a person opened from an event has its address; Back and the close button return to the event', async ({ page }) => {
  await openAppWithEvent(page);
  await openEventBySearch(page, BADR, 'بدر');
  const chip = panel(page).locator('section').filter({ hasText: 'الصحابة والقادة' }).getByRole('button').first();
  await chip.click();
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'إغلاق' }) }).last();
  await expect(dialog).toBeVisible();
  expect(pathOf(page)).toMatch(/^\/person\/[a-z0-9-]+\/$/);
  const personPath = pathOf(page);

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(panelTitle(page)).toHaveText(eventById(BADR).title);
  expect(pathOf(page)).toBe(`/event/${slugOf(BADR)}/`);

  await page.goForward();
  await expect(dialog).toBeVisible();
  expect(pathOf(page)).toBe(personPath);
  await dialog.getByRole('button', { name: 'إغلاق' }).click();
  await expect(dialog).toBeHidden();
  expect(pathOf(page)).toBe(`/event/${slugOf(BADR)}/`);
});

test('a shared person link opens the biography over the map', async ({ page }) => {
  const person = content.companions.find((c) => c.id === 'abu-bakr')!;
  await page.goto('./person/abu-bakr/');
  const dialog = page.getByRole('dialog', { name: person.name });
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  await dialog.getByRole('button', { name: 'إغلاق' }).click();
  await expect(dialog).toBeHidden();
  expect(pathOf(page)).toBe('/');
});

test('a Qur\'an passage has its address and Back closes it', async ({ page }) => {
  await openAppWithEvent(page);
  await openEventBySearch(page, BADR, 'بدر');
  await panel(page).getByRole('button', { name: /عرض الآيات/ }).first().click();
  expect(pathOf(page)).toMatch(/^\/quran\/\d+\/\d+(-\d+)?\/$/);
  const quranPath = pathOf(page);
  await page.goBack();
  await expect(panelTitle(page)).toHaveText(eventById(BADR).title);
  expect(pathOf(page)).toBe(`/event/${slugOf(BADR)}/`);
  // Reloading the passage address opens the same passage.
  await page.goto(`.${quranPath}`);
  await expect(page.getByRole('dialog').getByRole('button', { name: 'إغلاق' })).toBeVisible({ timeout: 30_000 });
});

test('a shared replay link opens the replay; closing it shows its event', async ({ page }) => {
  await page.goto('./battle/battle-of-badr/');
  await expect(page.locator('h1[lang="ar"]')).toHaveText(eventById(BADR).title, { timeout: 30_000 });
  await page.getByRole('button', { name: 'رجوع' }).click();
  await expect(page.locator('h1[lang="ar"]')).toBeHidden();
  await expect(panelTitle(page)).toHaveText(eventById(BADR).title);
  expect(pathOf(page)).toBe(`/event/${slugOf(BADR)}/`);
});

test('filters are read from and written to the query', async ({ page }) => {
  await page.goto('./?type=battles');
  await expect(header.chat(page)).toBeVisible({ timeout: 30_000 });
  const battles = behavior.filterCombinations.find((c) => c.type === 'battles' && c.era === 'all')!;
  // The desktop search bar shows the filtered event count.
  await expect(header.search(page)).toContainText(`${battles.count} حدث`);
  await header.search(page).click();
  const drawer = page.getByRole('dialog').filter({ has: page.getByRole('listbox') });
  // The second «الكل» is the type filter (the first is the era filter).
  await drawer.getByRole('button', { name: 'الكل', exact: true }).last().click();
  await expect.poll(() => queryOf(page)).toBe('');
});

test('an unknown address returns to the map with a notice', async ({ page }) => {
  await page.goto('./no-such-page/');
  await expect(header.chat(page)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('لم نجد هذه الصفحة، فعدنا بك إلى الخريطة')).toBeVisible();
  expect(pathOf(page)).toMatch(/^\/(event\/[a-z0-9-]+\/)?$/);
});
