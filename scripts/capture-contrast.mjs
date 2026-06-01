#!/usr/bin/env node
/**
 * Capture contrast verification frames.
 * Opens home on desktop + mobile, in light + dark mode, with the
 * Yamama event panel open. Saves PNGs to tmp/contrast-frames/.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const URL = process.env.NIBRAS_URL ?? 'http://localhost:3001';
const OUT = path.resolve('tmp/contrast-frames');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width: 390,  height: 844 },
];

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function setupPage(page) {
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

  // Dismiss any lingering intro overlay
  for (let i = 0; i < 8; i++) {
    const introVisible = await page.locator('[class*="IntroScreen"], [data-intro], h1:has-text("نِبْرَاس")').first().isVisible().catch(() => false);
    if (!introVisible) break;
    await page.locator('body').click({ position: { x: 200, y: 600 } }).catch(() => {});
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(800);
}

async function openYamama(page) {
  await page.keyboard.press('Control+K').catch(() => {});
  await page.waitForTimeout(700);
  await page.keyboard.type('اليمامة', { delay: 30 }).catch(() => {});
  await page.waitForTimeout(700);
  const firstResult = page.locator('button:has-text("اليمامة"), [role="option"]:has-text("اليمامة")').first();
  if (await firstResult.isVisible().catch(() => false)) {
    await firstResult.click();
  } else {
    console.warn('[capture] Yamama search result not visible');
  }
  await page.waitForTimeout(1500);
}

async function getDarkState(page) {
  return await page.evaluate(() => document.documentElement.classList.contains('dark'));
}

async function setDarkMode(page, want) {
  const cur = await getDarkState(page);
  if (cur === want) return;
  const toggle = page.locator('[data-tour-id="dark-mode-toggle"]').first();
  await toggle.click({ force: true }).catch(() => {});
  await page.waitForTimeout(700);
  const after = await getDarkState(page);
  if (after !== want) {
    console.warn(`[capture] dark toggle did not flip; want=${want} got=${after}`);
  }
}

async function captureSet(page, vp, mode) {
  // Full page (panel + map + timeline visible)
  const full = path.join(OUT, `${vp.name}-${mode}-full.png`);
  await page.screenshot({ path: full, fullPage: false });
  console.log(`[capture]   ${full}`);

  // Just the panel area (left side on desktop, fullscreen on mobile)
  const panel = page.locator('[class*="EventPanel"], aside, [role="dialog"]').first();
  if (await panel.isVisible().catch(() => false)) {
    const panelPath = path.join(OUT, `${vp.name}-${mode}-panel.png`);
    await panel.screenshot({ path: panelPath }).catch(() => {});
    console.log(`[capture]   ${panelPath}`);
  }

  // Timeline strip near bottom
  const timeline = page.locator('[data-tour-id="timeline"], [class*="Timeline"]').first();
  if (await timeline.isVisible().catch(() => false)) {
    const tlPath = path.join(OUT, `${vp.name}-${mode}-timeline.png`);
    await timeline.screenshot({ path: tlPath }).catch(() => {});
    console.log(`[capture]   ${tlPath}`);
  }
}

async function runViewport(browser, vp) {
  console.log(`\n[capture] === viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    locale: 'ar',
  });
  const page = await ctx.newPage();
  await setupPage(page);
  await openYamama(page);

  // Light first
  await setDarkMode(page, false);
  await page.waitForTimeout(500);
  await captureSet(page, vp, 'light');

  // Then dark
  await setDarkMode(page, true);
  await page.waitForTimeout(500);
  await captureSet(page, vp, 'dark');

  await ctx.close();
}

async function main() {
  await ensureDir(OUT);
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      await runViewport(browser, vp);
    }
  } finally {
    await browser.close();
  }
  console.log('\n[capture] done.');
}

main().catch((e) => {
  console.error('[capture] failed:', e);
  process.exit(1);
});
