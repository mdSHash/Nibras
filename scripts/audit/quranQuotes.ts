/**
 * Phase 4 audit: every Qur'an quote written inside an event's text ({…} or ﴿…﴾ in the title, summary,
 * full description and course of events) must appear in a verse letter for letter, with any vowel
 * mark it carries agreeing with the verse (scripts/chat-kb/quranVerify.ts, the chat KB's rule).
 * Reports only; changes nothing.
 *
 *   npx tsx scripts/audit/quranQuotes.ts [eraId ...]     e.g. meccan medinan (default: all eras)
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildSurahIndex, loadTanzil, verifyInlineQuote } from '../chat-kb/quranVerify';

const dir = 'scripts/data/tanzil';
const index = [...buildSurahIndex(loadTanzil(path.join(dir, 'quran-simple.txt'))), ...buildSurahIndex(loadTanzil(path.join(dir, 'quran-uthmani.txt')))];
const eras = new Set(process.argv.slice(2));

interface EventFile { id: string; eraId: string; title: string; summary: string; fullDescription: string; courseOfEvents?: string[] }

let quotes = 0;
let bad = 0;
for (const f of fs.readdirSync('content/events').sort()) {
  const e = JSON.parse(fs.readFileSync(path.join('content/events', f), 'utf8')) as EventFile;
  if (eras.size && !eras.has(e.eraId)) continue;
  const fields: [string, string][] = [['title', e.title], ['summary', e.summary], ['fullDescription', e.fullDescription], ...(e.courseOfEvents ?? []).map((c, i): [string, string] => [`courseOfEvents[${i}]`, c])];
  for (const [field, text] of fields) {
    for (const m of text.matchAll(/\{([^}]*)\}|﴿([^﴾]*)﴾/g)) {
      const quote = m[1] ?? m[2];
      if (/^[\s\d٠-٩]*$/.test(quote)) continue;
      quotes++;
      const v = verifyInlineQuote(quote, index);
      if (v.ok) console.log(`ok   ${e.id} ${field}: ${v.surah}:${v.ayah}`);
      else { bad++; console.log(`FAIL ${e.id} ${field}: ${v.detail}`); }
    }
  }
}
console.log(`${quotes} quotes, ${bad} not matching a verse`);
