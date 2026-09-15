/**
 * Turns a (parsed) model answer into the blocks sent to the client:
 * validated model sentences, verbatim source quotes, and verbatim verses.
 * Also builds the extractive fallback used when no model answer is available.
 */
import quranData from '../../src/quranData.json' with { type: 'json' };
import type { AnswerBlock, ChatCitation } from '../../shared/chatApi.js';
import type { KbRecord, KbUnit } from '../../shared/chatKb.js';
import type { LoadedKb } from './kb.js';
import type { ModelAnswer } from './prompt.js';
import type { EvidenceRecord, Intent } from './search.js';
import { searchStems } from '../../shared/arabicText.js';
import { validatePoint } from './validator.js';

export type { AnswerBlock, ChatCitation };

export interface ComposedAnswer {
  blocks: AnswerBlock[];
  citations: ChatCitation[];
  /** How many model sentences were replaced by source text. */
  rejected: { text: string; reason: string }[];
}

const verses = quranData as Record<string, { text: string; link?: string }>;

class Composer {
  readonly blocks: AnswerBlock[] = [];
  private readonly citedRecords: string[] = [];
  private readonly shownUnits = new Set<string>();
  private readonly shownVerses = new Set<string>();

  constructor(private readonly kb: LoadedKb) {}

  private cite(unit: KbUnit): string[] {
    const ids = [unit.recordId, ...(unit.alsoAbout ?? [])].filter(id => this.kb.recordById.has(id));
    for (const id of ids) if (!this.citedRecords.includes(id)) this.citedRecords.push(id);
    return ids;
  }

  text(text: string, units: KbUnit[]) {
    this.blocks.push({ type: 'text', text, citations: [...new Set(units.flatMap(u => this.cite(u)))] });
  }

  quote(unit: KbUnit) {
    if (this.shownUnits.has(unit.id)) return;
    this.shownUnits.add(unit.id);
    if (unit.kind === 'quran_verse' && unit.refs.quranKey) {
      this.verse(unit.refs.quranKey, unit);
      return;
    }
    if (unit.list) {
      this.blocks.push({ type: 'list', heading: unit.list.heading, items: unit.list.items, citations: this.cite(unit) });
      return;
    }
    const record = this.kb.recordById.get(unit.recordId);
    this.blocks.push({ type: 'quote', text: unit.text, source: record?.title ?? '', citations: this.cite(unit) });
  }

  verse(key: string, citingUnit: KbUnit) {
    if (this.shownVerses.has(key) || !verses[key]) return;
    this.shownVerses.add(key);
    this.blocks.push({ type: 'quran', key, text: verses[key].text, link: verses[key].link, citations: this.cite(citingUnit) });
  }

  /** Verses and hadith a sentence relied on are always shown from stored text. */
  attachVerbatim(units: KbUnit[]) {
    for (const unit of units) {
      if (unit.kind === 'event_quran' && unit.refs.quranKey) this.verse(unit.refs.quranKey, unit);
      else if (unit.verbatimOnly) this.quote(unit);
    }
  }

  citations(): ChatCitation[] {
    return this.citedRecords.slice(0, 12).map(id => {
      const record = this.kb.recordById.get(id) as KbRecord;
      return { chunkId: id, sourceLabel: record.title, type: record.type, era: record.era, entityRefs: record.refs };
    });
  }
}

export function composeAnswer(kb: LoadedKb, model: ModelAnswer, unitByRef: Map<string, KbUnit>, focus: string[] = []): ComposedAnswer {
  const composer = new Composer(kb);
  const rejected: ComposedAnswer['rejected'] = [];
  const shown = new Set<string>();
  const evidenceUnits = [...unitByRef.values()];
  const titles = (units: KbUnit[]) => units.map(u => kb.recordById.get(u.recordId)?.title ?? '');

  for (const point of model.points.slice(0, 10)) {
    const units = [...new Set(point.refs)].map(ref => unitByRef.get(ref.trim())).filter((u): u is KbUnit => !!u);
    if (units.length === 0) continue;
    // A point drawn only from list units is rendered as the full stored list:
    // models were observed dropping the last item of an 11-name list.
    if (units.every(u => u.list)) {
      units.forEach(u => composer.quote(u));
      continue;
    }

    const proseUnits = units.filter(u => !u.verbatimOnly && !u.list);
    // "من الآيات المتعلقة بـ…: سورة الأنفال: 9" only points at a verse; the
    // verse block itself (with its reference) is the answer.
    if (proseUnits.length === 0 || proseUnits.every(u => u.kind === 'event_quran' && u.refs.quranKey)) {
      composer.attachVerbatim(units);
      continue;
    }
    const verdict = validatePoint(point.text, proseUnits, titles(proseUnits), kb.quranFourGrams);
    if (verdict.ok && verdict.display) {
      if (!shown.has(verdict.display)) {
        shown.add(verdict.display);
        composer.text(verdict.display, units);
      }
    } else {
      rejected.push({ text: point.text, reason: verdict.reason ?? 'invalid' });
      closestSourceUnits(kb, point.text, proseUnits, evidenceUnits, focus).forEach(u => composer.quote(u));
    }
    composer.attachVerbatim(units);
  }

  return { blocks: composer.blocks, citations: composer.citations(), rejected };
}

/**
 * When a point is rejected, show the evidence passage(s) that best contain
 * what the model was trying to say. Models sometimes cite the wrong id (a
 * biography sentence) for a claim that sits in another passage (the event
 * role naming Wahshi). Candidates must stay on the question's topic: passages
 * about more of the records the question names come first, then those
 * sharing the rarest words with the rejected sentence.
 */
function closestSourceUnits(kb: LoadedKb, text: string, cited: KbUnit[], evidence: KbUnit[], focus: string[]): KbUnit[] {
  const n = kb.units.length;
  const weight = (stem: string) => Math.log(1 + n / (1 + (kb.docFreq.get(stem) ?? 0)));
  const wanted = new Set(searchStems(text));
  const candidates = [...cited, ...evidence.filter(u => !cited.includes(u) && !u.verbatimOnly && !u.list)];
  const ranked = candidates
    .map(unit => {
      const about = [unit.recordId, ...(unit.alsoAbout ?? [])];
      const coverage = focus.filter(id => about.includes(id)).length;
      const stems = new Set(searchStems(unit.text));
      let overlap = 0;
      for (const stem of wanted) if (stems.has(stem)) overlap += weight(stem);
      return { unit, coverage, score: overlap + (cited.includes(unit) ? 1 : 0) };
    })
    .sort((x, y) => y.coverage - x.coverage || y.score - x.score);
  const best = ranked[0];
  if (!best || best.score < 2) return cited.slice(0, 1);
  return ranked.filter(r => r.coverage === best.coverage && r.score >= best.score * 0.8).slice(0, 2).map(r => r.unit);
}

const FALLBACK_KINDS_BY_INTENT: Partial<Record<Intent, string[]>> = {
  date: ['event_date'],
  location: ['event_location', 'city'],
  quantity: ['event_army', 'event_duration'],
  duration: ['event_duration'],
  role: ['event_role'],
  quran: ['event_quran', 'quran_verse'],
  biography: ['companion_profile', 'companion_bio'],
  list: ['list'],
};

/**
 * Used when no validated model answer is available (providers busy, invalid
 * JSON). Shows the best-matching source passages verbatim — always accurate,
 * less conversational.
 */
export function extractiveAnswer(kb: LoadedKb, evidence: EvidenceRecord[], intents: Intent[]): ComposedAnswer {
  const composer = new Composer(kb);
  const preferred = new Set(intents.flatMap(i => FALLBACK_KINDS_BY_INTENT[i] ?? []));
  const picked: KbUnit[] = [];
  for (const { units } of evidence.slice(0, 2)) {
    const ordered = [...units.filter(u => preferred.has(u.kind)), ...units.filter(u => !preferred.has(u.kind))];
    picked.push(...ordered.slice(0, 2));
  }
  picked.slice(0, 4).forEach(unit => {
    composer.quote(unit);
    composer.attachVerbatim([unit]);
  });
  return { blocks: composer.blocks, citations: composer.citations(), rejected: [] };
}
