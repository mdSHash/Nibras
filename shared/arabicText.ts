/**
 * Arabic text primitives for the chat assistant: normalization, tokenization,
 * stopwords and light stemming. Shared by the offline knowledge-base builder,
 * the runtime search, and the answer validator so all three agree exactly on
 * what counts as "the same word".
 *
 * Deliberately separate from shared/searchNormalize.ts (the app's search menu),
 * which does simple substring matching and has different needs.
 */

// Harakat, tanween, shadda, sukun, superscript (dagger) alef, and the small
// Qur'anic annotation marks used by the Uthmani script (U+06D6–U+06ED).
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭ]/g;
const TATWEEL = /ـ/g;

export function toLatinDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06f0));
}

/** Removes vowel marks and Qur'anic annotation marks, keeping letters intact. */
export function stripDiacritics(input: string): string {
  return input.replace(DIACRITICS, '').replace(TATWEEL, '');
}

/** Folds alef variants only — keeps ى distinct from ي (see foldLetters). */
function foldAlef(input: string): string {
  return input.replace(/[آأإٱٲٳ]/g, 'ا');
}

/**
 * Full letter folding for matching: alef variants, alef maksura, teh marbuta,
 * hamza carriers, and Persian look-alike letters.
 */
export function foldLetters(input: string): string {
  return foldAlef(input)
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ی/g, 'ي')
    .replace(/ک/g, 'ك');
}

const NON_WORD = /[^ء-ي0-9a-z]+/g;

/** Canonical comparable form of a whole string (no stemming). */
export function normalizeForMatch(input: string): string {
  if (!input) return '';
  return foldLetters(stripDiacritics(toLatinDigits(input)))
    .toLowerCase()
    .replace(NON_WORD, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Stopwords, written in "alef-folded but ى-preserved" form so that the
 * preposition على is dropped while the name علي is kept.
 */
const STOPWORDS = new Set(
  [
    'من', 'ما', 'ماذا', 'متى', 'اين', 'كيف', 'كم', 'هل', 'لماذا', 'لم', 'لن', 'لا', 'ان', 'انه', 'انها',
    'هو', 'هي', 'هم', 'هن', 'هما', 'انا', 'نحن', 'انت', 'انتم', 'هذا', 'هذه', 'ذلك', 'تلك', 'هؤلاء', 'اولئك',
    'في', 'على', 'عن', 'الى', 'الي', 'مع', 'او', 'ام', 'ثم', 'بل', 'قد', 'لقد', 'كان', 'كانت', 'كانوا',
    'يكون', 'تكون', 'الذي', 'التي', 'الذين', 'اللذان', 'اللتان', 'اللاتي', 'اللواتي', 'و', 'ف', 'ب', 'ل', 'ك',
    'بعض', 'كل', 'اي', 'اذا', 'اذ', 'حتى', 'عند', 'عندما', 'بين', 'حول', 'فيه', 'فيها', 'به', 'بها', 'له', 'لها',
    'منه', 'منها', 'عنه', 'عنها', 'اليه', 'اليها', 'عليه', 'عليها', 'هناك', 'هنا', 'ايضا', 'غير', 'سوى',
    'يا', 'اذكر', 'اخبرني', 'حدثني', 'اشرح', 'وضح', 'عرفني', 'اريد', 'اعرف', 'معلومات', 'تعرف', 'قل', 'لي',
  ].map(foldAlef)
);

/** Word tokens with digits unified and diacritics removed, ى preserved. */
function rawTokens(input: string): string[] {
  return foldAlef(stripDiacritics(toLatinDigits(input)))
    .toLowerCase()
    .replace(/[^ء-ي0-9a-z]+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

export function isStopword(rawToken: string): boolean {
  return STOPWORDS.has(foldAlef(rawToken));
}

// Light10 (Larkey et al.), mirroring Lucene's ArabicStemmer. Input must
// already be letter-folded (so ة has become ه).
const PREFIXES = ['وال', 'بال', 'كال', 'فال', 'لل', 'ال'];
const SUFFIXES = ['ها', 'ان', 'ات', 'ون', 'ين', 'يه', 'ه', 'ي'];

export function lightStem(foldedToken: string): string {
  if (/^[0-9a-z]+$/.test(foldedToken)) return foldedToken;
  let word = foldedToken;
  for (const prefix of PREFIXES) {
    if (word.startsWith(prefix) && word.length - prefix.length >= 2) {
      word = word.slice(prefix.length);
      break;
    }
  }
  if (word === foldedToken && word.startsWith('و') && word.length > 3) {
    word = word.slice(1);
  }
  for (const suffix of SUFFIXES) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 2) {
      word = word.slice(0, -suffix.length);
    }
  }
  return word;
}

/**
 * Light10 never strips the single-letter prepositions ب/ل/ك/ف, so "ببدر"
 * would not meet "بدر". Emitting a second, preposition-stripped stem (only
 * when at least three letters remain) recovers that match on both the
 * document and the query side without touching short roots like بكر or فتح.
 */
export function stemVariants(foldedToken: string): string[] {
  const primary = lightStem(foldedToken);
  if (foldedToken.length >= 4 && /^[بلكف]/.test(foldedToken)) {
    const alt = lightStem(foldedToken.slice(1));
    if (alt !== primary) return [primary, alt];
  }
  return [primary];
}

export interface TokenInfo {
  /** Diacritic-free surface form (alef-folded, ى preserved). */
  raw: string;
  /** Fully folded form without stemming. */
  folded: string;
  /** Light-stemmed search key. */
  stem: string;
  stopword: boolean;
  isNumber: boolean;
}

export function analyze(input: string): TokenInfo[] {
  return rawTokens(input).map(raw => {
    const folded = foldLetters(raw);
    return {
      raw,
      folded,
      stem: lightStem(folded),
      stopword: STOPWORDS.has(raw),
      isNumber: /^[0-9]+$/.test(raw),
    };
  });
}

/** Stem variants of the non-stopword tokens — the unit of keyword search. */
export function searchStems(input: string): string[] {
  return analyze(input)
    .filter(t => !t.stopword)
    .flatMap(t => stemVariants(t.folded));
}
