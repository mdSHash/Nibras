/**
 * Suggested next questions shown under an answer. Built from the knowledge
 * base (no model call): only facets that exist for the record the answer was
 * about are offered, each suggestion is checked to retrieve that record, and
 * wording avoids gendered verbs (the data has no gender field).
 */
import type { KbRecord } from '../../shared/chatKb.js';
import { normalizeForMatch } from '../../shared/arabicText.js';
import { genitiveName } from '../../shared/arabicGrammar.js';
import type { LoadedKb } from './kb.js';
import { search, type Intent } from './search.js';

const MAX_FOLLOW_UPS = 3;
const HONORIFICS = /\s*(رضي الله عنهما|رضي الله عنهم|رضي الله عنها|رضي الله عنه|رحمه الله|صلى الله عليه وسلم|عليه السلام)\s*/g;

function plainName(text: string): string {
  return text.replace(/[ً-ٰٟ]/g, '').replace(HONORIFICS, ' ').replace(/\s+/g, ' ').trim();
}

function hasUnit(kb: LoadedKb, recordId: string, slugPrefix: string): boolean {
  return (kb.unitsByRecord.get(recordId) ?? []).some(u => u.id.startsWith(`${recordId}#${slugPrefix}`));
}

function candidatesFor(kb: LoadedKb, record: KbRecord, intents: Set<Intent>): string[] {
  const out: string[] = [];
  const t = plainName(record.title);
  if (record.type === 'event') {
    if (!intents.has('date') && hasUnit(kb, record.id, 'date')) out.push(`ما تاريخ ${t}؟`);
    if (!intents.has('location') && hasUnit(kb, record.id, 'location')) out.push(`ما مكان ${t}؟`);
    if (!intents.has('role') && hasUnit(kb, record.id, 'role:')) out.push(`من أبرز الشخصيات في ${t}؟`);
    if (!intents.has('quantity') && hasUnit(kb, record.id, 'army_size')) out.push(`ما عدد الجيش في ${t}؟`);
    if (!intents.has('quran') && hasUnit(kb, record.id, 'quran:')) out.push(`ما الآيات المتعلقة بـ${t}؟`);
    if (record.military && !intents.has('outcome')) out.push(`ما نتيجة ${t}؟`);
  } else if (record.type === 'companion') {
    // Every template puts the name after a noun (دور، ذكر، قصة): genitive case.
    const g = genitiveName(t);
    const firstName = t.split(' ').slice(0, 2).join(' ');
    const roles = kb.units.filter(u => u.kind === 'event_role' && u.alsoAbout?.includes(record.id));
    // Skip events named after the person ("رحيل أبي ذر الغفاري إلى الربذة").
    const firstEvent = roles
      .map(u => kb.recordById.get(u.recordId))
      .find(r => r !== undefined && !plainName(r.title).includes(firstName) && !plainName(r.title).includes(genitiveName(firstName)));
    if (firstEvent && !intents.has('role')) out.push(`ما دور ${g} في ${plainName(firstEvent.title)}؟`);
    if (!intents.has('appearances') && hasUnit(kb, record.id, 'events')) out.push(`في أي الأحداث ورد ذكر ${g}؟`);
    if (!intents.has('biography')) out.push(`ما قصة ${g}؟`);
  } else if (record.type === 'list' && record.id.startsWith('list:era:')) {
    const units = kb.unitsByRecord.get(record.id) ?? [];
    const label = plainName(record.title);
    if (intents.has('military')) {
      if (units.some(u => u.id.endsWith('#events'))) out.push(`ما الأحداث الأخرى في ${label}؟`);
    } else if (units.some(u => u.id.endsWith('#ghazawat'))) out.push(`ما غزوات النبي ﷺ في ${label}؟`);
    else if (units.some(u => u.id.endsWith('#battles'))) out.push(`ما المعارك والفتوح في ${label}؟`);
  } else if (record.type === 'quran') {
    if (hasUnit(kb, record.id, 'events')) out.push(`ما الأحداث المرتبطة بـ«${record.title}»؟`);
  } else if (record.type === 'city') {
    if (!intents.has('reason')) out.push(`ما مكانة ${t}؟`);
  }
  return out;
}

/** Resolves a battle-simulation record to its event record, which has the facts. */
function factRecord(kb: LoadedKb, id: string): KbRecord | undefined {
  const record = kb.recordById.get(id);
  if (record?.type !== 'battle') return record;
  return kb.kb.records.find(r => r.type === 'event' && r.refs.battleId === record.refs.battleId) ?? record;
}

export async function buildFollowUps(kb: LoadedKb, focusRecordIds: string[], intents: Intent[], question: string): Promise<string[]> {
  const asked = normalizeForMatch(question);
  const intentSet = new Set(intents);
  const results: string[] = [];
  const seen = new Set<string>();
  for (const id of focusRecordIds.slice(0, 2)) {
    const record = factRecord(kb, id);
    if (!record || seen.has(record.id)) continue;
    seen.add(record.id);
    for (const candidate of candidatesFor(kb, record, intentSet)) {
      if (results.length >= MAX_FOLLOW_UPS) return results;
      if (normalizeForMatch(candidate) === asked || results.includes(candidate)) continue;
      // Only offer questions this assistant can actually answer about that record.
      const check = await search(candidate, undefined, kb);
      if (check.confidence === 'high' && check.evidence.some(e => e.record.id === record.id)) results.push(candidate);
    }
  }
  return results;
}
