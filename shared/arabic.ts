/**
 * The one Arabic text module: every normalization the app, the chat assistant
 * and the scripts use lives here, as primitives and named variants.
 *
 * The variants differ on purpose or by history, and each keeps the exact
 * output of the code it replaced (Phase 1C), so search results, the chat
 * knowledge base and the content snapshot stay byte-identical. Known
 * inconsistencies between them are listed in docs/REFACTOR_PROGRESS.md
 * (Phase 1, "Arabic normalization: known differences") and pinned in
 * tests/arabic.test.ts; change one only as an approved behavior change.
 *
 * Named variants:
 * - normalizeForSearch / tokenizeQuery: the search menu and the chat question
 *   suggestions (simple substring matching).
 * - normalizeForMatch, analyze, searchStems: the chat assistant (knowledge-base
 *   builder, runtime search, answer validator), so all three agree exactly on
 *   what counts as "the same word"; with stopwords and light stemming.
 * - normalizeName: a person's name as written in a text, matched against the
 *   person's name, title and aliases (src/utils/peopleLookup.ts).
 * - plainText: text given to the chat model (no diacritics, same letters).
 * - bareText: titles and names inserted into chat template sentences.
 * - aliasForm: chat knowledge-base aliases (no vowel marks, honorifics or brackets).
 *
 * Not here on purpose: the Qur'an check in scripts/chat-kb/quranVerify.ts has
 * its own rules for comparing Uthmani text with Tanzil; the chat entity
 * linker's token variants (api/_lib/entityLinker.ts) are matching rules, not
 * normalization; the narration audio key (whitespace only) stays with the
 * audio scripts until the Phase 3 audio manifest.
 */

// Harakat, tanween, shadda, sukun, superscript (dagger) alef, and the small
// Qur'anic annotation marks used by the Uthmani script (U+06D6–U+06ED).
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭ]/g;
const TATWEEL = /ـ/g;
// Harakat, tanween, shadda, sukun, the marks up to U+065F and the dagger alef:
// the narrower set that display code strips. Tatweel is kept.
const VOWEL_MARKS = /[ً-ٰٟ]/g;

/**
 * Honorifics written after names, longest alternative first so that a shorter
 * one (عنهم) never matches a prefix of a longer one (عنهما).
 */
export const HONORIFICS: readonly string[] = [
  'رضي الله عنهما',
  'رضي الله عنهم',
  'رضي الله عنها',
  'رضي الله عنه',
  'رحمهم الله',
  'رحمها الله',
  'رحمه الله',
  'صلى الله عليه وسلم',
  'عليه السلام',
  'ﷺ',
];

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
const STOPWORDS = /* @__PURE__ */ new Set(
  [
    'من', 'ما', 'ماذا', 'متى', 'اين', 'كيف', 'كم', 'هل', 'لماذا', 'لم', 'لن', 'لا', 'ان', 'انه', 'انها',
    'هو', 'هي', 'هم', 'هن', 'هما', 'انا', 'نحن', 'انت', 'انتم', 'هذا', 'هذه', 'ذلك', 'تلك', 'هؤلاء', 'اولئك',
    'في', 'على', 'عن', 'الى', 'الي', 'مع', 'او', 'ام', 'ثم', 'بل', 'قد', 'لقد', 'كان', 'كانت', 'كانوا',
    'يكون', 'تكون', 'الذي', 'التي', 'الذين', 'اللذان', 'اللتان', 'اللاتي', 'اللواتي', 'و', 'ف', 'ب', 'ل', 'ك',
    'بعض', 'كل', 'اي', 'اذا', 'اذ', 'حتى', 'عند', 'عندما', 'بين', 'حول', 'فيه', 'فيها', 'به', 'بها', 'له', 'لها',
    'منه', 'منها', 'عنه', 'عنها', 'اليه', 'اليها', 'عليه', 'عليها', 'هناك', 'هنا', 'ايضا', 'غير', 'سوى',
    'يا', 'اذكر', 'اخبرني', 'حدثني', 'اشرح', 'وضح', 'عرفني', 'اريد', 'اعرف', 'معلومات', 'تعرف', 'قل', 'لي',
    // Egyptian colloquial question and function words. "إيه" (what) is kept
    // apart from "آية" (verse): only the teh-marbuta spelling اية means a verse.
    'مين', 'ايه', 'ايش', 'امتى', 'امتي', 'امتا', 'فين', 'منين', 'ليه', 'ازاي', 'ازاى', 'كام', 'اللي', 'ده', 'دي',
    'دا', 'دول', 'هما', 'همه', 'احنا', 'عشان', 'علشان', 'بتاع', 'بتاعة', 'بتاعت', 'طب', 'طيب', 'يعني', 'بقى',
    'بقي', 'برضه', 'برضو', 'اوي', 'قوي', 'خالص', 'حاجة', 'حاجه', 'حاجات', 'مش', 'مفيش', 'عايز', 'عاوز', 'عايزة',
    'عاوزة', 'عايزين', 'قولي', 'قوللي', 'احكيلي', 'احكي', 'فهمني', 'وريني', 'كده', 'كدا', 'زي', 'لسه', 'دلوقتي',
    'ايوه', 'كمان', 'بس', 'اصلا', 'ممكن', 'تقولي', 'تحكيلي', 'حضرتك', 'سيدنا', 'سيدتنا', 'السيدة',
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
      // "وإيه", "ومين", "فين" with an attached و/ف are still question words.
      stopword: STOPWORDS.has(raw) || (raw.length > 2 && /^[وف]/.test(raw) && STOPWORDS.has(raw.slice(1))),
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

/** Removes vowel marks (VOWEL_MARKS); letters, tatweel and spacing are kept. */
export function stripVowelMarks(input: string): string {
  return input.replace(VOWEL_MARKS, '');
}

/** Western digits → Arabic-Indic (٠١٢٣٤٥٦٧٨٩), as the app displays numbers and dates. */
export const toArabicIndic = (n: number | string): string => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// ---------------------------------------------------------------------------
// The search menu and the chat question suggestions.
// Strips diacritics (tashkeel), tatweel, and unifies visually-equivalent letter
// forms so a partial or unvocalized query (e.g. "معركه بدر") still matches the
// vocalized stored title (e.g. "مَعْرَكَةُ بَدْرٍ الْكُبْرَى").
export function normalizeForSearch(input: string): string {
  if (!input) return '';
  return input
    // Arabic-Indic digits (٣١٣) → Western (313). The data mixes both, and the
    // punctuation strip below would otherwise delete Arabic-Indic digits
    // entirely, since they fall outside the ء-ي letter range.
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    // Tashkeel (fatha/kasra/damma/shadda/sukun/tanwin), superscript alef, tatweel
    .replace(/[ً-ْٰـ]/g, '')
    // Alef variants → bare alef
    .replace(/[آأإٱ]/g, 'ا')
    // Teh marbuta → heh
    .replace(/ة/g, 'ه')
    // Alef maksura → yeh
    .replace(/ى/g, 'ي')
    // Hamza on yeh → yeh
    .replace(/ئ/g, 'ي')
    // Hamza on waw → waw
    .replace(/ؤ/g, 'و')
    // Strip punctuation (Arabic question mark/comma/semicolon, Latin
    // punctuation, etc.) so a trailing "؟" doesn't turn "بدر؟" into a token
    // that no longer matches the bare "بدر" stored in the corpus/haystack.
    .replace(/[^ء-ي0-9a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeForSearch(query);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}

// ---------------------------------------------------------------------------
// Person names (src/utils/peopleLookup.ts).

const NAME_HONORIFICS = /* @__PURE__ */ new RegExp(HONORIFICS.join('|'), 'g');

/**
 * A name as written in a text, compared with a person's name, title and aliases:
 * no vowel marks, honorifics, tatweel or letter-form variants.
 * Diacritics are stripped BEFORE honorifics are removed: a fully vocalized
 * "رَضِيَ اللهُ عَنْهُ" never matches the plain-letter pattern otherwise, which
 * left names like "عُثْمَانُ بْنُ عَفَّانَ رَضِيَ اللهُ عَنْهُ" unresolved.
 */
export function normalizeName(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[ً-ٰٟ]/g, '')
    .replace(NAME_HONORIFICS, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/ـ/g, '')
    .replace(/[ً-ٟ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Chat assistant text.

/** Diacritic-free text given to the model: fewer tokens, same letters. */
export function plainText(text: string): string {
  return stripDiacritics(text).replace(/\s+/g, ' ').trim();
}

/**
 * Titles and names inserted into template sentences are written without
 * vowel marks: the stored forms carry a nominative case ending that becomes
 * a grammatical error after "تاريخ" or "في" (تاريخ غَزْوَةُ أُحُدٍ).
 * Unvocalized text is correct in any position.
 */
export function bareText(title: string): string {
  return stripVowelMarks(title).replace(/\s+/g, ' ').trim();
}

const ALIAS_HONORIFICS = /* @__PURE__ */ new RegExp(String.raw`\s*(${HONORIFICS.join('|')})\s*`, 'g');

/** Plain alias form: no vowel marks or tatweel, no honorifics, no parentheses. */
export function aliasForm(name: string): string {
  return stripVowelMarks(name)
    .replace(TATWEEL, '')
    .replace(ALIAS_HONORIFICS, ' ')
    .replace(/[()«»"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
