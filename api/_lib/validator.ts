/**
 * Deterministic answer validator. Nothing the language model writes reaches
 * the user unless it passes here; a failing point is replaced by the full
 * verbatim source sentence it cited (see answer.ts).
 *
 * A point is "label: body".
 *  - body:  must be one or more COMPLETE clauses copied from the cited
 *           passages — a clause being text between punctuation marks. Words
 *           may not be changed, reordered or dropped inside a clause, so
 *           the body can never become ungrammatical or say something the
 *           source does not. What is displayed is the source's own
 *           (fully vocalized) text for those clauses, not the model's copy.
 *  - label: optional short heading (a name or topic). Every word must
 *           appear in the cited passages or record titles, or be a function
 *           word; numbers must appear in the passages.
 *  - Qur'an: no ﴿﴾ and no four-word run from verified Qur'an text anywhere.
 */
import type { KbUnit } from '../../shared/chatKb.js';
import { analyze, foldLetters, normalizeForMatch, stemVariants, stripDiacritics, toLatinDigits } from '../../shared/arabicText.js';

const FUNCTION_WORDS_SOURCE = `
و ف ثم أو أم بل لكن إلا حيث إذ إذا لما عندما حين بعد قبل كما مثل أيضا كذلك
هو هي هم هما هن هذا هذه ذلك تلك الذي التي الذين ما من في على عن إلى الى مع منذ حتى
عند بين خلال ضمن نحو حول دون غير كل بعض جميع أحد إحدى قد كان كانت ليس لم لن لا أن إن
له لها لهم به بها منه منها عنه عنها فيه فيها إليه عليه عليها معه دور موقف
`;

// Raw form only (alef-folded, ى kept): the folded form of the preposition
// "على" is "علي", which would otherwise turn the name Ali into a function word.
const FUNCTION_WORDS = new Set<string>(analyze(FUNCTION_WORDS_SOURCE).map(t => t.raw));

const ALLOWED_CHARS = /^[ء-غـ-ٰٟٱ٠-٩۰-۹0-9\s.,،؛:!?؟()«»"'\-–—/*ﷺ]*$/;

export interface CheckResult {
  ok: boolean;
  reason?: string;
}

// ─── Clause-level matching ───────────────────────────────────────────────────

interface Word {
  folded: string;
  start: number;
  end: number;
  /** A clause may begin at this word (text start or punctuation before it). */
  opens: boolean;
  /** A clause may end at this word (text end or punctuation after it). */
  closes: boolean;
}

const WORD = /[ء-غـ-ٰٟٱ٠-٩۰-۹0-9]+/g;
const CLAUSE_BREAK = /[.,،؛;:!?؟()«»\[\]"—–﴿﴾]/;

// Standalone particles that begin a new clause: "قاتل بشجاعة حتى استشهد…"
// may be shortened to "استشهد…" without breaking the grammar of either part.
const CLAUSE_PARTICLES = new Set(['حتي', 'ثم', 'بل', 'لكن', 'لكنه', 'لكنها', 'حيث', 'اذ', 'عندما', 'بينما', 'بعدما', 'فلما', 'لما']);

export function words(text: string): Word[] {
  const result: Word[] = [];
  let lastEnd = 0;
  let afterParticle = false;
  for (const match of text.matchAll(WORD)) {
    const folded = foldLetters(stripDiacritics(toLatinDigits(match[0])));
    if (!folded) continue;
    const start = match.index!;
    const gap = text.slice(lastEnd, start);
    const isParticle = CLAUSE_PARTICLES.has(folded);
    const opens = result.length === 0 || CLAUSE_BREAK.test(gap) || isParticle || afterParticle;
    if (result.length > 0 && (CLAUSE_BREAK.test(gap) || isParticle)) result[result.length - 1].closes = true;
    result.push({ folded, start, end: start + match[0].length, opens, closes: false });
    lastEnd = start + match[0].length;
    afterParticle = isParticle;
  }
  if (result.length > 0) result[result.length - 1].closes = true;
  return result;
}

export interface ClauseSegment {
  unit: KbUnit;
  from: number;
  to: number;
}

const MAX_SEGMENTS = 6;

/** Splits `body` into the fewest whole-clause runs found in the cited units, or null. */
export function matchClauses(body: string, units: KbUnit[]): ClauseSegment[] | null {
  const target = words(body).map(w => w.folded);
  if (target.length === 0) return null;
  const sources = units.map(unit => ({ unit, words: words(unit.text) }));
  const best: (ClauseSegment[] | null)[] = new Array(target.length + 1).fill(null);
  best[0] = [];
  for (let i = 0; i < target.length; i++) {
    const prefix = best[i];
    if (!prefix || prefix.length >= MAX_SEGMENTS) continue;
    for (const { unit, words: ws } of sources) {
      for (let p = 0; p < ws.length; p++) {
        if (!ws[p].opens || ws[p].folded !== target[i]) continue;
        for (let k = 0; i + k < target.length && p + k < ws.length && ws[p + k].folded === target[i + k]; k++) {
          if (!ws[p + k].closes) continue;
          const candidate = [...prefix, { unit, from: p, to: p + k }];
          const slot = i + k + 1;
          if (!best[slot] || best[slot]!.length > candidate.length) best[slot] = candidate;
        }
      }
    }
  }
  return best[target.length];
}

/** The source's own text for matched segments; adjacent segments are joined, gaps shown as "…". */
export function renderSegments(segments: ClauseSegment[]): string {
  // Merge segments that continue each other in the same unit into runs.
  const runs: ClauseSegment[] = [];
  for (const segment of segments) {
    const last = runs[runs.length - 1];
    if (last && last.unit === segment.unit && segment.from === last.to + 1) last.to = segment.to;
    else runs.push({ ...segment });
  }
  return runs
    .map(run => {
      const ws = words(run.unit.text);
      let end = ws[run.to].end;
      while (end < run.unit.text.length && /[»)\]."؟!]/.test(run.unit.text[end])) end++;
      return run.unit.text.slice(ws[run.from].start, end).trim();
    })
    .join(' … ');
}

// ─── Label vocabulary check ──────────────────────────────────────────────────

export interface Vocabulary {
  words: Set<string>;
  stems: Set<string>;
  numbers: Set<string>;
}

const PROPHET_REFERENCE_STEMS = [...new Set(analyze('النبي الرسول رسول المصطفى').map(t => t.stem))];

/** Vocabulary of the cited passages. Qur'an spans and verbatim-only units contribute only their labels. */
export function buildVocabulary(units: KbUnit[], titles: string[]): Vocabulary {
  const vocab: Vocabulary = { words: new Set(), stems: new Set(), numbers: new Set() };
  const addText = (text: string) => {
    for (const token of analyze(text)) {
      vocab.words.add(token.folded);
      stemVariants(token.folded).forEach(s => vocab.stems.add(s));
      if (token.isNumber) vocab.numbers.add(String(Number(token.raw)));
    }
  };
  for (const unit of units) {
    const withoutQuran = unit.text.replace(/﴿[^﴾]*﴾/g, ' ');
    addText(unit.verbatimOnly ? withoutQuran.split(':')[0] : withoutQuran);
  }
  for (const title of titles) addText(title);
  // "رسول الله" in a source lets a label say "النبي" ("الله" alone is not added).
  if (PROPHET_REFERENCE_STEMS.some(s => vocab.stems.has(s))) PROPHET_REFERENCE_STEMS.forEach(s => vocab.stems.add(s));
  return vocab;
}

function basicChecks(text: string): CheckResult {
  if (!text.trim()) return { ok: false, reason: 'empty' };
  if (text.length > 600) return { ok: false, reason: 'too long' };
  if (/[﴿﴾]/.test(text)) return { ok: false, reason: 'contains Qur\'an brackets' };
  if (!ALLOWED_CHARS.test(text)) return { ok: false, reason: 'contains characters outside Arabic text' };
  return { ok: true };
}

export function restatesQuran(text: string, quranFourGrams: Set<string>): boolean {
  const ws = normalizeForMatch(text).split(' ').filter(w => w && !/^[0-9]+$/.test(w));
  for (let i = 0; i + 4 <= ws.length; i++) if (quranFourGrams.has(ws.slice(i, i + 4).join(' '))) return true;
  return false;
}

export function checkLabel(label: string, vocab: Vocabulary, maxWords = 8): CheckResult {
  const basic = basicChecks(label);
  if (!basic.ok) return basic;
  const tokens = analyze(label);
  if (tokens.length === 0 || tokens.length > maxWords) return { ok: false, reason: 'label length' };
  for (const token of tokens) {
    if (token.isNumber) {
      if (!vocab.numbers.has(String(Number(token.raw)))) return { ok: false, reason: `number not in sources: ${token.raw}` };
      continue;
    }
    if (FUNCTION_WORDS.has(token.raw) || vocab.words.has(token.folded)) continue;
    if (stemVariants(token.folded).some(s => vocab.stems.has(s))) continue;
    return { ok: false, reason: `word not in sources: ${token.raw}` };
  }
  return { ok: true };
}

export interface PointVerdict {
  ok: boolean;
  /** Display text: optional "**label**: " followed by the source's clauses. */
  display?: string;
  reason?: string;
}

/** Validates one model point against the prose units it cites. */
export function validatePoint(text: string, units: KbUnit[], titles: string[], quranFourGrams: Set<string>): PointVerdict {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const basic = basicChecks(cleaned);
  if (!basic.ok) return { ok: false, reason: basic.reason };
  if (restatesQuran(cleaned, quranFourGrams)) return { ok: false, reason: 'restates Qur\'an text' };

  const whole = matchClauses(cleaned.replace(/\*\*/g, ''), units);
  if (whole) return { ok: true, display: renderSegments(whole) };

  const colon = cleaned.indexOf(':');
  if (colon > 0) {
    const label = cleaned.slice(0, colon).replace(/\*\*/g, '').trim();
    const body = cleaned.slice(colon + 1).replace(/\*\*/g, '').trim();
    const segments = body ? matchClauses(body, units) : null;
    if (!segments) return { ok: false, reason: 'body is not whole clauses from the cited passages' };
    const labelCheck = checkLabel(label, buildVocabulary(units, titles));
    if (!labelCheck.ok) return { ok: false, reason: `label: ${labelCheck.reason}` };
    return { ok: true, display: `**${label}**: ${renderSegments(segments)}` };
  }
  return { ok: false, reason: 'not whole clauses from the cited passages' };
}
