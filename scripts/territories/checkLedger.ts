/**
 * Checks docs/territories/ledger/*.json (Phase 3F): every region id exists, every event id exists,
 * and every quoted phrase is really on the Shamela page it cites. Pages are cached in
 * tmp/territories-research/cache and fetched once when missing. Not part of `npm run verify`:
 * it needs the network the first time. Usage: npx tsx scripts/territories/checkLedger.ts [--fix]
 * `p` is the site's page id. --fix moves a citation written with the printed page to its id, and
 * records the printed page from the page's title.
 */
import fs from 'node:fs';
import path from 'node:path';

const BOOKS: Record<string, string> = { futuh: '12221', sira: '23833', tabari: '9783', bidaya: '4445', khalifa: '6615', yaqut: '23735', bakri: '11802' };
const CACHE = 'tmp/territories-research/cache';
const LEDGER = 'docs/territories/ledger';

interface Cite { b: string; p: number; q: string; printed?: string }
interface Row { r: string | string[]; at: number; ev?: string; h: string; k: string; c: string; cite?: Cite[]; n?: string; name?: string }

const strip = (s: string): string => s.replace(/[ً-ْٰ]/g, '').replace(/\s+/g, ' ');

async function pageFile(book: string, id: number): Promise<string> {
  const dir = path.join(CACHE, book);
  const file = path.join(dir, `${id}.txt`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`https://shamela.ws/book/${book}/${id}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Nibras research)' } });
    if (!res.ok) throw new Error(`book ${book} page ${id}: HTTP ${res.status}`);
    fs.mkdirSync(dir, { recursive: true });
    const html = await res.text();
    const title = (html.match(/<title>([^<]*)/) ?? ['', ''])[1].trim();
    const start = html.indexOf('nass');
    const text = html.slice(start < 0 ? 0 : start).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
    fs.writeFileSync(file, `#TITLE ${title}\n${text}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  return fs.readFileSync(file, 'utf8');
}

async function main(): Promise<void> {
  const fix = process.argv.includes('--fix');
  const regions = new Set<string>((JSON.parse(fs.readFileSync('docs/territories/regions-draft.json', 'utf8')) as { regions: { id: string }[] }).regions.map(r => r.id));
  const events = new Set(fs.readdirSync('content/events').map(f => (JSON.parse(fs.readFileSync(path.join('content/events', f), 'utf8')) as { id: string }).id));
  const bad: string[] = [];
  const seen = new Set<string>();
  let quotes = 0;
  let rows = 0;
  for (const f of fs.readdirSync(LEDGER).sort()) {
    const fileRows = JSON.parse(fs.readFileSync(path.join(LEDGER, f), 'utf8')) as Row[];
    for (const row of fileRows) {
      rows++;
      for (const r of [row.r].flat()) {
        seen.add(r);
        if (!regions.has(r)) bad.push(`${f}: unknown region ${r}`);
      }
      if (row.ev && !events.has(row.ev)) bad.push(`${f}: unknown event ${row.ev}`);
      for (const c of row.cite ?? []) {
        quotes++;
        const book = BOOKS[c.b];
        if (!book) { bad.push(`${f}: unknown book ${c.b}`); continue; }
        let found: number | null = null;
        for (const id of fix ? [c.p, c.p - 3, c.p + 3] : [c.p]) {
          if (id > 0 && strip(await pageFile(book, id)).includes(strip(c.q))) { found = id; break; }
        }
        if (found === null) { bad.push(`${f}: ${c.b} page ${c.p} lacks «${c.q}»`); continue; }
        c.p = found;
        const title = (await pageFile(book, found)).split('\n')[0];
        c.printed = (title.match(/(ج\d+ - )?ص\d+/) ?? [''])[0];
      }
    }
    if (fix) fs.writeFileSync(path.join(LEDGER, f), `[\n${fileRows.map(x => JSON.stringify(x)).join(',\n')}\n]\n`);
  }
  for (const r of regions) if (!seen.has(r)) bad.push(`region ${r} has no row`);
  console.log(`${rows} rows, ${quotes} quotes checked against the page text`);
  if (bad.length) { console.log(bad.join('\n')); process.exitCode = 1; } else console.log('ledger ok');
}

void main();
