/**
 * Applies docs/territories/date-changes.json to content/events, touching only the date block, and
 * checks every quote against its Shamela page (cached by checkLedger.ts). Safe to run twice.
 * Usage: npx tsx scripts/territories/applyDateChanges.ts [--check]
 */
import fs from 'node:fs';
import path from 'node:path';

const BOOKS: Record<string, string> = { futuh: '12221', sira: '23833', tabari: '9783', bidaya: '4445', khalifa: '6615' };
interface Change { id: string; label?: string; hijri?: number; key?: number; cite: { b: string; p: number; q: string }[] }
const strip = (s: string): string => s.replace(/[ً-ْٰ]/g, '').replace(/\s+/g, ' ');

const changes = JSON.parse(fs.readFileSync('docs/territories/date-changes.json', 'utf8')) as Change[];
const bad: string[] = [];
let quotes = 0;
for (const c of changes) {
  for (const { b, p, q } of c.cite) {
    quotes++;
    const file = path.join('tmp/territories-research/cache', BOOKS[b] ?? b, `${p}.txt`);
    if (!fs.existsSync(file)) bad.push(`${c.id}: ${b} page ${p} is not cached`);
    else if (!strip(fs.readFileSync(file, 'utf8')).includes(strip(q))) bad.push(`${c.id}: ${b} page ${p} lacks «${q}»`);
  }
  const name = fs.readdirSync('content/events').find(f => f.startsWith(c.id));
  if (!name) { bad.push(`${c.id}: no such event`); continue; }
  if (process.argv.includes('--check')) continue;
  const file = path.join('content/events', name);
  let raw = fs.readFileSync(file, 'utf8');
  if (c.key !== undefined) {
    raw = raw.replace(/("sortKey": )[-\d.]+/, `$1${c.key}`);
    raw = raw.replace(/("gregorian": \{\s*"year": )\d+/, `$1${Math.floor(c.key)}`);
    raw = raw.replace(/\s*"tieOrder": \d+,/, '');
  }
  if (c.label) raw = raw.replace(/("labelAr": )"[^"]*"(\s*\},\s*"location")/, `$1"${c.label}"$2`);
  if (c.hijri !== undefined) raw = raw.replace(/("hijri": \{\s*"year": )-?\d+/, `$1${c.hijri}`);
  fs.writeFileSync(file, raw);
}
console.log(`${changes.length} changes, ${quotes} quotes checked`);
if (bad.length) { console.log(bad.join('\n')); process.exitCode = 1; }
