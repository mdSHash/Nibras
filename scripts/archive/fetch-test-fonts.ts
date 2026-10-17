// Downloads the Google Fonts stylesheets and font files the app requests
// (index.html and IntroScreen.tsx), so Playwright can serve them offline and
// screenshots use the real Arabic fonts. Run once; the files are committed.
//
//   npx tsx scripts/archive/fetch-test-fonts.ts
//
// Archived in Phase 3A: the fonts are now served with the site (src/fonts.ts), so tests no
// longer need Google's copies.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, sha256Hex } from '../baseline/lib';

// Every stylesheet URL the app loads today.
export const FONT_CSS_URLS = [
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Amiri+Quran&family=Tajawal:wght@400;500;700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap',
];

const OUT_DIR = join(ROOT, 'tests', 'e2e', 'assets', 'fonts');
// A Chromium user agent, so Google serves woff2 like it does to real visitors.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export const cssFileName = (url: string): string => `${sha256Hex(url).slice(0, 12)}.css`;
export const fontFileName = (url: string): string => new URL(url).pathname.split('/').filter(Boolean).join('_');

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const fontUrls = new Set<string>();
  for (const cssUrl of FONT_CSS_URLS) {
    const response = await fetch(cssUrl, { headers: { 'user-agent': USER_AGENT } });
    if (!response.ok) throw new Error(`${cssUrl}: HTTP ${response.status}`);
    const css = await response.text();
    writeFileSync(join(OUT_DIR, cssFileName(cssUrl)), css);
    for (const match of css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)) fontUrls.add(match[1]);
  }
  let bytes = 0;
  for (const url of fontUrls) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    bytes += data.length;
    writeFileSync(join(OUT_DIR, fontFileName(url)), data);
  }
  console.log(`Saved ${FONT_CSS_URLS.length} stylesheets and ${fontUrls.size} font files (${Math.round(bytes / 1024)} KB)`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('fetch-test-fonts.ts')) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
