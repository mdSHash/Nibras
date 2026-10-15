import { test, expect } from './support/fixtures';
import { behavior, content, eventById, header, openAppWithEvent, panelTitle } from './support/app';
import type { Locator, Page } from '@playwright/test';

const ERA_LABEL = { all: 'الكل', prophet: 'عصر النبي ﷺ', rashidun: 'الخلفاء الراشدين' } as const;
const TYPE_LABEL = { all: 'الكل', battles: 'المعارك فقط', events: 'الأحداث فقط' } as const;

// Titles are unique in the data, so the title shown in an option identifies its event.
const idByTitle = new Map(content.events.map((e) => [e.title, e.id]));

function drawer(page: Page): Locator {
  return page.getByRole('dialog', { name: 'قائمة البحث' });
}

/** The event ids listed in the drawer, in display order. */
async function listedEventIds(page: Page): Promise<string[]> {
  // The first span.truncate in an option holds the event title (SearchMenu.tsx).
  const titles = await drawer(page)
    .getByRole('option')
    .evaluateAll((options) => options.map((o) => o.querySelector('span.truncate')?.textContent ?? ''));
  return titles.map((title) => idByTitle.get(title) ?? `unknown: ${title}`);
}

async function expectListing(page: Page, count: number, eventIds: string[]): Promise<void> {
  await expect(drawer(page).getByText(`${count} حدث`, { exact: true })).toBeVisible();
  await expect(drawer(page).getByRole('option')).toHaveCount(count);
  expect(await listedEventIds(page)).toEqual(eventIds);
}

async function setFilters(page: Page, era: keyof typeof ERA_LABEL, type: keyof typeof TYPE_LABEL): Promise<void> {
  // Both groups have a "الكل" button: the era group comes first, then the type group.
  const eraButtons = drawer(page).getByRole('button', { name: ERA_LABEL[era], exact: true });
  await (era === 'all' ? eraButtons.first() : eraButtons).click();
  const typeButtons = drawer(page).getByRole('button', { name: TYPE_LABEL[type], exact: true });
  await (type === 'all' ? typeButtons.last() : typeButtons).click();
}

test('every filter combination lists the events of the behavior map, in timeline order', async ({ page }) => {
  await openAppWithEvent(page);
  await header.search(page).click();
  await expect(drawer(page)).toBeVisible();
  for (const combo of behavior.filterCombinations) {
    await test.step(combo.id, async () => {
      await setFilters(page, combo.era as keyof typeof ERA_LABEL, combo.type as keyof typeof TYPE_LABEL);
      await expectListing(page, combo.count, combo.eventIds);
    });
  }
});

test('the fixed search queries return the results of the behavior map', async ({ page }) => {
  await openAppWithEvent(page);
  await header.search(page).click();
  const input = drawer(page).getByRole('textbox', { name: 'بحث' });
  for (const query of behavior.search) {
    await test.step(query.id, async () => {
      await input.fill(query.id);
      await expectListing(page, query.count, query.eventIds);
    });
  }
});

test('choosing a result opens that event and the drawer closes on its close button @phone', async ({ page }) => {
  await openAppWithEvent(page);
  await header.search(page).click();
  await drawer(page).getByRole('textbox', { name: 'بحث' }).fill('بدر');
  const badr = eventById('battle-badr');
  await drawer(page).getByRole('option').filter({ hasText: badr.title }).first().click();
  await expect(panelTitle(page)).toHaveText(badr.title);
  if (await drawer(page).isVisible()) await drawer(page).getByRole('button', { name: 'إغلاق القائمة' }).click();
  await expect(drawer(page)).toBeHidden();
  await expect(panelTitle(page)).toHaveText(badr.title);
});

test('a query with no match shows an empty list', async ({ page }) => {
  await openAppWithEvent(page);
  await header.search(page).click();
  await drawer(page).getByRole('textbox', { name: 'بحث' }).fill('كلمةلاتوجد');
  await expect(drawer(page).getByText('0 حدث', { exact: true })).toBeVisible();
  await expect(drawer(page).getByRole('option')).toHaveCount(0);
});
