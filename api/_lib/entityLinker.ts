/**
 * Finds which Nibras records a question names — companions, events, battles,
 * cities, verses, eras — by matching alias phrases token-by-token. This is
 * exact (no fuzzy scoring), so a named entity is found no matter how the rest
 * of the question is phrased.
 */
import { analyze, foldLetters } from '../../shared/arabicText.js';
import { aliasToken, type AliasEntry, type LoadedKb } from './kb.js';

export interface LinkedEntity {
  recordId: string;
  /** Multi-word or distinctive match — a confident reference. */
  strong: boolean;
  phrase: string;
}

/** Clitic-stripped spellings a question token may carry in front of a name. */
function tokenVariants(raw: string): string[] {
  const folded = aliasToken(foldLetters(raw));
  const variants = new Set([folded]);
  const bare = folded.replace(/^(و|ف)/, '');
  if (bare.length >= 3) variants.add(aliasToken(bare));
  for (const base of [folded, bare]) {
    if (/^لل/.test(base) && base.length >= 4) variants.add(aliasToken(`ال${base.slice(2)}`));
    if (/^[بلك]/.test(base) && base.length >= 4) variants.add(aliasToken(base.slice(1)));
  }
  return [...variants];
}

// Single words that are also everyday vocabulary; as one-word aliases they
// only weakly suggest a record.
const COMMON_WORDS = new Set(['مالك', 'عامر', 'هاشم', 'محمود', 'قيس', 'حبيب', 'عاصم', 'نعيم', 'سعيد', 'الانصار', 'صفوان', 'جابر', 'انس', 'محمد']);

export function linkEntities(question: string, kb: LoadedKb): LinkedEntity[] {
  const tokens = analyze(question);
  const matches: { start: number; end: number; entries: AliasEntry[]; phrase: string }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    let best: { end: number; entries: AliasEntry[] } | null = null;
    for (const variant of tokenVariants(tokens[i].raw)) {
      for (const entry of kb.aliasIndex.get(variant) ?? []) {
        const end = i + entry.tokens.length;
        if (end > tokens.length) continue;
        let ok = true;
        for (let k = 1; k < entry.tokens.length; k++) {
          if (aliasToken(tokens[i + k].folded) !== entry.tokens[k]) {
            ok = false;
            break;
          }
        }
        // The preposition "على" folds to the name "علي". When the question
        // spells ى but a one-word alias is spelled with ي, it is not the name.
        // (The reverse — typing ي for a name ending in ى — is a common
        // spelling shortcut and still matches.)
        if (ok && entry.tokens.length === 1 && tokens[i].raw.endsWith('ى') && entry.rawTokens[0].endsWith('ي')) ok = false;
        // "مالك بن نويرة" is not "مالك بن عوف": a name the question continues
        // with بن/بنت beyond what the alias covers refers to someone else.
        if (ok && end < tokens.length && ['بن', 'بنت'].includes(aliasToken(tokens[end].folded))) ok = false;
        if (!ok) continue;
        if (!best || end > best.end) best = { end, entries: [entry] };
        else if (end === best.end) best.entries.push(entry);
      }
    }
    if (best) {
      matches.push({
        start: i,
        end: best.end,
        entries: best.entries,
        phrase: tokens.slice(i, best.end).map(t => t.raw).join(' '),
      });
    }
  }

  // Longest non-overlapping matches win ("عهد عمر" beats "عمر").
  matches.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
  const taken = new Array<boolean>(tokens.length).fill(false);
  const linked = new Map<string, LinkedEntity>();
  for (const match of matches) {
    let free = true;
    for (let k = match.start; k < match.end; k++) if (taken[k]) free = false;
    if (!free) continue;
    for (let k = match.start; k < match.end; k++) taken[k] = true;

    const distinctRecords = new Set(match.entries.map(e => e.recordId));
    for (const entry of match.entries) {
      const oneWord = entry.tokens.length === 1;
      const strong =
        !entry.weak &&
        (!oneWord || (distinctRecords.size <= 2 && !COMMON_WORDS.has(entry.tokens[0]) && entry.tokens[0].length >= 3));
      const previous = linked.get(entry.recordId);
      if (!previous || (strong && !previous.strong)) {
        linked.set(entry.recordId, { recordId: entry.recordId, strong, phrase: match.phrase });
      }
    }
  }
  return [...linked.values()];
}
