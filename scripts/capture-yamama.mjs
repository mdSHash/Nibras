#!/usr/bin/env node
/**
 * One-shot frame capture for the Battle of al-Yamamah scenario.
 *
 * Launches Chromium against the local dev server, dismisses the intro,
 * deep-links into the Yamama battle, and screenshots the canvas at a
 * series of simulation-time markers. Used to verify the camera zoom
 * level and the visibility of combat / casualties at each key moment.
 *
 * Output: tmp/yamama-frames/*.png
 */
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const URL = process.env.NIBRAS_URL ?? 'http://localhost:3000';
const OUT = path.resolve('tmp/yamama-frames');
const MARKERS = [
  // [seek-target seconds, label]
  [2,  '02s_overview'],
  [8,  '08s_initial-clash'],
  [18, '18s_reorganization'],
  [26, '26s_counter-attack'],
  [33, '33s_muhakkim-falls'],
  [40, '40s_retreat-to-garden'],
  [46, '46s_baraa-wall'],
  [52, '52s_garden-of-death'],
  [58, '58s_musaylimah-falls'],
];

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function main() {
  await ensureDir(OUT);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  console.log(`[capture] navigating to ${URL}`);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Inject script to short-circuit the intro + tour state, then deep-link
  // into the Yamama scenario by setting a flag the App.tsx wiring respects.
  // Easier: skip the intro by clicking through, then open the EventPanel
  // and click Watch Battle Replay. But that depends on UI layout.
  //
  // Cleanest: use the Engine directly via window for testing. We'll set a
  // localStorage marker so the IntroScreen's onComplete fires fast, then
  // search for the Yamama event by title and click it.

  // Mark the intro as already seen so it auto-dismisses
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

  // Wait for the main UI surface
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

  // If intro is still showing, click its CTA. There's a "Begin / تابع" or
  // similar — we'll click anything that looks like a starting button.
  for (let i = 0; i < 12; i++) {
    const introVisible = await page.locator('[class*="IntroScreen"], [data-intro], h1:has-text("نِبْرَاس")').first().isVisible().catch(() => false);
    if (!introVisible) break;
    // Click anywhere to dismiss / skip
    await page.locator('body').click({ position: { x: 720, y: 750 } }).catch(() => {});
    await page.waitForTimeout(500);
  }

  // Open the search/menu to find the Yamama event
  console.log('[capture] opening search…');
  await page.keyboard.press('Control+K').catch(() => {});
  await page.waitForTimeout(800);
  // Type Yamama in Arabic
  await page.keyboard.type('اليمامة', { delay: 30 }).catch(() => {});
  await page.waitForTimeout(800);
  // Click first matching result
  const firstResult = page.locator('button:has-text("اليمامة"), [role="option"]:has-text("اليمامة")').first();
  if (await firstResult.isVisible().catch(() => false)) {
    await firstResult.click();
    console.log('[capture] selected Yamama event');
  } else {
    console.warn('[capture] could not find Yamama via search; trying URL hash fallback');
  }
  await page.waitForTimeout(1500);

  // Click "Watch Battle Replay" button (Arabic text in EventPanel)
  const watchBtn = page.locator('button:has-text("شاهد المعركة"), button:has-text("شاهد"), button:has-text("معركة")').first();
  if (await watchBtn.isVisible().catch(() => false)) {
    await watchBtn.click();
    console.log('[capture] clicked watch-battle button');
  } else {
    console.warn('[capture] watch button not found; the battle may not be reachable from this state');
  }

  // Wait for canvas + engine ready
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(3500);
  console.log('[capture] canvas ready, beginning frame loop');

  // Run playback in real time at 4× speed and capture frames at the right
  // sim-time markers. seek() doesn't fast-forward the combat simulation,
  // so we have to let the clock advance naturally for the CombatSystem to
  // accumulate damage and the figures to actually fall.
  console.log('[capture] starting playback at 4× speed');
  await page.evaluate(() => {
    try {
      window.__nibrasEngine?.setSpeed?.(4);
      window.__nibrasEngine?.play?.();
    } catch {}
  });

  // 60 sim seconds at 4× = 15 real seconds. We'll poll the sim clock and
  // screenshot whenever the marker time is crossed.
  const captured = new Set();
  const startReal = Date.now();
  const TIMEOUT_MS = 60_000; // hard cap

  while (captured.size < MARKERS.length && Date.now() - startReal < TIMEOUT_MS) {
    const simTime = await page.evaluate(() => {
      try {
        return window.__nibrasEngine?.getTime?.() ?? null;
      } catch { return null; }
    });
    if (simTime == null) {
      await page.waitForTimeout(150);
      continue;
    }
    for (const [t, label] of MARKERS) {
      if (captured.has(label)) continue;
      if (simTime + 0.05 >= t) {
        const file = path.join(OUT, `${label}.png`);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`[capture]   simTime=${simTime.toFixed(1)}s → ${label}`);
        captured.add(label);
      }
    }
    await page.waitForTimeout(120);
  }

  // Wait for the battle to fully complete, then capture the summary panel
  console.log('[capture] waiting for completion + summary…');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(OUT, 'zz_summary.png'), fullPage: false });

  await browser.close();
  console.log('[capture] done.');
}

main().catch((e) => {
  console.error('[capture] failed:', e);
  process.exit(1);
});
