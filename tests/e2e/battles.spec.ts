import { test, expect, knownFailure } from './support/fixtures';
import { content, openAppWithEvent, openEventBySearch, panel, panelTitle } from './support/app';
import type { Page } from '@playwright/test';

const battles = content.battles as { id: string }[];
const replayEvents = content.events.filter((e) => e.battle?.available);

const player = {
  title: (page: Page) => page.locator('h1[lang="ar"]'),
  // The "current / total" time display next to the transport buttons.
  time: (page: Page) => page.locator('span.font-mono.tabular-nums'),
};

async function openReplay(page: Page, eventId: string): Promise<void> {
  await openEventBySearch(page, eventId);
  await panel(page).getByRole('button', { name: 'مشاهدة المعركة على الخريطة' }).click();
}

const seconds = (mmss: string): number => {
  const [m, s] = mmss.trim().split(':').map(Number);
  return m * 60 + s;
};

test('the event data links 12 replays, one per scenario', () => {
  expect(replayEvents.map((e) => e.battle!.scenarioId).sort()).toEqual(battles.map((b) => b.id).sort());
});

// REPLAYS=badr (set by CI on pull requests) keeps only the Badr replay; the other 11 are registered
// as skipped, so they still count as existing tests. Pushes to main and `npm run verify` run all 12.
const onlyBadr = process.env.REPLAYS === 'badr';

for (const event of replayEvents) {
  const scenario = battles.find((b) => b.id === event.battle!.scenarioId)!;
  const isBadr = scenario.id === 'battle-of-badr';
  const tag = isBadr ? ' @phone' : '';
  const replayTest = onlyBadr && !isBadr ? test.skip : test;

  replayTest(`replay ${scenario.id} loads, plays and closes${tag}`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'phone-webkit' && process.platform === 'linux',
      'WebKit for Linux (GTK, headless on the CI runner) loads the replay but its clock never starts, even after 20 s; WebKit on Windows runs this in npm run verify',
    );
    await openAppWithEvent(page);
    await openReplay(page, event.id);
    // The replay is headed by its event's title (Phase 1B).
    await expect(player.title(page)).toHaveText(event.title, { timeout: 30_000 });
    await expect(page.getByText('جارٍ تحميل المعركة...')).toBeHidden({ timeout: 30_000 });
    await expect(page.getByText('تعذّر تحميل المعركة')).toHaveCount(0);
    await expect(page.locator('canvas').first()).toBeVisible();

    await page.getByRole('button', { name: 'تشغيل', exact: true }).locator('visible=true').last().click();
    await expect(page.getByRole('button', { name: 'إيقاف', exact: true }).locator('visible=true')).not.toHaveCount(0);
    // The clock starts once the first frames render: about a second on a laptop, but much later on
    // a CI runner that draws WebGL in software (seen up to several seconds), so wait for it.
    const clock = async () => ((await player.time(page).textContent()) ?? '').split('/').map(seconds);
    await expect.poll(async () => (await clock())[0], { timeout: 20_000 }).toBeGreaterThan(0);
    const [current, total] = await clock();
    expect(total).toBeGreaterThan(current);

    await page.getByRole('button', { name: 'رجوع' }).click();
    await expect(player.title(page)).toBeHidden();
    await expect(panelTitle(page)).toHaveText(event.title);
  });
}

test.describe('known failures', () => {
  test('the replay time display reads left to right', async ({ page }) => {
    knownFailure('the "current / total" timer has no dir="ltr", so in RTL it reads "01:08 / 00:00"');
    await openAppWithEvent(page);
    await openReplay(page, 'battle-badr');
    await expect(page.getByText('جارٍ تحميل المعركة...')).toBeHidden({ timeout: 30_000 });
    expect(await player.time(page).evaluate((el) => getComputedStyle(el).direction)).toBe('ltr');
  });
});

// Known failure 4 of the baseline, fixed in Phase 1B: the subtitle is the event's date label.
test('the replay subtitle shows the event date in Arabic', async ({ page }) => {
  await openAppWithEvent(page);
  await openReplay(page, 'battle-badr');
  const subtitle = player.title(page).locator('xpath=following-sibling::p');
  await expect(subtitle).toBeVisible({ timeout: 30_000 });
  await expect(subtitle).toHaveText(content.events.find((e) => e.id === 'battle-badr')!.date.hijriDisplay);
  expect(await subtitle.textContent()).not.toMatch(/[A-Za-z]/);
});
