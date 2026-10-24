/**
 * Turns a (parsed) model answer into the blocks sent to the client:
 * validated model sentences, verbatim source quotes, and verbatim verses.
 * Also builds the extractive fallback used when no model answer is available.
 */
import quranPassages from '../../src/generated/quranPassages.json' with { type: 'json' };
import type { AnswerBlock, ChatCitation } from '../../shared/chatApi.js';
import type { KbRecord, KbUnit } from '../../shared/chatKb.js';
import type { LoadedKb } from './kb.js';
import type { ModelAnswer } from './prompt.js';
import type { EvidenceRecord, Intent } from './search.js';
import { searchStems } from '../../shared/arabic.js';
import { validatePoint } from './validator.js';

export type { AnswerBlock, ChatCitation };

export interface ComposedAnswer {
  blocks: AnswerBlock[];
  citations: ChatCitation[];
  /** How many model sentences were replaced by source text. */
  rejected: { text: string; reason: string }[];
  /** Knowledge-base units the answer shows (traces and tests). */
  shown: string[];
}

const verses: Record<string, { text: string; link?: string }> = Object.fromEntries(quranPassages.map(p => [p.key, p]));

/**
 * A passage adds to an answer when at least half of its words are new to it.
 * Measured over the 131 events (3J): steps share 40–60% of their words with
 * the description; at 0.5, 334 of 711 steps still count as new.
 */
export const NOVELTY_MIN = 0.5;

/** Share of the text's search stems not in `seen`. */
export function novelty(text: string, seen: Set<string>): number {
  const stems = [...new Set(searchStems(text))];
  return stems.length === 0 ? 0 : stems.filter(s => !seen.has(s)).length / stems.length;
}

export class Composer {
  readonly blocks: AnswerBlock[] = [];
  private readonly citedRecords: string[] = [];
  private readonly shownUnits = new Set<string>();
  private readonly shownVerses = new Set<string>();
  /** Stems of the prose shown so far, so a passage that only repeats it is left out. */
  private readonly shownStems = new Set<string>();

  constructor(private readonly kb: LoadedKb) {}

  /**
   * The units not shown yet; for prose, only those that add to what is shown
   * and to the ones kept before them (a step retelling the description is left out).
   */
  fresh(units: KbUnit[], prose = true): KbUnit[] {
    const seen = new Set(this.shownStems);
    const kept: KbUnit[] = [];
    for (const unit of units) {
      if (this.shownUnits.has(unit.id) || kept.includes(unit)) continue;
      if (prose && seen.size > 0 && novelty(unit.text, seen) < NOVELTY_MIN) continue;
      kept.push(unit);
      if (prose) searchStems(unit.text).forEach(s => seen.add(s));
    }
    return kept;
  }

  private show(units: KbUnit[], prose: boolean): string[] {
    for (const unit of units) {
      this.shownUnits.add(unit.id);
      if (prose) searchStems(unit.text).forEach(s => this.shownStems.add(s));
    }
    return [...new Set(units.flatMap(u => this.cite(u)))];
  }

  private static sources(units: KbUnit[], extra: string[] = []): { sources?: string[] } {
    const sources = [...new Set([...units.flatMap(u => u.sources ?? []), ...extra])];
    return sources.length > 0 ? { sources } : {};
  }

  /** Whole stored sentences, in the order given. */
  paragraph(units: KbUnit[], heading?: string, extraSources?: string[]) {
    if (units.length === 0) return;
    const citations = this.show(units, true);
    this.blocks.push({ type: 'paragraph', ...(heading ? { heading } : {}), text: units.map(u => u.text).join(' '), citations, ...Composer.sources(units, extraSources) });
  }

  steps(units: KbUnit[], heading?: string, extraSources?: string[]) {
    if (units.length === 0) return;
    const citations = this.show(units, true);
    this.blocks.push({ type: 'steps', ...(heading ? { heading } : {}), items: units.map(u => u.text), citations, ...Composer.sources(units, extraSources) });
  }

  /** Fact and role units as label/value rows; the record's title joins the label when the rows span records. */
  facts(units: KbUnit[], heading?: string) {
    const rows = units.filter(u => u.fact);
    if (rows.length === 0) return;
    const spansRecords = new Set(rows.map(u => u.recordId)).size > 1;
    const citations = this.show(rows, false);
    this.blocks.push({
      type: 'facts',
      ...(heading ? { heading } : {}),
      rows: rows.map(u => ({
        label: spansRecords && u.kind !== 'event_role' ? `${u.fact!.label} — ${this.kb.recordById.get(u.recordId)?.title ?? ''}` : u.fact!.label,
        value: u.fact!.value,
      })),
      citations,
    });
  }

  private cite(unit: KbUnit): string[] {
    const ids = [unit.recordId, ...(unit.alsoAbout ?? [])].filter(id => this.kb.recordById.has(id));
    for (const id of ids) if (!this.citedRecords.includes(id)) this.citedRecords.push(id);
    return ids;
  }

  text(text: string, units: KbUnit[]) {
    const sources = [...new Set(units.flatMap(u => u.sources ?? []))];
    this.blocks.push({ type: 'text', text, citations: [...new Set(units.flatMap(u => this.cite(u)))], ...(sources.length > 0 ? { sources } : {}) });
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
    this.blocks.push({
      type: 'quote',
      text: unit.text,
      source: record?.title ?? '',
      citations: this.cite(unit),
      ...(unit.sources?.length ? { sources: unit.sources } : {}),
    });
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

  done(rejected: ComposedAnswer['rejected'] = []): ComposedAnswer {
    return { blocks: this.blocks, citations: this.citations(), rejected, shown: [...this.shownUnits] };
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

  return composer.done(rejected);
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
  // When the question is about a specific event, only that event's passages
  // may stand in for a rejected sentence — never the person's other events.
  const focusEvents = focus.filter(id => ['event', 'battle'].includes(kb.recordById.get(id)?.type ?? ''));
  const focusBattles = new Set(focusEvents.map(id => kb.recordById.get(id)?.refs.battleId).filter(Boolean));
  const onTopic = (unit: KbUnit) =>
    focusEvents.length === 0 || focusEvents.includes(unit.recordId) || focusBattles.has(kb.recordById.get(unit.recordId)?.refs.battleId);
  const candidates = [...cited, ...evidence.filter(u => !cited.includes(u) && !u.verbatimOnly && !u.list)].filter(onTopic);
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
  if (!best || best.score < 2) return cited.filter(onTopic).slice(0, 1);
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
  return composer.done();
}
