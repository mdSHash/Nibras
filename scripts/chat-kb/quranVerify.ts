/**
 * Verifies Qur'anic text in Nibras against the Tanzil Qur'an text
 * (scripts/data/tanzil, © Tanzil Project, CC BY 3.0, distributed unchanged).
 *
 * Two checks:
 *  1. quranData.json entries must equal the Tanzil Uthmani verses exactly in
 *     letters and vowel marks. Only edition-level annotation marks (small
 *     pause/pronunciation signs, U+06D6–U+06ED) and tatweel are ignored, and
 *     the two Unicode encodings of hamza-on-kursi are treated as one.
 *  2. Inline quotes written in ordinary script (﴿…﴾ spans, reference
 *     snippets) must appear in a verse letter-for-letter, and any vowel mark
 *     they carry must agree with the verse — missing marks are tolerated
 *     (partial vocalization), different marks are not.
 */
import fs from 'fs';

export type VerseMap = Map<string, string>;

export function loadTanzil(filePath: string): VerseMap {
  const verses: VerseMap = new Map();
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const match = /^(\d+)\|(\d+)\|(.*)$/.exec(line.replace(/\r$/, ''));
    if (match) verses.set(`${match[1]}:${match[2]}`, match[3]);
  }
  return verses;
}

const ANNOTATION_MARKS = /[ـۖ-ۭ]/g;
const HARAKAT = /[ً-ْٰ]/;
const ARABIC_LETTER = /[ء-غف-يٱ]/;

function toArabicIndic(n: number): string {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function canonicalUthmani(text: string): string {
  return text
    .normalize('NFC')
    .replace(ANNOTATION_MARKS, '')
    .replace(/َٔ/g, 'ءَ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripBasmala(verseOne: string): string {
  const words = verseOne.split(' ');
  const firstFour = words.slice(0, 4).join(' ').replace(/[ً-ٰٟـ]/g, '').replace(/ٱ/g, 'ا');
  return firstFour === 'بسم الله الرحمن الرحيم' ? words.slice(4).join(' ') : verseOne;
}

export interface QuranEntry {
  text: string;
  surahNum: number;
  start: number;
  end: number;
}

/** The exact text a quranData.json entry must have, built from Tanzil. */
export function expectedEntryText(entry: QuranEntry, uthmani: VerseMap): string | null {
  const parts: string[] = [];
  for (let ayah = entry.start; ayah <= entry.end; ayah++) {
    let verse = uthmani.get(`${entry.surahNum}:${ayah}`);
    if (verse === undefined) return null;
    // Tanzil prefixes verse 1 with the basmala; it is not part of the ayah
    // except in Al-Fatiha (and At-Tawbah has none).
    if (ayah === 1 && entry.surahNum !== 1 && entry.surahNum !== 9) verse = stripBasmala(verse);
    parts.push(`${verse} ﴿${toArabicIndic(ayah)}﴾`);
  }
  return parts.join(' ');
}

export function verifyQuranEntry(entry: QuranEntry, uthmani: VerseMap): { ok: boolean; detail?: string } {
  const expected = expectedEntryText(entry, uthmani);
  if (expected === null) return { ok: false, detail: 'verse range not found in Tanzil' };
  const a = canonicalUthmani(expected);
  const b = canonicalUthmani(entry.text);
  if (a === b) return { ok: true };
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return { ok: false, detail: `differs at char ${i}: expected «${a.slice(Math.max(0, i - 10), i + 10)}» got «${b.slice(Math.max(0, i - 10), i + 10)}»` };
}

// ─── Inline quote verification (ordinary script) ────────────────────────────

interface Letter {
  base: string;
  marks: string;
}

function foldBase(ch: string): string {
  if ('آأإٱا'.includes(ch)) return 'ا';
  if (ch === 'ى') return 'ي';
  if (ch === 'ة') return 'ه';
  if (ch === 'ؤ') return 'و';
  if (ch === 'ئ') return 'ي';
  return ch;
}

function toLetters(text: string): Letter[] {
  const letters: Letter[] = [];
  for (const ch of text.normalize('NFC')) {
    if (ARABIC_LETTER.test(ch)) letters.push({ base: foldBase(ch), marks: '' });
    else if (HARAKAT.test(ch) && letters.length > 0) letters[letters.length - 1].marks += ch;
  }
  return letters;
}

interface SurahIndex {
  surah: number;
  letters: Letter[];
  bases: string;
  ayahAt: number[];
}

export function buildSurahIndex(simple: VerseMap): SurahIndex[] {
  const bySurah = new Map<number, SurahIndex>();
  for (const [key, text] of simple) {
    const [surah, ayah] = key.split(':').map(Number);
    const entry = bySurah.get(surah) ?? { surah, letters: [], bases: '', ayahAt: [] };
    for (const letter of toLetters(text)) {
      entry.letters.push(letter);
      entry.ayahAt.push(ayah);
    }
    bySurah.set(surah, entry);
  }
  for (const entry of bySurah.values()) entry.bases = entry.letters.map(l => l.base).join('');
  return [...bySurah.values()];
}

const SUKUN = 'ْ';
const FATHATAN = 'ً';

function marksAgree(quote: Letter[], verse: Letter[], offset: number): string | null {
  for (let i = 0; i < quote.length; i++) {
    const q = quote[i].marks;
    const v = verse[offset + i].marks;
    const isLast = i === quote.length - 1;
    for (const mark of q) {
      if (v.includes(mark)) continue;
      if (isLast && mark === SUKUN) continue; // pausal ending
      // Sukun marks "no vowel". Tanzil's script leaves noon sakinah unmarked
      // before ikhfa/idgham letters, where ordinary spelling writes مِنْ.
      if (mark === SUKUN && !HARAKAT.test(v)) continue;
      // Tanween fath written on the alef (لَيْلاً) instead of before it (لَيْلًا).
      if (mark === FATHATAN && quote[i].base === 'ا' && i > 0 && verse[offset + i - 1].marks.includes(FATHATAN)) continue;
      return `vowel mismatch at letter ${i + 1} (${quote[i].base}): quote has U+${mark.charCodeAt(0).toString(16)}, verse has «${v}»`;
    }
  }
  return null;
}

export interface QuoteVerdict {
  ok: boolean;
  surah?: number;
  ayah?: number;
  detail?: string;
}

const MIN_LETTERS = 6;

/** Verifies one quote segment; ellipses split a quote into ordered segments. */
export function verifyInlineQuote(quote: string, index: SurahIndex[]): QuoteVerdict {
  const segments = quote
    .split(/\.{2,}|…/)
    .map(s => s.trim())
    .filter(s => toLetters(s).length > 0);
  if (segments.length === 0) return { ok: false, detail: 'empty quote' };

  let firstHit: QuoteVerdict | null = null;
  for (const segment of segments) {
    const letters = toLetters(segment);
    if (letters.length < MIN_LETTERS) continue;
    const bases = letters.map(l => l.base).join('');
    let lastProblem = 'letters not found in any verse';
    let matched = false;
    for (const surah of index) {
      let at = surah.bases.indexOf(bases);
      while (at !== -1) {
        const problem = marksAgree(letters, surah.letters, at);
        if (!problem) {
          matched = true;
          firstHit ??= { ok: true, surah: surah.surah, ayah: surah.ayahAt[at] };
          break;
        }
        lastProblem = `${problem} (سورة ${surah.surah}:${surah.ayahAt[at]})`;
        at = surah.bases.indexOf(bases, at + 1);
      }
      if (matched) break;
    }
    if (!matched) return { ok: false, detail: `«${segment}»: ${lastProblem}` };
  }
  return firstHit ?? { ok: false, detail: 'quote too short to verify' };
}
