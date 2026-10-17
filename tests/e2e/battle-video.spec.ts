// The battle video player (Phase 3H), with a stand-in for YouTube's IFrame API
// (support/fakeYouTube.ts): never the real video, no screenshot. One test:
// the player opens from the event panel, shows its Arabic controls and the
// captions (on by default), answers the keyboard and closes back to the event.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './support/fixtures';
import { eventById, openAppWithEvent, openEventBySearch, panelTitle } from './support/app';
import type { VideoCaption } from '../../shared/battleVideo';

const ROOT = join(import.meta.dirname, '..', '..');
const captions = JSON.parse(
  readFileSync(join(ROOT, 'src', 'generated', 'battleVideoCaptions', 'battle-badr.json'), 'utf8'),
) as VideoCaption[];

test('a battle with a video opens it with Arabic controls and captions (stub video) @phone', async ({ page, network }) => {
  const badr = eventById('battle-badr');
  await openAppWithEvent(page);
  await openEventBySearch(page, 'battle-badr', 'بدر');
  await page.getByRole('button', { name: 'مشاهدة المعركة' }).click();

  await expect(page).toHaveURL(/\/battle\/battle-of-badr\/$/);
  const player = page.getByRole('dialog', { name: badr.title });
  await expect(player).toBeVisible();
  expect(network.youtubeRequests).toHaveLength(1);
  await expect(page.locator('[data-fake-youtube="HCQru0jnWeA"]')).toBeAttached();

  // Playing on its own, every control enabled and named in Arabic.
  for (const name of ['إيقاف مؤقت', 'رجوع ١٠ ثوانٍ', 'تقديم ١٠ ثوانٍ', 'كتم الصوت', 'إخفاء الترجمة', 'رجوع']) {
    await expect(player.getByRole('button', { name, exact: true })).toBeEnabled();
  }
  await expect(player.getByRole('slider', { name: 'موضع الفيديو' })).toBeEnabled();

  // Captions are on: the clock held inside the first caption shows it.
  const band = page.getByTestId('video-captions');
  const inFirst = (captions[0].start + captions[0].end) / 2;
  await page.evaluate((t) => (window as unknown as { __fakeYouTube: { hold(t: number): void } }).__fakeYouTube.hold(t), inFirst);
  await expect(band).toHaveText(captions[0].text);

  // Keyboard: C hides the captions, K pauses.
  await page.keyboard.press('c');
  await expect(band).toHaveText('');
  await expect(player.getByRole('button', { name: 'إظهار الترجمة' })).toBeVisible();
  await page.keyboard.press('k');
  await expect(player.getByRole('button', { name: 'تشغيل', exact: true })).toBeVisible();

  // Escape closes the player and returns to the event.
  await page.keyboard.press('Escape');
  await expect(player).toBeHidden();
  await expect(page).toHaveURL(/\/event\/battle-badr\/$/);
  await expect(panelTitle(page)).toHaveText(badr.title);
});
