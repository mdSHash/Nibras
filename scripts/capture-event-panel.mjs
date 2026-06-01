#!/usr/bin/env node
/**
 * Capture EventPanel screenshots on desktop + mobile viewports for review.
 * Picks one Yamamah-style major event so the panel has all sections
 * populated (description, course of events, companions, sources).
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

  console.log(`[capture-${label}] navigating ${URL} (${viewport.width}x${viewport.height})`);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Skip intro / tour
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

  // Dismiss any lingering intro
  for (let i = 0; i < 10; i++) {
    const introVisible = await page
      .locator('h1:has-text("نِبْرَاس")')
      .first()
      .isVisible()
      .catch(() => false);
    if (!introVisible) break;
    await page.locator('body').click({ position: { x: viewport.width / 2, y: viewport.height - 80 } }).catch(() => {});
    await page.waitForTimeout(400);
  }

  // Open search and select Yamama
  await page.keyboard.press('Control+K').catch(() => {});
  await page.waitForTimeout(700);
  await page.keyboard.type('اليمامة', { delay: 30 }).catch(() => {});
  await page.waitForTimeout(700);
  const result = page.locator('button:has-text("اليمامة"), [role="option"]:has-text("اليمامة")').first();
  if (await result.isVisible().catch(() => false)) {
    await result.click();
  }
  await page.waitForTimeout(2000);

  // Make sure the panel is visible (mobile may need expansion)
  const panel = page.locator('[data-tour-id="event-panel"]').first();
  await panel.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

  // Top of panel — header + dates + first sections
  const top = path.join(OUT, `${label}_01_top.png`);
  await page.screenshot({ path: top, fullPage: false });
  console.log(`[capture-${label}]   wrote ${top}`);

  // Scroll the panel down to capture the description audio + battle button
  const panelScroll = await panel.locator('div.overflow-y-auto').first();
  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight * 0.35)).catch(() => {});
  await page.waitForTimeout(400);
  const mid = path.join(OUT, `${label}_02_mid.png`);
  await page.screenshot({ path: mid, fullPage: false });
  console.log(`[capture-${label}]   wrote ${mid}`);

  // Scroll further — course of events + companions
  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight * 0.65)).catch(() => {});
  await page.waitForTimeout(400);
  const lower = path.join(OUT, `${label}_03_lower.png`);
  await page.screenshot({ path: lower, fullPage: false });
  console.log(`[capture-${label}]   wrote ${lower}`);

  // Scroll to bottom — sources/refs section
  await panelScroll.evaluate((el) => (el.scrollTop = el.scrollHeight)).catch(() => {});
  await page.waitForTimeout(400);
  const bottom = path.join(OUT, `${label}_04_bottom.png`);
  await page.screenshot({ path: bottom, fullPage: false });
  console.log(`[capture-${label}]   wrote ${bottom}`);

  await browser.close();
}

async function main() {
  await ensureDir(OUT);
  // Desktop wide
  await captureViewport({ width: 1440, height: 900 }, 'desktop');
  // Mobile (iPhone-ish)
  await captureViewport({ width: 390, height: 844 }, 'mobile');
  console.log('[capture] done.');
}

main().catch((e) => {
  console.error('[capture] failed:', e);
  process.exit(1);
});
