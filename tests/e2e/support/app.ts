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
  battles: { id: string; nameAr: string }[];
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
  search: (page: Page) => page.locator('header [data-tour-id="search-button"]').or(page.getByRole('button', { name: 'فتح قائمة البحث والتصفية' })).first(),
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
  await expect(page.getByRole('button', { name: 'اسأل المساعد الذكي' })).toBeVisible({ timeout: 15_000 });
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
  await drawer.getByRole('option', { name: event.title }).first().click();
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
