#!/usr/bin/env node
/**
 * One-shot frame capture for the Battle of Nahavand scenario.
 *
 * Launches Chromium against the local dev server, dismisses the intro,
 * deep-links into the Nahavand battle, and screenshots the canvas at a
 * series of simulation-time markers. Used to verify the camera zoom
 * level and the visibility of combat / casualties at each key moment.
 *
 * Output: tmp/nahavand-frames/*.png
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const URL = process.env.NIBRAS_URL ?? 'http://localhost:3000';
const OUT = path.resolve('tmp/nahavand-frames');
const MARKERS = [
  // [seek-target seconds, label]
  [3,  '03s_overview-zagros'],
  [9,  '09s_persian-line-revealed'],
  [13, '13s_caltrops-discovered'],
  [18, '18s_mughirah-embassy'],
  [25, '25s_council-tulayhah'],
  [31, '31s_dua-and-takbirs'],
  [36, '36s_feigned-retreat'],
  [42, '42s_third-takbir-charge'],
  [46, '46s_numan-falls'],
  [54, '54s_envelopment'],
  [62, '62s_honey-pass'],
  [68, '68s_umar-grief'],
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

  // Mark intro/tour as already seen
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

  // Wait for the App's debug helper to mount, then deep-link into Nahavand
  console.log('[capture] waiting for __nibrasOpenBattle helper…');
  await page.waitForFunction(
    () => typeof window.__nibrasOpenBattle === 'function',
    null,
    { timeout: 30000 },
  );
  console.log('[capture] opening Nahavand via deep-link');
  await page.evaluate(() => {
    window.__nibrasOpenBattle('battle-of-nahavand');
  });

  // Wait for canvas + engine ready
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(3500);
  console.log('[capture] canvas ready, beginning frame loop');

  // Run playback at 4× to keep wall-clock under 20s for 72 sim-seconds
  console.log('[capture] starting playback at 4× speed');
  await page.evaluate(() => {
    try {
      window.__nibrasEngine?.setSpeed?.(4);
      window.__nibrasEngine?.play?.();
    } catch {}
  });

  const captured = new Set();
  const startReal = Date.now();
  const TIMEOUT_MS = 90_000;

  while (captured.size < MARKERS.length && Date.now() - startReal < TIMEOUT_MS) {
    const simTime = await page.evaluate(() => {
      try {
        return window.__nibrasEngine?.getTime?.() ?? null;
      } catch {
        return null;
      }
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

  // Wait for end-of-battle, capture the summary panel
  console.log('[capture] waiting for completion + summary…');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(OUT, 'zz_summary.png'), fullPage: false });

  await browser.close();
  console.log('[capture] done.');
}

main().catch((e) => {
  console.error('[capture] failed:', e);
  process.exit(1);
});
