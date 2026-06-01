#!/usr/bin/env node
/**
 * Capture EventPanel screenshots on desktop + mobile viewports for review.
 * Picks a Yamamah-style major event so the panel has all sections populated.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const URL = process.env.NIBRAS_URL ?? 'http://localhost:3001';
const OUT = path.resolve('tmp/event-panel-frames');

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function captureViewport(viewport, label) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  console.log(`[${label}] navigating ${URL} (${viewport.width}x${viewport.height})`);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  await page.evaluate(() => {
    try {
      localStorage.setItem('nibras-intro-completed', 'true');
      localStorage.setItem('nibras_tour_prompted', 'true');
      localStorage.setItem('nibras-tour-state', JSON.stringify({
        isActive: false, currentStep: 0, isCompleted: true, hasSeenTour: true,
      }));
    } catch {}
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

  for (let i = 0; i < 10; i++) {
    const intro = await page.locator('h1:has-text("نِبْرَاس")').first().isVisible().catch(() => false);
    if (!intro) break;
    await page.locator('body').click({ position: { x: viewport.width / 2, y: viewport.height - 80 } }).catch(() => {});
    await page.waitForTimeout(400);
  }

  await page.keyboard.press('Control+K').catch(() => {});
  await page.waitForTimeout(700);
  await page.keyboard.type('اليمامة', { delay: 30 }).catch(() => {});
  await page.waitForTimeout(700);
  const result = page.locator('button:has-text("اليمامة"), [role="option"]:has-text("اليمامة")').first();
  if (await result.isVisible().catch(() => false)) {
    await result.click();
  }
  await page.waitForTimeout(2000);

  const panel = page.locator('[data-tour-id="event-panel"]').first();
  await panel.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

  const top = path.join(OUT, `${label}_01_hero.png`);
  await page.screenshot({ path: top, fullPage: false });
  console.log(`[${label}]   ${top}`);

  const panelScroll = await panel.locator('div.overflow-y-auto').first();
  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight * 0.30)).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${label}_02_lead.png`), fullPage: false });

  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight * 0.55)).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${label}_03_events.png`), fullPage: false });

  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight * 0.80)).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${label}_04_companions.png`), fullPage: false });

  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight)).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${label}_05_footer.png`), fullPage: false });

  await browser.close();
}

async function main() {
  await ensureDir(OUT);
  await captureViewport({ width: 1440, height: 900 }, 'desktop');
  await captureViewport({ width: 390, height: 844 }, 'mobile');
  console.log('done.');
}

main().catch((e) => {
  console.error('failed:', e);
  process.exit(1);
});
