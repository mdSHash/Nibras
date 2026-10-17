/**
 * Draws the site's raster images from its SVGs:
 *   - public/og-image.png (1200×630), the share image in link previews
 *     (WhatsApp, Telegram, X, Facebook) for every page: the logo
 *     (public/nibras-icon.svg), the name and the site description
 *     (shared/pageMeta.ts) in the app's colours and fonts
 *   - public/favicon.png (32×32), from public/favicon.svg, for browsers
 *     without SVG favicons
 * Run it again after changing any of them; it needs the network for Google Fonts.
 *
 *   npx tsx scripts/make-site-images.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { SITE } from '../shared/pageMeta';
import { ROOT } from './baseline/lib';

const logo = readFileSync(join(ROOT, 'public', 'nibras-icon.svg'), 'utf8');
const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Amiri+Quran&family=Tajawal:wght@500&display=block">
<style>
  html, body { margin: 0; }
  .card {
    width: ${SITE.imageWidth}px; height: ${SITE.imageHeight}px; box-sizing: border-box;
    display: flex; align-items: center; gap: 64px; padding: 0 88px;
    background: radial-gradient(120% 140% at 85% 20%, #2e231c 0%, #1c1512 55%, #140f0c 100%);
    color: #f4ece1; position: relative; overflow: hidden;
  }
  .card::after {
    content: ''; position: absolute; inset: 22px; border: 2px solid #d4a37366; border-radius: 18px; pointer-events: none;
  }
  .logo { width: 340px; height: 340px; flex: none; }
  .logo svg { width: 100%; height: 100%; }
  .name { font-family: 'Amiri', serif; font-weight: 700; font-size: 128px; line-height: 1.1; color: #d4a373; margin: 0 0 18px; }
  .description { font-family: 'Tajawal', sans-serif; font-weight: 500; font-size: 34px; line-height: 1.6; margin: 0; max-width: 620px; }
</style>
</head>
<body>
  <div class="card">
    <div class="logo">${logo}</div>
    <div>
      <p class="name">نِبْرَاس</p>
      <p class="description">${SITE.description}</p>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: SITE.imageWidth, height: SITE.imageHeight } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(ROOT, 'public', SITE.image);
  await page.locator('.card').screenshot({ path: out });
  console.log(`Wrote ${out}`);

  const favicon = readFileSync(join(ROOT, 'public', 'favicon.svg'), 'utf8');
  await page.setViewportSize({ width: 32, height: 32 });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:32px;height:32px}</style>${favicon}`);
  const png = join(ROOT, 'public', 'favicon.png');
  await page.locator('svg').screenshot({ path: png, omitBackground: true });
  console.log(`Wrote ${png}`);
} finally {
  await browser.close();
}
