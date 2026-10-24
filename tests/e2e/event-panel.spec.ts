import { test, expect } from './support/fixtures';
import { behavior, content, eventById, openAppWithEvent, openEventBySearch, panel, panelTitle, type BaselineEvent } from './support/app';
import { hash16 } from '../../scripts/baseline/lib';
import type { Page } from '@playwright/test';

const baseline = (id: string) => content.events.find((e) => e.id === id) as BaselineEvent & {
  text: { summary: string | null; fullDescription: string | null; courseOfEvents: (string | null)[] };
};

/** What the event panel shows, read from the DOM (structure of EventPanel.tsx). */
async function readPanel(page: Page) {
  return panel(page).evaluate((root) => {
    const article = root.querySelector('article');
    const sectionByHeading = (label: string) =>
      [...root.querySelectorAll('section')].find((s) => s.textContent?.includes(label)) ?? null;
    const figures = sectionByHeading('شخصيات أخرى');
    return {
      title: root.querySelector('h1')?.textContent ?? '',
      header: root.textContent ?? '',
      summary: article?.querySelector(':scope > p')?.textContent ?? null,
      fullDescription: article?.querySelector(':scope > div.text-justify')?.textContent ?? null,
      courseOfEvents: [...root.querySelectorAll('section[data-tour-id="course-section"] li p')].map((p) => p.textContent ?? ''),
      roles: [...root.querySelectorAll('section[data-tour-id="companions-section"] button span.truncate')].map((s) => s.textContent ?? ''),
      figures: figures ? [...figures.querySelectorAll('button')].map((b) => b.textContent ?? '') : [],
      quranChips: [...root.querySelectorAll('article button')]
        .filter((b) => b.textContent?.includes('عرض الآيات'))
        .map((b) => b.querySelector('span')?.textContent ?? ''),
    };
  });
}

async function expectPanelMatchesBaseline(page: Page, id: string): Promise<void> {
  const expected = baseline(id);
  const shown = await readPanel(page);
  expect(shown.title, id).toBe(expected.title);
  expect(shown.header, `${id}: hijri date`).toContain(expected.date.hijriDisplay);
  expect(shown.header, `${id}: gregorian year`).toContain(expected.date.gregorianDisplay);
  expect(shown.header, `${id}: place`).toContain(expected.location.name);
  expect(hash16(shown.summary), `${id}: summary`).toBe(expected.text.summary);
  expect(hash16(shown.fullDescription), `${id}: full description`).toBe(expected.text.fullDescription);
  expect(shown.courseOfEvents.map((s) => hash16(s)), `${id}: course of events`).toEqual(expected.text.courseOfEvents);
  expect(shown.roles, `${id}: companion cards`).toEqual(expected.companionRoles.map((p) => p.name));
  expect(shown.figures, `${id}: other figures`).toEqual(expected.keyFigures.map((p) => p.name));
  expect(shown.quranChips, `${id}: Quran chips`).toEqual(expected.quran.filter((q) => q.key !== 'unmatched').map((q) => q.ref));
}

test('every event renders as in the content baseline, walking the timeline with the arrow keys', async ({ page }) => {
  test.setTimeout(240_000);
  await openAppWithEvent(page);
  for (const [index, id] of behavior.timelineOrder.entries()) {
    if (index > 0) {
      await page.keyboard.press('ArrowRight');
      await expect(panelTitle(page)).toHaveText(eventById(id).title);
    }
    await expectPanelMatchesBaseline(page, id);
  }
  // At the end, ArrowRight stays put and ArrowLeft steps back.
  const last = behavior.timelineOrder.at(-1)!;
  await page.keyboard.press('ArrowRight');
  await expect(panelTitle(page)).toHaveText(eventById(last).title);
  await page.keyboard.press('ArrowLeft');
  await expect(panelTitle(page)).toHaveText(eventById(behavior.timelineOrder.at(-2)!).title);
});

test('the Badr panel shows its sections @phone', async ({ page }) => {
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  await expectPanelMatchesBaseline(page, 'battle-badr');
});

test('a companion card and a figure chip open the right biography', async ({ page }) => {
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  const badr = baseline('battle-badr');
  for (const person of [badr.companionRoles[0], badr.keyFigures[1]]) {
    const companion = content.companions.find((c) => c.id === person.companionId) as { id: string; name: string; bio: string };
    await panel(page).getByRole('button', { name: person.name }).first().click();
    const dialog = page.getByRole('dialog', { name: companion.name });
    await expect(dialog).toBeVisible();
    // The bio loads when the window opens (Phase 2B), so wait for it.
    await expect
      .poll(async () => (await dialog.locator('p').allTextContents()).map((p) => hash16(p)))
      .toContain(companion.bio);
    await dialog.getByRole('button', { name: 'إغلاق' }).click();
    await expect(dialog).toBeHidden();
    await expect(panelTitle(page)).toHaveText(badr.title);
  }
});

test('the ambiguous name أبو سفيان opens the bio findCompanion picks today', async ({ page }) => {
  await openAppWithEvent(page);
  await openEventBySearch(page, 'ghazwat_sawiq');
  const person = baseline('ghazwat_sawiq').keyFigures.find((p) => p.name === 'أبو سفيان')!;
  const companion = content.companions.find((c) => c.id === person.companionId)!;
  await panel(page).getByRole('button', { name: 'أبو سفيان', exact: true }).click();
  await expect(page.getByRole('dialog', { name: companion.name })).toBeVisible();
});

test('a Quran chip opens the right verses @phone', async ({ page }) => {
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  const ref = baseline('battle-badr').quran[0];
  const passage = (content as unknown as { quranPassages: { id: string; text: string }[] }).quranPassages.find((q) => q.id === ref.key)!;
  await panel(page).getByRole('button', { name: /عرض الآيات/ }).first().click();
  const dialog = page.getByRole('dialog', { name: ref.key });
  await expect(dialog).toBeVisible();
  // The verse text loads when the window opens (Phase 2B), so wait for it.
  await expect
    .poll(async () => (await dialog.locator('p').allTextContents()).map((p) => hash16(p)))
    .toContain(passage.text);
  await dialog.getByRole('button', { name: 'إغلاق' }).click();
  await expect(dialog).toBeHidden();
});

test('narration requests the event audio file and shows the playing state @phone', async ({ page, network }, testInfo) => {
  test.skip(
    testInfo.project.name === 'phone-firefox' && process.platform === 'linux',
    'Firefox on the Linux CI runner cannot play audio (no sound device), so the app shows its playback error; Firefox on Windows runs this in npm run verify',
  );
  // The file the app hands its audio player. WebKit on Windows loads media outside the page's
  // network layer (no request event, no resource timing), so the network log alone cannot show it.
  await page.addInitScript(() => {
    const sources: string[] = ((window as unknown as { __audioSources: string[] }).__audioSources = []);
    const NativeAudio = window.Audio;
    window.Audio = function (src?: string) {
      if (src) sources.push(src.split('/').pop() ?? '');
      return new NativeAudio(src);
    } as unknown as typeof Audio;
  });
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  const play = panel(page).getByRole('button', { name: 'تشغيل السرد' });
  await play.click();
  await expect(panel(page).getByRole('button', { name: 'إيقاف السرد' })).toBeVisible();
  const file = baseline('battle-badr').narration.descriptionFile;
  expect(await page.evaluate(() => (window as unknown as { __audioSources: string[] }).__audioSources)).toContain(file);
  if (testInfo.project.name !== 'phone-webkit') expect(network.audioRequests).toContain(file);
  await panel(page).getByRole('button', { name: 'إيقاف السرد' }).click();
  await expect(play).toBeVisible();
});

test('closing the panel deselects the event', async ({ page }) => {
  await openAppWithEvent(page);
  await panel(page).getByRole('button', { name: 'إغلاق لوحة الحدث' }).click();
  await expect(panelTitle(page)).toBeHidden();
});
