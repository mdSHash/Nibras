/**
 * al-Durar al-Saniyya hadith search for the Phase 4 audit. Raw results are cached in
 * tmp/territories-research/cache/dorar/<label>.txt (first line: the search), which scripts/audit/report.ts
 * checks al-Durar quotes against.
 *
 *   npx tsx scripts/audit/dorar.ts <file>     one search per line, «label|text»; prints each hit:
 *                                              muhaddith | source and number | ruling | start of the text
 */
import fs from 'node:fs';
import path from 'node:path';
import { CACHE } from './shamela';

const dir = path.join(CACHE, 'dorar');

async function main(): Promise<void> {
  fs.mkdirSync(dir, { recursive: true });
  const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter((l) => l.includes('|'));
  for (const line of lines) {
    const [label, q] = line.split('|').map((s) => s.trim());
    const file = path.join(dir, `${label}.txt`);
    if (!fs.existsSync(file)) {
      const res = await fetch(`https://dorar.net/dorar_api.json?skey=${encodeURIComponent(q)}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Nibras research)' } });
      const j = (await res.json()) as { ahadith: { result: string } };
      fs.writeFileSync(file, `#QUERY ${q}\n${j.ahadith.result.replace(/<[^>]+>/g, ' ')}`);
      await new Promise((r) => setTimeout(r, 800));
    }
    console.log(`== ${label} «${q}»`);
    for (const block of fs.readFileSync(file, 'utf8').split('--------------').slice(0, 7)) {
      const h = block.replace(/\s+/g, ' ');
      const text = (h.match(/\d+ - (.{0,100})/) ?? ['', ''])[1];
      const who = (h.match(/المحدث: (.*?) المصدر:/) ?? ['', '?'])[1];
      const src = h.match(/المصدر: (.*?) الصفحة أو الرقم: (\S*)/) ?? ['', '?', ''];
      const ruling = (h.match(/خلاصة حكم المحدث: (.{0,80})/) ?? ['', '?'])[1];
      console.log(`   ${who} | ${src[1]} ${src[2]} | ${ruling.trim()} | ${text.trim()}`);
    }
  }
}

void main();
