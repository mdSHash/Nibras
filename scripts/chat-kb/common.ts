/**
 * Helpers shared by the knowledge-base unit builders.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import type { EntityRefs, KbUnit, UnitKind } from '../../shared/chatKb';
import { analyze } from '../../shared/arabicText';
import { buildSurahIndex, loadTanzil, verifyInlineQuote, type VerseMap } from './quranVerify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface BuildIssue {
  severity: 'error' | 'warning';
  source: string;
  message: string;
}

export class BuildContext {
  readonly issues: BuildIssue[] = [];
  readonly units: KbUnit[] = [];
  readonly uthmani: VerseMap;
  private readonly surahIndex: ReturnType<typeof buildSurahIndex>;
  /** Normalized text of every verified inline Qur'an quote. */
  readonly verifiedQuotes: string[] = [];

  constructor() {
    const dir = path.join(__dirname, '../data/tanzil');
    this.uthmani = loadTanzil(path.join(dir, 'quran-uthmani.txt'));
    this.surahIndex = [
      ...buildSurahIndex(loadTanzil(path.join(dir, 'quran-simple.txt'))),
      ...buildSurahIndex(this.uthmani),
    ];
  }

  issue(severity: BuildIssue['severity'], source: string, message: string) {
    this.issues.push({ severity, source, message });
  }

  /**
   * Returns false (and records why) if the text contains a ﴿…﴾ quote that
   * does not match the Qur'an exactly. Such text is kept out of the chat
   * knowledge base entirely rather than shown with a misquote in it.
   */
  quotesAreVerified(text: string, source: string): boolean {
    let ok = true;
    for (const match of text.matchAll(/﴿([^﴾]*)﴾/g)) {
      // ﴿٩٤﴾ is a verse-number marker, not a quote.
      if (/^[\s\d٠-٩]+$/.test(match[1])) continue;
      const verdict = verifyInlineQuote(match[1], this.surahIndex);
      if (verdict.ok) this.verifiedQuotes.push(match[1]);
      else {
        ok = false;
        this.issue('error', source, `Qur'an quote does not match the verse text — excluded from chat: ${verdict.detail}`);
      }
    }
    if (/[﴿﴾]/.test(text.replace(/﴿[^﴾]*﴾/g, ''))) {
      ok = false;
      this.issue('error', source, 'unbalanced ﴿﴾ brackets — excluded from chat');
    }
    return ok;
  }

  verifyQuote(quote: string) {
    return verifyInlineQuote(quote, this.surahIndex);
  }

  add(unit: {
    recordId: string;
    slug: string;
    kind: UnitKind;
    text: string | undefined;
    refs: EntityRefs;
    trust?: KbUnit['trust'];
    verbatimOnly?: boolean;
    alsoAbout?: string[];
    list?: KbUnit['list'];
  }): boolean {
    const text = (unit.text ?? (unit.list ? `${unit.list.heading}: ${unit.list.items.join('، ')}` : '')).replace(/\s+/g, ' ').trim();
    if (!text) return false;
    const source = `${unit.recordId}#${unit.slug}`;
    if (!this.quotesAreVerified(text, source)) return false;
    this.units.push({
      id: source,
      recordId: unit.recordId,
      kind: unit.kind,
      text,
      trust: unit.trust ?? 'primary',
      verbatimOnly: unit.verbatimOnly ?? false,
      ...(unit.alsoAbout?.length ? { alsoAbout: unit.alsoAbout } : {}),
      ...(unit.list ? { list: unit.list } : {}),
      refs: unit.refs,
    });
    return true;
  }
}

/**
 * Titles and names inserted into template sentences are written without
 * vowel marks: the stored forms carry a nominative case ending that becomes
 * a grammatical error after "تاريخ" or "في" (تاريخ غَزْوَةُ أُحُدٍ).
 * Unvocalized text is correct in any position.
 */
export function bare(title: string): string {
  return title.replace(/[ً-ٰٟ]/g, '').replace(/\s+/g, ' ').trim();
}

const OPENERS: Record<string, string> = { '«': '»', '﴿': '﴾', '(': ')', '[': ']', '"': '"' };

/**
 * Splits prose into sentences on . ! ؟ — but never inside «quotes», ﴿verses﴾,
 * (parentheses) or [source notes], which carry their own punctuation. Short
 * fragments and leading source notes ("[ابن كثير، البداية والنهاية].") stay
 * attached to the sentence before them.
 */
export function splitSentences(text: string | undefined): string[] {
  if (!text) return [];
  const source = text.replace(/\s+/g, ' ').trim();
  const parts: string[] = [];
  const stack: string[] = [];
  let current = '';
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    current += ch;
    if (stack.length > 0 && ch === stack[stack.length - 1]) stack.pop();
    else if (OPENERS[ch] && !(ch === '"' && stack[stack.length - 1] === '"')) stack.push(OPENERS[ch]);
    const atBoundary = /[.!؟?]/.test(ch) && source[i + 1] === ' ';
    if (atBoundary && stack.length === 0) {
      parts.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) parts.push(current.trim());

  const merged: string[] = [];
  for (const part of parts) {
    const plainLength = part.replace(/[ً-ٰٟ]/g, '').length;
    if (merged.length > 0 && (plainLength < 30 || /^[[(«]/.test(part))) merged[merged.length - 1] += ` ${part}`;
    else merged.push(part);
  }
  return merged;
}

const HONORIFICS = /\s*(رضي الله عنهما|رضي الله عنهم|رضي الله عنها|رضي الله عنه|رحمهم الله|رحمها الله|رحمه الله|صلى الله عليه وسلم|عليه السلام|ﷺ)\s*/g;

/** Plain alias form: no diacritics, no honorifics, no parentheses. */
export function aliasForm(name: string): string {
  return name
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(HONORIFICS, ' ')
    .replace(/[()«»"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Number words (letter-folded) — used to keep scenario sentences that state
// quantities out of the knowledge base when an authoritative event record
// covers the same battle.
const NUMBER_WORDS = new Set(
  [
    'واحد', 'واحده', 'اثنان', 'اثنين', 'اثنتان', 'اثنتين', 'ثلاث', 'ثلاثه', 'اربع', 'اربعه', 'خمس', 'خمسه',
    'ست', 'سته', 'سبع', 'سبعه', 'ثمان', 'ثماني', 'ثمانيه', 'تسع', 'تسعه', 'عشر', 'عشره', 'عشرون', 'عشرين',
    'ثلاثون', 'ثلاثين', 'اربعون', 'اربعين', 'خمسون', 'خمسين', 'ستون', 'ستين', 'سبعون', 'سبعين', 'ثمانون',
    // Written as foldLetters() leaves them: ئ → ي, ة → ه (so مئة → ميه).
    'ثمانين', 'تسعون', 'تسعين', 'ميه', 'مايه', 'ميتان', 'ميتين', 'مايتان', 'مايتين', 'الف', 'الفا', 'الفان',
    'الفين', 'الاف', 'بضع', 'بضعه', 'نيف', 'نيفا', 'عشرات', 'ميات', 'الوف',
  ]
);

export function mentionsQuantity(text: string): boolean {
  return analyze(text).some(token => {
    if (token.isNumber) return true;
    const bare = token.folded.replace(/^(و|ف)?(ب|ل|ك)?(ال)?/, '');
    return NUMBER_WORDS.has(token.folded) || NUMBER_WORDS.has(bare);
  });
}
