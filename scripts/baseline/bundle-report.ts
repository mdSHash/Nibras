// Bundle numbers and budget (baseline part 5). Reads the production build in
// dist/ and compares each chunk with tests/baseline/numbers.json.
//
// Budget: a chunk's gzip size may grow at most 2% (plus 512 bytes for tiny
// chunks) and total JS gzip at most 1% over the baseline. Shrinking always
// passes and is reported, so later phases can show their improvement.
//
// Content loaded on demand (dist/assets/content/, Phase 2B) is not code: it is
// reported by group (one line for the event details, one for the bios, …) and
// left out of the code budget. "JS at start" is what the page loads before the
// app renders: the entry script and the chunks index.html preloads.
//
//   npx tsx scripts/baseline/bundle-report.ts            check the budget
//   npx tsx scripts/baseline/bundle-report.ts --update   record the current build (only after approval)
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { BASELINE_DIR, ROOT, isUpdateRun } from './lib';

const DIST = join(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');
const CONTENT = join(ASSETS, 'content');
const NUMBERS_FILE = join(BASELINE_DIR, 'numbers.json');
const CHUNK_GROWTH = 0.02;
const CHUNK_SLACK_BYTES = 512;
const TOTAL_JS_GROWTH = 0.01;

interface Chunk {
  raw: number;
  gzip: number;
}
interface ContentGroup extends Chunk {
  files: number;
}
interface BundleNumbers {
  chunks: Record<string, Chunk>;
  totals: { js: Chunk; css: Chunk };
  /** On-demand content by group (Phase 2B on). */
  content?: Record<string, ContentGroup>;
  /** JS loaded before the app renders (Phase 2B on). */
  start?: Chunk;
}
export interface Numbers {
  bundle?: BundleNumbers;
  tests?: Record<string, unknown>;
}

// "index-CglKSMVo.js" → "index.js". Vite hashes are 8 base64url characters.
const stripHash = (file: string): string => file.replace(/-[A-Za-z0-9_-]{8}(\.(?:js|css))$/, '$1');

export function readNumbers(): Numbers {
  return existsSync(NUMBERS_FILE) ? (JSON.parse(readFileSync(NUMBERS_FILE, 'utf8')) as Numbers) : {};
}
export function writeNumbers(numbers: Numbers): void {
  writeFileSync(NUMBERS_FILE, `${JSON.stringify(numbers, null, 2)}\n`);
}

function measure(): BundleNumbers {
  if (!existsSync(ASSETS)) throw new Error('dist/assets is missing: run the production build first.');
  const files = readdirSync(ASSETS).filter((f) => f.endsWith('.js') || f.endsWith('.css'));
  const sized = files.map((file) => {
    const data = readFileSync(join(ASSETS, file));
    return { name: stripHash(file), raw: data.length, gzip: gzipSync(data).length };
  });
  // Two chunks can share a name once the hash is gone; number them by size.
  sized.sort((a, b) => a.name.localeCompare(b.name) || b.raw - a.raw);
  const chunks: Record<string, Chunk> = {};
  for (const { name, raw, gzip } of sized) {
    let key = name;
    for (let n = 2; key in chunks; n++) key = name.replace(/(\.\w+)$/, `#${n}$1`);
    chunks[key] = { raw, gzip };
  }
  const total = (ext: string): Chunk =>
    Object.entries(chunks)
      .filter(([name]) => name.endsWith(ext))
      .reduce((sum, [, c]) => ({ raw: sum.raw + c.raw, gzip: sum.gzip + c.gzip }), { raw: 0, gzip: 0 });
  return { chunks, totals: { js: total('.js'), css: total('.css') }, content: measureContent(), start: measureStart() };
}

const sizeOf = (file: string): Chunk => {
  const data = readFileSync(file);
  return { raw: data.length, gzip: gzipSync(data).length };
};

// assets/content/eventDetails/*.js → "eventDetails"; assets/content/searchIndex-<hash>.js → "searchIndex".
function measureContent(): Record<string, ContentGroup> {
  const groups: Record<string, ContentGroup> = {};
  const add = (group: string, file: string): void => {
    const { raw, gzip } = sizeOf(file);
    const g = (groups[group] ??= { files: 0, raw: 0, gzip: 0 });
    g.files += 1;
    g.raw += raw;
    g.gzip += gzip;
  };
  if (!existsSync(CONTENT)) return groups;
  for (const entry of readdirSync(CONTENT).sort()) {
    const path = join(CONTENT, entry);
    if (statSync(path).isDirectory()) {
      for (const file of readdirSync(path)) if (file.endsWith('.js')) add(entry, join(path, file));
    } else if (entry.endsWith('.js')) {
      add(stripHash(entry).replace(/\.js$/, ''), path);
    }
  }
  return groups;
}

function measureStart(): Chunk {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<(?:script[^>]*\bsrc|link[^>]*rel="modulepreload"[^>]*\bhref)="[^"]*\/assets\/([^"]+\.js)"/g)].map((m) => m[1]);
  return files.reduce(
    (sum, file) => {
      const { raw, gzip } = sizeOf(join(ASSETS, file));
      return { raw: sum.raw + raw, gzip: sum.gzip + gzip };
    },
    { raw: 0, gzip: 0 },
  );
}

const kb = (bytes: number): string => `${(bytes / 1024).toFixed(1)} KB`;
const pct = (now: number, before: number): string => `${now >= before ? '+' : ''}${(((now - before) / before) * 100).toFixed(1)}%`;

function main(): void {
  const current = measure();
  const numbers = readNumbers();
  if (isUpdateRun()) {
    writeNumbers({ ...numbers, bundle: current });
    console.log(`Recorded ${Object.keys(current.chunks).length} chunks in tests/baseline/numbers.json`);
    console.log(`JS ${kb(current.totals.js.raw)} (${kb(current.totals.js.gzip)} gzip), CSS ${kb(current.totals.css.raw)} (${kb(current.totals.css.gzip)} gzip)`);
    return;
  }
  const baseline = numbers.bundle;
  if (!baseline) {
    console.error('tests/baseline/numbers.json has no bundle numbers. Run with --update once, on approved code.');
    process.exit(1);
  }
  const problems: string[] = [];
  const notes: string[] = [];
  for (const [name, now] of Object.entries(current.chunks)) {
    const before = baseline.chunks[name];
    if (!before) {
      notes.push(`new chunk ${name}: ${kb(now.gzip)} gzip`);
      continue;
    }
    if (now.gzip > before.gzip * (1 + CHUNK_GROWTH) + CHUNK_SLACK_BYTES) {
      problems.push(`${name}: ${kb(before.gzip)} → ${kb(now.gzip)} gzip (${pct(now.gzip, before.gzip)}), over the 2% budget`);
    } else if (now.gzip !== before.gzip) {
      notes.push(`${name}: ${kb(before.gzip)} → ${kb(now.gzip)} gzip (${pct(now.gzip, before.gzip)})`);
    }
  }
  for (const name of Object.keys(baseline.chunks)) {
    if (!(name in current.chunks)) notes.push(`chunk ${name} is gone`);
  }
  const js = current.totals.js.gzip;
  const jsBefore = baseline.totals.js.gzip;
  if (js > jsBefore * (1 + TOTAL_JS_GROWTH)) {
    problems.push(`total JS: ${kb(jsBefore)} → ${kb(js)} gzip (${pct(js, jsBefore)}), over the 1% budget`);
  }
  console.log(`Total JS ${kb(current.totals.js.raw)} (${kb(js)} gzip, ${pct(js, jsBefore)} vs baseline); CSS ${kb(current.totals.css.gzip)} gzip`);
  const start = current.start!;
  const startBefore = baseline.start ?? baseline.chunks['index.js'];
  console.log(`JS at start ${kb(start.raw)} (${kb(start.gzip)} gzip; baseline ${kb(startBefore.raw)}, ${kb(startBefore.gzip)} gzip)`);
  for (const [group, g] of Object.entries(current.content ?? {})) {
    console.log(`  content ${group}: ${g.files} file(s), ${kb(g.raw)} (${kb(g.gzip)} gzip)`);
  }
  for (const note of notes) console.log(`  ${note}`);
  if (problems.length > 0) {
    console.error('Bundle budget exceeded:');
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log('Bundle budget: within limits');
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('bundle-report.ts')) main();
