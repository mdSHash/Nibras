/**
 * Loads the chat knowledge base once per cold start and derives the in-memory
 * indexes search needs (BM25 postings, alias lookup). The JSON is produced by
 * scripts/build-chat-kb.ts.
 */
import kbJson from '../../public/data/chat-kb.json' with { type: 'json' };
import type { ChatKb, KbRecord, KbUnit } from '../../shared/chatKb.js';
import { analyze, foldLetters, searchStems, stripDiacritics } from '../../shared/arabicText.js';

export interface LoadedKb {
  kb: ChatKb;
  units: KbUnit[];
  unitById: Map<string, KbUnit>;
  recordById: Map<string, KbRecord>;
  unitsByRecord: Map<string, KbUnit[]>;
  /** Per unit: stem → term frequency. */
  termFreqs: Map<string, number>[];
  docLengths: number[];
  avgDocLength: number;
  docFreq: Map<string, number>;
  aliasIndex: AliasIndex;
  /** Distinct search stems of each event/battle/city title (for paraphrased titles). */
  titleStems: Map<string, string[]>;
  quranFourGrams: Set<string>;
}

export interface AliasEntry {
  tokens: string[];
  /** Same tokens before ى→ي folding, to tell the name علي from the word على. */
  rawTokens: string[];
  recordId: string;
  weak: boolean;
}

/** First alias token → aliases starting with it. */
export type AliasIndex = Map<string, AliasEntry[]>;

/**
 * Token form used for name matching: letters folded, kunya/nasab particles
 * unified (أبو/أبي/أبا → ابو, ابن → بن) so case endings don't block a match.
 * Single-letter-distinct forms like على/علي are handled by the linker.
 */
export function aliasToken(foldedToken: string): string {
  if (foldedToken === 'ابي' || foldedToken === 'ابا') return 'ابو';
  if (foldedToken === 'ابن') return 'بن';
  if (foldedToken === 'بنت' || foldedToken === 'ابنه') return 'بنت';
  return foldedToken;
}

export function aliasTokens(phrase: string): string[] {
  return analyze(phrase).map(t => aliasToken(t.folded));
}

function buildAliasIndex(records: KbRecord[]): AliasIndex {
  const index: AliasIndex = new Map();
  const seen = new Set<string>();
  const addAlias = (phrase: string, recordId: string, weak: boolean) => {
    const analyzed = analyze(phrase);
    const tokens = analyzed.map(t => aliasToken(t.folded));
    if (tokens.length === 0 || tokens.join('').length < 3) return;
    const key = `${recordId}|${tokens.join(' ')}`;
    if (seen.has(key)) return;
    seen.add(key);
    const list = index.get(tokens[0]) ?? [];
    list.push({ tokens, rawTokens: analyzed.map(t => t.raw), recordId, weak });
    index.set(tokens[0], list);
  };
  for (const record of records) {
    for (const alias of record.aliases) addAlias(alias, record.id, false);
    for (const alias of record.weakAliases) addAlias(alias, record.id, true);
  }
  for (const list of index.values()) list.sort((a, b) => b.tokens.length - a.tokens.length);
  return index;
}

function load(): LoadedKb {
  const kb = kbJson as unknown as ChatKb;
  const recordById = new Map(kb.records.map(r => [r.id, r]));
  const unitsByRecord = new Map<string, KbUnit[]>();
  for (const unit of kb.units) {
    const list = unitsByRecord.get(unit.recordId) ?? [];
    list.push(unit);
    unitsByRecord.set(unit.recordId, list);
  }

  const termFreqs: Map<string, number>[] = [];
  const docLengths: number[] = [];
  const docFreq = new Map<string, number>();
  for (const unit of kb.units) {
    const title = recordById.get(unit.recordId)?.title ?? '';
    // Fact units already contain the title; prose units get it appended so a
    // course-of-events step is still findable by the event's name.
    const indexedText = stripDiacritics(unit.text).includes(stripDiacritics(title)) ? unit.text : `${unit.text} ${title}`;
    const stems = searchStems(indexedText);
    const tf = new Map<string, number>();
    for (const stem of stems) tf.set(stem, (tf.get(stem) ?? 0) + 1);
    for (const stem of tf.keys()) docFreq.set(stem, (docFreq.get(stem) ?? 0) + 1);
    termFreqs.push(tf);
    docLengths.push(stems.length);
  }

  return {
    kb,
    units: kb.units,
    unitById: new Map(kb.units.map(u => [u.id, u])),
    recordById,
    unitsByRecord,
    termFreqs,
    docLengths,
    avgDocLength: docLengths.reduce((a, b) => a + b, 0) / Math.max(1, docLengths.length),
    docFreq,
    aliasIndex: buildAliasIndex(kb.records),
    titleStems: new Map(
      kb.records
        .filter(r => r.type === 'event' || r.type === 'battle' || r.type === 'city')
        .map(r => [r.id, [...new Set(searchStems(r.title))]])
    ),
    quranFourGrams: new Set(kb.quranFourGrams),
  };
}

let cached: LoadedKb | null = null;

export function getKb(): LoadedKb {
  cached ??= load();
  return cached;
}

/** Diacritic-free text given to the model — fewer tokens, same letters. */
export function plainText(text: string): string {
  return stripDiacritics(text).replace(/\s+/g, ' ').trim();
}

export { foldLetters };
