import { test, expect, knownFailure } from './support/fixtures';
import { content, openAppWithEvent, openEventBySearch, panel, panelTitle } from './support/app';
import type { Page } from '@playwright/test';

const battles = content.battles as { id: string; nameAr: string; date: string }[];
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

for (const event of replayEvents) {
  const scenario = battles.find((b) => b.id === event.battle!.scenarioId)!;
  const tag = scenario.id === 'battle-of-badr' ? ' @phone' : '';

  test(`replay ${scenario.id} loads, plays and closes${tag}`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'phone-webkit' && process.platform === 'linux',
      'WebKit for Linux (GTK, headless in CI) loads the replay but never advances its clock; WebKit on Windows runs this in npm run verify',
    );
    await openAppWithEvent(page);
    await openReplay(page, event.id);
    await expect(player.title(page)).toHaveText(scenario.nameAr, { timeout: 30_000 });
    await expect(page.getByText('جارٍ تحميل المعركة...')).toBeHidden({ timeout: 30_000 });
    await expect(page.getByText('تعذّر تحميل المعركة')).toHaveCount(0);
    await expect(page.locator('canvas').first()).toBeVisible();

    await page.getByRole('button', { name: 'تشغيل', exact: true }).locator('visible=true').last().click();
    await expect(page.getByRole('button', { name: 'إيقاف', exact: true }).locator('visible=true')).not.toHaveCount(0);
    await page.waitForTimeout(3_000);
    const [current, total] = ((await player.time(page).textContent()) ?? '').split('/');
    expect(seconds(current)).toBeGreaterThan(0);
    expect(seconds(total)).toBeGreaterThan(seconds(current));

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

  test('the replay subtitle shows the date in Arabic', async ({ page }) => {
    knownFailure('the subtitle shows the English scenario date inside the Arabic UI');
    await openAppWithEvent(page);
    await openReplay(page, 'battle-badr');
    const subtitle = player.title(page).locator('xpath=following-sibling::p');
    await expect(subtitle).toBeVisible({ timeout: 30_000 });
    expect(await subtitle.textContent()).not.toMatch(/[A-Za-z]/);
  });
});
