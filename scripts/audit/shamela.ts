/**
 * Shamela pages for the Phase 4 content audit, in the same cache as the 3F territory research
 * (tmp/territories-research/cache/<book id>/<page id>.txt, git-ignored). Each page is fetched once.
 *
 *   npx tsx scripts/audit/shamela.ts fetch <book> <from> <to>   download page ids from..to (1 s apart)
 *   npx tsx scripts/audit/shamela.ts grep <book> <phrase>        list cached pages holding the phrase
 *                                                               (compared without tashkeel)
 * <book> is a short name from BOOKS below or a Shamela book id.
 */
import fs from 'node:fs';
import path from 'node:path';

export const BOOKS: Record<string, string> = {
  sira: '23833', // سيرة ابن هشام، ت السقا ورفاقه
  raheeq: '9820', // الرحيق المختوم، دار الهلال
  zad: '21713', // زاد المعاد، مؤسسة الرسالة
  bidaya: '4445', // البداية والنهاية، دار هجر
  tabari: '9783', // تاريخ الطبري، دار التراث
  isaba: '9767', // الإصابة في تمييز الصحابة، دار الكتب العلمية
  usd: '1110', // أسد الغابة، ط العلمية
  istiab: '12288', // الاستيعاب، ت البجاوي
  kamil: '21712', // الكامل في التاريخ، ت تدمري
  tabaqat: '1686', // الطبقات الكبرى، ط العلمية
  khalifa: '6615', // تاريخ خليفة بن خياط
  futuhmisr: '11404', // فتوح مصر والمغرب، ابن عبد الحكم
  jamhara: '13658', // جمهرة رسائل العرب (ينقل فتوح الشام للأزدي)
  musannaf: '9944', // مصنف ابن أبي شيبة، ت الحوت
  ilam: '11496', // إعلام الموقعين، ط العلمية
  khitat: '11566', // المواعظ والاعتبار، المقريزي، ط العلمية
  awasim: '8314', // العواصم من القواصم، ابن العربي، ت محب الدين الخطيب، دار الجيل
  barzanji: '145435', // صحيح وضعيف تاريخ الطبري، ت محمد بن طاهر البرزنجي، دار ابن كثير
};

export const CACHE = 'tmp/territories-research/cache';

/** Tashkeel, tatweel and spacing removed, alef and ya forms unified, and the edition's footnote
 * numbers (Arabic-Indic digits, «أضاء ٦ لي») dropped: the form quotes are compared in. */
export const strip = (s: string): string =>
  s
    .replace(/[ً-ٰٟـ٠-٩]/g, '')
    .replace(/[،؛؟۔]/g, ' ')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[^؀-ۿ0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ');

export const bookId = (b: string): string => BOOKS[b] || b;

export async function pageFile(book: string, id: number): Promise<string> {
  const dir = path.join(CACHE, book);
  const file = path.join(dir, `${id}.txt`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`https://shamela.ws/book/${book}/${id}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Nibras research)' } });
    if (!res.ok) throw new Error(`book ${book} page ${id}: HTTP ${res.status}`);
    fs.mkdirSync(dir, { recursive: true });
    const html = await res.text();
    const title = (html.match(/<title>([^<]*)/) ?? ['', ''])[1].trim();
    const start = html.indexOf('nass');
    const text = html
      .slice(start < 0 ? 0 : start)
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ');
    fs.writeFileSync(file, `#TITLE ${title}\n${text}`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  return fs.readFileSync(file, 'utf8');
}

/** The printed volume and page from a cached page's title, e.g. «ج2 - ص263». */
export const printedPage = (page: string): string => (page.split('\n')[0].match(/(ج\d+ - )?ص\d+/) ?? [''])[0];

async function main(): Promise<void> {
  const [cmd, b, ...rest] = process.argv.slice(2);
  const book = bookId(b ?? '');
  if (cmd === 'fetch') {
    const [from, to] = rest.map(Number);
    let failed = 0;
    for (let id = from; id <= to; id++) {
      try {
        await pageFile(book, id);
      } catch (e) {
        failed++;
        console.log(String(e));
      }
    }
    console.log(`book ${book}: pages ${from}..${to} cached, ${failed} failed`);
  } else if (cmd === 'grep') {
    const q = strip(rest.join(' '));
    const dir = path.join(CACHE, book);
    const ids = fs.readdirSync(dir).filter((f) => /^\d+\.txt$/.test(f)).map((f) => Number(f.slice(0, -4))).sort((x, y) => x - y);
    for (const id of ids) {
      const page = fs.readFileSync(path.join(dir, `${id}.txt`), 'utf8');
      const s = strip(page);
      const at = s.indexOf(q);
      if (at >= 0) console.log(`${id}\t${printedPage(page)}\t…${s.slice(Math.max(0, at - 80), at + q.length + 80)}…`);
    }
  } else if (cmd === 'find') {
    // find <file>: one query per line, «label|book|phrase»; up to 3 hits each.
    const pages = new Map<string, { id: number; title: string; s: string }[]>();
    const load = (bk: string) => {
      if (!pages.has(bk)) {
        const dir = path.join(CACHE, bk);
        const ids = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d+\.txt$/.test(f)).map((f) => Number(f.slice(0, -4))).sort((x, y) => x - y) : [];
        pages.set(bk, ids.map((id) => { const t = fs.readFileSync(path.join(dir, `${id}.txt`), 'utf8'); return { id, title: printedPage(t), s: strip(t) }; }));
      }
      return pages.get(bk)!;
    };
    for (const line of fs.readFileSync(b, 'utf8').split('\n').filter((l) => l.includes('|'))) {
      const [label, bk, ...ph] = line.split('|');
      const q = strip(ph.join('|')).trim();
      const hits = load(bookId(bk.trim())).filter((p) => p.s.includes(q)).slice(0, 3);
      console.log(`== ${label.trim()} [${bk.trim()}] «${q}»: ${hits.length ? '' : 'NOT FOUND'}`);
      for (const h of hits) { const at = h.s.indexOf(q); console.log(`   ${h.id}\t${h.title}\t…${h.s.slice(Math.max(0, at - 70), at + q.length + 70)}…`); }
    }
  } else {
    console.log('usage: shamela.ts fetch <book> <from> <to> | grep <book> <phrase> | find <queries file>');
    process.exitCode = 1;
  }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/audit/shamela.ts')) void main();
