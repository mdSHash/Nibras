// Lighthouse numbers and budget (baseline part 6). Runs against the production build
// in dist/ as a first-time visitor and compares each page's median with this
// platform's tests/baseline/lighthouse-<platform>.json; the rules are in ./lighthouse-budget.ts.
//
// Real (devtools) throttling, not Lighthouse's default simulated one: on localhost the
// simulation counts the whole bundle against the first paint, and on the live site it
// reported 100 where a real phone-speed load scores 24. Map tiles are blocked, because
// tests never use the network. The server gzips like GitHub Pages (vite preview does not).
//
// Where a platform has no numbers yet the step only reports (CI's first run gives Linux).
//
//   npx tsx scripts/baseline/lighthouse.ts            check the budget
//   npx tsx scripts/baseline/lighthouse.ts --update   record the numbers (only after approval)
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';
import { launch } from 'chrome-launcher';
import lighthouse, { desktopConfig } from 'lighthouse';
import { medianNumbers, overBudget, type LighthouseBaseline, type LighthouseNumbers } from './lighthouse-budget';
import { BASELINE_DIR, ROOT, isUpdateRun } from './lib';

const DIST = join(ROOT, 'dist');
const BASE = '/Nibras/';
const REPORT = join(ROOT, 'tmp', 'verify', 'lighthouse.json');
const BASELINE_FILE = join(BASELINE_DIR, `lighthouse-${process.platform}.json`);
const RUNS = 3;

const PAGES = [
  { name: 'phone-home', path: '', config: undefined },
  { name: 'phone-badr', path: 'event/battle-badr/', config: undefined },
  { name: 'desktop-home', path: '', config: desktopConfig },
];

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.m4a': 'audio/mp4',
};
const COMPRESSED = new Set(['.html', '.js', '.css', '.json', '.svg', '.webmanifest']);

/** dist/ as GitHub Pages serves it: under the base, folders by their index.html, gzip, 404.html. */
function serveDist(): Promise<Server> {
  const gzipped = new Map<string, Buffer>();
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let file = join(DIST, normalize(pathname.slice(BASE.length - 1)));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    const found = pathname.startsWith(BASE) && existsSync(file);
    if (!found) file = join(DIST, '404.html');
    const type = extname(file);
    const headers: Record<string, string> = { 'content-type': TYPES[type] ?? 'application/octet-stream', 'cache-control': 'max-age=600' };
    let body = readFileSync(file);
    if (COMPRESSED.has(type)) {
      body = gzipped.get(file) ?? gzipSync(body);
      gzipped.set(file, body);
      headers['content-encoding'] = 'gzip';
    }
    response.writeHead(found ? 200 : 404, headers);
    response.end(body);
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

async function measure(url: string, config: typeof desktopConfig | undefined): Promise<LighthouseNumbers> {
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox'],
  });
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        logLevel: 'error',
        throttlingMethod: 'devtools',
        blockedUrlPatterns: ['*/map-tiles/*'],
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
      config,
    );
    if (!result) throw new Error(`Lighthouse returned nothing for ${url}`);
    const { categories, audits } = result.lhr;
    const score = (id: string) => Math.round((categories[id]?.score ?? 0) * 100);
    const value = (id: string) => audits[id]?.numericValue ?? Number.NaN;
    return {
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
      lcp: Math.round(value('largest-contentful-paint')),
      tbt: Math.round(value('total-blocking-time')),
      speedIndex: Math.round(value('speed-index')),
      cls: Number(value('cumulative-layout-shift').toFixed(3)),
      kb: Math.round(value('total-byte-weight') / 1024),
    };
  } finally {
    await chrome.kill();
  }
}

async function main(): Promise<void> {
  if (!existsSync(join(DIST, 'index.html'))) throw new Error('dist/ has no build: run `npm run build` first.');
  const server = await serveDist();
  const { port } = server.address() as AddressInfo;
  const measured: LighthouseBaseline = {};
  const allRuns: Record<string, LighthouseNumbers[]> = {};
  try {
    for (const page of PAGES) {
      const runs: LighthouseNumbers[] = [];
      for (let run = 0; run < RUNS; run++) runs.push(await measure(`http://localhost:${port}${BASE}${page.path}`, page.config));
      allRuns[page.name] = runs;
      measured[page.name] = medianNumbers(runs);
      console.log(`${page.name}: ${JSON.stringify(measured[page.name])}`);
      console.log(`  runs: lcp ${runs.map((r) => r.lcp).join('/')}, tbt ${runs.map((r) => r.tbt).join('/')}, performance ${runs.map((r) => r.performance).join('/')}`);
    }
  } finally {
    server.close();
  }
  mkdirSync(join(ROOT, 'tmp', 'verify'), { recursive: true });
  writeFileSync(REPORT, `${JSON.stringify({ platform: process.platform, measured, runs: allRuns }, null, 2)}\n`);

  if (isUpdateRun()) {
    writeFileSync(BASELINE_FILE, `${JSON.stringify(measured, null, 2)}\n`);
    console.log(`Recorded ${BASELINE_FILE}`);
    return;
  }
  if (!existsSync(BASELINE_FILE)) {
    console.log(`Lighthouse: no ${process.platform} numbers recorded yet, so nothing was compared.`);
    return;
  }
  const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) as LighthouseBaseline;
  const problems = Object.entries(measured).flatMap(([name, numbers]) => {
    const base = baseline[name];
    return base ? overBudget(name, numbers, base) : [`${name}: no recorded numbers`];
  });
  if (problems.length > 0) {
    console.error(`Lighthouse budget exceeded:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log('Lighthouse budget: within limits');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
