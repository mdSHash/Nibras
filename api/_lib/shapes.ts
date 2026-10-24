/**
 * Answer shapes (3J). Every word shown is stored text; only the arrangement
 * changes with the question:
 *  - an overview of one clear record is composed here, without the model:
 *    summary, the story (or the steps, for "tell me"), facts, roles, verses;
 *  - otherwise the model picks passages and a shape per section, and the
 *    server renders each passage whole (composeSections).
 * Headings come only from HEADINGS.
 */
import type { KbRecord, KbUnit } from '../../shared/chatKb.js';
import { normalizeForMatch } from '../../shared/arabic.js';
import { Composer, type ComposedAnswer } from './answer.js';
import type { LoadedKb } from './kb.js';
import type { Intent, SearchOutcome } from './search.js';

export const HEADINGS = ['القصة', 'الأحداث بالترتيب', 'أهم المعلومات', 'مواقف الشخصيات', 'تفاصيل أخرى', 'السيرة'] as const;
export type Heading = (typeof HEADINGS)[number];
export const isHeading = (value: unknown): value is Heading => typeof value === 'string' && (HEADINGS as readonly string[]).includes(value);

export type OverviewStyle = 'overview' | 'narrative' | 'person' | 'list';

// «احكيلي عن غزوة بدر», «إيه اللي حصل في أحد؟»: the course of events leads.
const NARRATIVE = /(^| )(احكي|احكيلي|احكيلنا|احكي لي|حصل ايه|اللي حصل|ماذا حدث|ما الذي حدث|ماذا جري|بالترتيب|ازاي حصل|ازاي حصلت|كيف حدث|كيف حدثت|كيف وقع|كيف وقعت)( |$)/;
// «إيه هو صلح الحديبية؟», «ماذا تعرف عن…», «ما قصة…»: the story leads.
const OVERVIEW = /(^| )(ايه هو|ايه هي|ما هو|ما هي|ماذا تعرف|تعرف ايه|عرفني|عرفنا|قصه|ما قصه|ايه قصه|كلمني|حدثني|اشرح|اشرحلي|نبذه)( |$)/;
/** Question types that ask for one part of a record, not the whole of it. */
const PART_INTENTS: ReadonlySet<Intent> = new Set([
  'date', 'location', 'quantity', 'duration', 'role', 'quran', 'hadith', 'sources', 'outcome', 'reason', 'death', 'birth', 'appearances', 'agent',
]);

/** A battle replay or video record stands for its event, which has the facts. */
function eventFor(kb: LoadedKb, record: KbRecord): KbRecord {
  if (record.type !== 'battle') return record;
  return kb.kb.records.find(r => r.type === 'event' && r.refs.battleId === record.refs.battleId) ?? record;
}

/** The record a question asks about as a whole, and how to tell it; null when it asks for a part. */
export function overviewTarget(question: string, found: SearchOutcome, kb: LoadedKb): { recordId: string; style: OverviewStyle } | null {
  if (found.intents.some(i => PART_INTENTS.has(i))) return null;
  // Only a record the question names: a follow-up on a carried one («وبعدين حصل إيه؟») asks for more, not the same again.
  const records = [...new Map(found.entities.filter(e => e.strong && !e.carried).map(e => {
    const record = eventFor(kb, kb.recordById.get(e.recordId)!);
    return [record.id, record] as const;
  })).values()];
  if (records.length !== 1) return null;
  const record = records[0];
  const normalized = ` ${normalizeForMatch(question)} `;
  const narrative = NARRATIVE.test(normalized);
  // A bare name («بدر», «صلح الحديبيه») asks for the whole record too.
  const bare = found.intents.length === 0 && normalized.trim().split(' ').length <= 3;
  if (!narrative && !OVERVIEW.test(normalized) && !bare && !found.intents.includes('biography')) return null;

  if (record.type === 'event') return { recordId: record.id, style: narrative ? 'narrative' : 'overview' };
  if (record.type === 'companion') return { recordId: record.id, style: 'person' };
  if (record.type === 'list') return { recordId: record.id, style: 'list' };
  return null;
}

const FACT_KINDS = new Set(['event_date', 'event_location', 'event_army', 'event_duration']);

/** The whole record, in order, without the model. */
export function composeOverview(kb: LoadedKb, recordId: string, style: OverviewStyle): ComposedAnswer {
  const composer = new Composer(kb);
  const units = kb.unitsByRecord.get(recordId) ?? [];
  const of = (kind: string) => units.filter(u => u.kind === kind);

  if (style === 'person') {
    composer.paragraph(of('companion_profile'));
    composer.paragraph(of('companion_bio'), 'السيرة');
    of('companion_events').forEach(u => composer.quote(u));
  } else if (style === 'list') {
    units.filter(u => u.list).forEach(u => composer.quote(u));
  } else {
    const sources = of('event_sources').flatMap(u => u.list?.items ?? []);
    composer.paragraph(of('event_summary'));
    const [primary, secondary] = style === 'narrative' ? [of('event_step'), of('event_description')] : [of('event_description'), of('event_step')];
    // When a record has only one of the two, it is the story either way.
    const lead = primary.length > 0 ? primary : secondary;
    if (style === 'narrative' && lead === primary) composer.steps(lead, 'الأحداث بالترتيب', sources);
    else composer.paragraph(lead, 'القصة', sources);
    if (lead === primary) composer.paragraph(composer.fresh(secondary), 'تفاصيل أخرى');
    composer.facts(units.filter(u => FACT_KINDS.has(u.kind)), 'أهم المعلومات');
    composer.facts(of('event_role'), 'مواقف الشخصيات');
    composer.attachVerbatim(of('event_quran'));
  }
  return composer.done();
}

export interface ModelSection {
  shape: 'paragraph' | 'steps' | 'facts' | 'list';
  heading?: Heading;
  refs: string[];
}

const unitOrder = new WeakMap<LoadedKb, Map<string, number>>();

/** Knowledge-base order, which keeps a record's narrative in sequence. */
function byKbOrder(kb: LoadedKb): (a: KbUnit, b: KbUnit) => number {
  let index = unitOrder.get(kb);
  if (!index) unitOrder.set(kb, (index = new Map(kb.units.map((u, i) => [u.id, i]))));
  return (a, b) => index.get(a.id)! - index.get(b.id)!;
}

/**
 * The model's sections, each passage rendered whole: lists in full, verses and
 * hadith from stored text, fact and role passages as rows, prose as a
 * paragraph or numbered steps in knowledge-base order. A passage already shown,
 * or one that only repeats what is shown, is left out.
 */
export function composeSections(kb: LoadedKb, sections: ModelSection[], unitByRef: Map<string, KbUnit>): ComposedAnswer {
  const composer = new Composer(kb);
  const order = byKbOrder(kb);
  for (const section of sections.slice(0, 6)) {
    const units = [...new Set(section.refs.map(ref => unitByRef.get(ref.trim())).filter((u): u is KbUnit => !!u))];
    units.filter(u => u.list).forEach(u => composer.quote(u));
    composer.attachVerbatim(units.filter(u => !u.list));
    const facts = units.filter(u => u.fact && !u.verbatimOnly);
    composer.facts(composer.fresh(facts, false), section.shape === 'facts' ? section.heading : undefined);
    const prose = units.filter(u => !u.list && !u.fact && !u.verbatimOnly && !(u.kind === 'event_quran' && u.refs.quranKey)).sort(order);
    const fresh = composer.fresh(prose);
    const heading = section.shape === 'facts' ? undefined : section.heading;
    if (section.shape === 'steps') composer.steps(fresh, heading);
    else composer.paragraph(fresh, heading);
  }
  return composer.done();
}
