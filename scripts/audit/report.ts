/**
 * Phase 4 audit report: reads docs/audit/<era>/*.json, checks every quote, writes docs/audit/<era>.md.
 *
 *   npx tsx scripts/audit/report.ts prophetic          check, then write docs/audit/prophetic.md
 *   npx tsx scripts/audit/report.ts prophetic --check  check only (exit 1 on a failed quote)
 *
 * Checked: each finding's `current` text is in the record's field exactly as written (tashkeel
 * included); each Shamela quote is on its cached page (tmp/territories-research/cache, compared
 * without tashkeel, scripts/audit/shamela.ts); each al-Durar quote is in its cached search result.
 * A quote whose page is not cached fails: nothing is quoted from memory.
 */
import fs from 'node:fs';
import path from 'node:path';
import { BOOKS, CACHE, printedPage, strip } from './shamela';
import type { AuditFile, Cite, Finding } from './types';

const BOOK_NAMES: Record<string, string> = {
  sira: 'سيرة ابن هشام، ت. السقا والأبياري وشلبي (مصطفى البابي الحلبي)',
  raheeq: 'الرحيق المختوم، المباركفوري (دار الهلال)',
  zad: 'زاد المعاد، ابن القيم (مؤسسة الرسالة)',
  bidaya: 'البداية والنهاية، ابن كثير (دار هجر)',
  tabari: 'تاريخ الطبري (دار التراث)',
  isaba: 'الإصابة في تمييز الصحابة، ابن حجر (دار الكتب العلمية)',
};
const CONF: Record<Finding['confidence'], string> = { proven: 'ثابت', likely: 'راجح', uncertain: 'غير مؤكد' };

function recordField(record: string, field: string): string | null {
  const [kind, id] = record.split(':');
  const dir = { event: 'content/events', person: 'content/people', city: 'content/cities' }[kind];
  if (!dir) return null;
  const file = path.join(dir, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  let v: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const part of field.split('.')) {
    const m = part.match(/^(\w+)(?:\[(\d+)\])?$/);
    if (!m || v === null || typeof v !== 'object') return null;
    v = (v as Record<string, unknown>)[m[1]];
    if (m[2] !== undefined) v = Array.isArray(v) ? v[Number(m[2])] : undefined;
  }
  return typeof v === 'string' ? v : null;
}

function checkCite(c: Cite): { ok: boolean; printed?: string; why?: string } {
  if (c.b === 'dorar') {
    const file = path.join(CACHE, 'dorar', `${c.p}.txt`);
    if (!fs.existsSync(file)) return { ok: false, why: `al-Durar result ${c.p} not cached` };
    // The first line is the search itself (#QUERY …), so a quote cannot match its own query.
    const result = fs.readFileSync(file, 'utf8').split('\n').slice(1).join('\n');
    return strip(result).includes(strip(c.q)) ? { ok: true } : { ok: false, why: `al-Durar ${c.p} lacks «${c.q}»` };
  }
  const book = BOOKS[c.b];
  if (!book) return { ok: false, why: `unknown book ${c.b}` };
  const file = path.join(CACHE, book, `${c.p}.txt`);
  if (!fs.existsSync(file)) return { ok: false, why: `${c.b} page ${c.p} not cached` };
  const page = fs.readFileSync(file, 'utf8');
  return strip(page).includes(strip(c.q)) ? { ok: true, printed: printedPage(page) } : { ok: false, why: `${c.b} page ${c.p} lacks «${c.q}»` };
}

function citeLine(c: Cite, printed?: string): string {
  if (c.b === 'dorar') return `الدرر السنية (الموسوعة الحديثية)، بحث «${c.search ?? ''}»: ${c.who ?? ''}، ${c.where ?? ''}، حكمه: «${c.ruling ?? ''}». النص المطابق: «${c.q}»`;
  const url = `https://shamela.ws/book/${BOOKS[c.b]}/${c.p}`;
  return `${BOOK_NAMES[c.b] ?? c.b}، ${printed || `صفحة الشاملة ${c.p}`} ([الشاملة ${c.p}](${url})): «${c.q}»`;
}

function main(): void {
  const era = process.argv[2];
  const checkOnly = process.argv.includes('--check');
  const dir = path.join('docs/audit', era);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  const bad: string[] = [];
  const out: string[] = [];
  let findings = 0;
  let quotes = 0;
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as AuditFile;
    out.push(`\n## ${data.title}\n`);
    if (data.intro) out.push(`${data.intro}\n`);
    for (const rec of data.records) {
      out.push(`\n### ${rec.heading}\n`);
      if (!rec.findings.length) out.push(`- فُحِص، ولا ملاحظات. ${rec.checked ?? ''}`.trimEnd());
      else if (rec.checked) out.push(`- ما فُحص ووُجد صحيحًا: ${rec.checked}`);
      for (const c of rec.checkedCites ?? []) {
        quotes++;
        const r = checkCite(c);
        if (!r.ok) bad.push(`${rec.record} (checked): ${r.why}`);
        out.push(`  - ${citeLine(c, r.printed)}`);
      }
      for (const fd of rec.findings) {
        findings++;
        const cur = recordField(fd.record ?? rec.record, fd.field);
        if (cur === null) bad.push(`${fd.id}: no field ${fd.field} in ${fd.record ?? rec.record}`);
        else if (fd.kind !== 'إضافة' && (!fd.current || !cur.includes(fd.current))) bad.push(`${fd.id}: current text not found in ${fd.record ?? rec.record} ${fd.field}`);
        out.push(`\n**${fd.id}** · ${fd.kind} · \`${fd.field}\` · ${fd.narrated ? 'مسموع (يحتاج تسجيلًا جديدًا)' : 'غير مسموع'} · الدرجة: **${CONF[fd.confidence]}**\n`);
        out.push(fd.kind === 'إضافة' ? '- النص الحالي: (لا يذكره)' : `- النص الحالي: «${fd.current}»`);
        out.push(`- المقترح: ${fd.proposed}`);
        for (const c of fd.cites ?? []) {
          quotes++;
          const r = checkCite(c);
          if (!r.ok) bad.push(`${fd.id}: ${r.why}`);
          out.push(`- المصدر: ${citeLine(c, r.printed)}`);
        }
        if (fd.basis) out.push(`- الأساس: ${fd.basis}`);
        if (fd.note) out.push(`- ملاحظة: ${fd.note}`);
      }
    }
    if (data.outro) out.push(`\n${data.outro}\n`);
  }
  console.log(`${findings} findings, ${quotes} source quotes checked`);
  if (bad.length) {
    console.log(bad.join('\n'));
    process.exitCode = 1;
  }
  if (checkOnly || bad.length) return;
  const head = fs.readFileSync(path.join(dir, 'HEAD.md'), 'utf8');
  fs.writeFileSync(path.join('docs/audit', `${era}.md`), `${head.trimEnd()}\n${out.join('\n')}\n`);
  console.log(`wrote docs/audit/${era}.md`);
}

main();
