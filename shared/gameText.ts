/**
 * Text helpers for the daily challenge's data build (Phase 5): Hijri years from
 * date labels, and hiding the answer's name inside a clue. Pure functions, used
 * by scripts/game/ and its tests.
 */
import { stripDiacritics, toLatinDigits } from './arabic.js';

/** Hiding mark that replaces the answer's name in a clue. */
export const MASK = 'ـــ';

export interface HijriYear {
  /** Negative before the Hijra; there is no year 0. */
  year: number;
  /** The label gives another opinion («وقيل»). */
  disputed: boolean;
}

/**
 * The first Hijri year in a label such as «17 رمضان، 2 هـ», «نحو 13 ق.هـ» or
 * «31 هـ (وقيل 32 هـ)». Returns null when the label has no Hijri year.
 */
export function parseHijriYear(label: string): HijriYear | null {
  const text = toLatinDigits(stripDiacritics(label));
  const disputed = text.includes('وقيل');
  const match = /(\d+)\s*(ق\s*\.?\s*)?ه/.exec(text);
  if (!match) return null;
  const n = Number(match[1]);
  if (n === 0) return null;
  return { year: match[2] ? -n : n, disputed };
}

/** Years between two Hijri years, skipping the missing year 0. */
export function yearDiff(a: number, b: number): number {
  const index = (y: number): number => (y < 0 ? y + 1 : y);
  return index(a) - index(b);
}

/** Folds a string for name matching: no marks or tatweel, one alef, ة→ه, ى→ي. */
export function foldForMatch(text: string): string {
  return stripDiacritics(text)
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

const MARKS = '[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]*';

function letterPattern(ch: string): string {
  if ('اأإآٱ'.includes(ch)) return '[اأإآٱ]';
  if ('هة'.includes(ch)) return '[هة]';
  if ('يى'.includes(ch)) return '[يى]';
  return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** A regex matching `term` whatever its vowel marks, tatweel or letter variants. */
function termPattern(term: string): RegExp {
  const letters = [...foldForMatch(term)].map((ch) => (ch === ' ' ? '\\s+' : letterPattern(ch) + MARKS));
  // Whole words only: not preceded or followed by another Arabic letter, except
  // the one-letter prefixes و ف ب ل ك and the article.
  // Prefixes: و/ف, then ب/ك/ل, then the article (or لل), each with its marks.
  const prefix = `(?:[وف]${MARKS})?(?:لل${MARKS}|(?:[بكل]${MARKS})?(?:ال${MARKS})?)`;
  return new RegExp(`((?:^|[^\\u0621-\\u064A\\u064B-\\u065F\\u0670\\u0640])${prefix})(${letters.join('')})(?![\\u0621-\\u064A])`, 'g');
}

/** Replaces every term (longest first) in `text` with the mask. */
export function maskTerms(text: string, terms: Iterable<string>): string {
  const all = [...terms].map((t) => t.trim());
  // «القبلة» also hides «قبلة»: the article is often dropped in running text.
  for (const t of [...all]) if (!t.includes(' ') && /^ال/.test(foldForMatch(t)) && foldForMatch(t).length > 4) all.push(stripDiacritics(t).slice(2));
  const sorted = [...new Set(all.filter((t) => foldForMatch(t).length >= 3))].sort(
    (a, b) => foldForMatch(b).length - foldForMatch(a).length,
  );
  let out = text;
  for (const term of sorted) out = out.replace(termPattern(term), (_m, before: string) => `${before}${MASK}`);
  return out;
}

/** Words that never identify an answer on their own. */
const STOPWORDS = new Set(
  (
    'غزوه معركه موقعه سريه فتح يوم وقعه حصار الكبري الصغري بن بنت ابو ابي ابن رضي الله عنه عنها عنهما ' +
    'في من الي و عن ذات علي عبد'
  ).split(' '),
);

/** Distinctive tokens of a name or title, folded (the article dropped from long words). */
export function nameTokens(text: string): string[] {
  const folded = foldForMatch(text).replace(/[()[\]،,:«»\-.]/g, ' ');
  const out: string[] = [];
  for (let word of folded.split(/\s+/)) {
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    if (word.startsWith('ال') && word.length > 4) word = word.slice(2);
    if (!STOPWORDS.has(word)) out.push(word);
  }
  return out;
}

/** Arabic letters left in a clue once the mask and marks are removed. */
export function letterCount(clue: string): number {
  return stripDiacritics(clue.replaceAll(MASK, '')).replace(/[^ء-ي]/g, '').length;
}

export type LeakReason = 'too-short' | 'name' | null;

/** Why a masked clue cannot be shown, or null when it is safe. */
export function clueLeak(clue: string, keys: readonly string[], minLetters = 12): LeakReason {
  if (letterCount(clue) < minLetters) return 'too-short';
  const tokens = new Set(nameTokens(clue));
  return keys.some((k) => k.length >= 3 && tokens.has(k)) ? 'name' : null;
}

/** Splits a paragraph into sentences at . ! ؟ (keeping the mark). */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!؟])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * True when `phrase` occurs in `text` as whole words (a leading و ف ب ل allowed),
 * ignoring marks and letter variants: «صفين» matches «بصفين» but not «الصفين».
 */
export function hasPhrase(text: string, phrase: string): boolean {
  const words = foldForMatch(text).replace(/[^ء-ي\s]/g, ' ').split(/\s+/);
  const target = foldForMatch(phrase).split(/\s+/);
  for (let i = 0; i + target.length <= words.length; i++) {
    if (target.every((w, j) => words[i + j] === w || (j === 0 && /^[وفبل]/.test(words[i]) && words[i].slice(1) === w))) return true;
  }
  return false;
}

/** True when `quote` appears in `source`, ignoring marks, tatweel and letter variants. */
export function containsQuote(source: string, quote: string): boolean {
  const norm = (s: string): string => foldForMatch(s).replace(/\s+/g, ' ').trim();
  return norm(source).includes(norm(quote));
}
