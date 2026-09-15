/**
 * Companion, city, Qur'an verse and battle-scenario records.
 */
import type { KbRecord } from '../../shared/chatKb';
import type { CityData } from '../../src/citiesList';
import type { CompanionData } from '../../src/companionsList';
import type { BattleScenario } from '../../src/battlefield/types/scenario';
import { aliasForm, bare, BuildContext, mentionsQuantity, splitSentences } from './common';
import { verifyQuranEntry, type QuranEntry } from './quranVerify';

export function addCompanionUnits(ctx: BuildContext, companions: CompanionData[]): KbRecord[] {
  const titleCount = new Map<string, number>();
  for (const c of companions) titleCount.set(c.title, (titleCount.get(c.title) ?? 0) + 1);

  return companions.map(companion => {
    const recordId = `companion:${companion.id}`;
    const refs = { companionId: companion.id };
    // Descriptive titles ("من أمهات المؤمنين", "من الخوارج") describe a group,
    // not a person, so they never identify a single companion.
    const titleIsUnique = companion.title && titleCount.get(companion.title) === 1 && !companion.title.startsWith('من ');
    const aliases = new Set([companion.name, ...companion.aliases].map(aliasForm).filter(a => a.length >= 2));
    if (titleIsUnique) aliases.add(aliasForm(companion.title));
    // "النبي" / "رسول الله" appear in most questions as context ("صاحب النبي
    // في الغار"), not as the subject; as strong links they flooded the
    // evidence with the Prophet's biography.
    const weak = new Set<string>();
    for (const alias of aliases) {
      if (GENERIC_REFERENCES.has(alias)) {
        aliases.delete(alias);
        weak.add(alias);
      }
    }

    const profile = [companion.title, companion.role].filter(Boolean).join(' — ');
    const lifespan = companion.birth_death ? ` (${companion.birth_death})` : '';
    ctx.add({ recordId, slug: 'profile', kind: 'companion_profile', text: `${companion.name}: ${profile}${lifespan}`, refs });
    splitSentences(companion.description).forEach((sentence, i) =>
      ctx.add({ recordId, slug: `bio:${i}`, kind: 'companion_bio', text: sentence, refs })
    );

    return {
      id: recordId,
      type: 'companion' as const,
      title: companion.name,
      refs,
      aliases: [...aliases],
      weakAliases: [...weak, ...(companion.title && !titleIsUnique ? [aliasForm(companion.title)] : [])],
    };
  });
}

const GENERIC_REFERENCES = new Set(['النبي', 'الرسول', 'رسول الله', 'محمد', 'المصطفى']);

export function addCityUnits(ctx: BuildContext, cities: CityData[]): KbRecord[] {
  return cities.map(city => {
    const recordId = `city:${city.id}`;
    const refs = { cityId: city.id };
    ctx.add({ recordId, slug: 'description', kind: 'city', text: `${city.name}: ${city.description}`, refs });
    ctx.add({ recordId, slug: 'significance', kind: 'city', text: `مكانة ${city.name}: ${city.significance}`, refs });
    const aliases = new Set([aliasForm(city.name), aliasForm(city.name.replace(/\([^)]*\)/g, ' '))]);
    for (const inner of city.name.matchAll(/\(([^)]*)\)/g)) aliases.add(aliasForm(inner[1]));
    return { id: recordId, type: 'city' as const, title: city.name, refs, aliases: [...aliases], weakAliases: [] };
  });
}

export function addQuranUnits(
  ctx: BuildContext,
  quranData: Record<string, QuranEntry>,
  quranEvents: Map<string, Set<string>>,
  eventTitle: (recordId: string) => string
): KbRecord[] {
  const records: KbRecord[] = [];
  for (const [key, entry] of Object.entries(quranData)) {
    const recordId = `quran:${key}`;
    const verdict = verifyQuranEntry(entry, ctx.uthmani);
    if (!verdict.ok) {
      ctx.issue('error', recordId, `verse text does not match Tanzil — excluded from chat: ${verdict.detail}`);
      continue;
    }
    const refs = { quranKey: key };
    ctx.add({ recordId, slug: 'text', kind: 'quran_verse', text: entry.text, refs, verbatimOnly: true });
    const events = [...(quranEvents.get(key) ?? [])].map(eventTitle);
    if (events.length > 0) {
      ctx.add({ recordId, slug: 'events', kind: 'event_quran', text: undefined, list: { heading: `الأحداث المرتبطة بـ«${key}»`, items: events.map(bare) }, refs });
    }
    const surah = aliasForm(key.split(':')[0]);
    records.push({ id: recordId, type: 'quran', title: key, refs, aliases: [aliasForm(key)], weakAliases: [surah] });
  }
  return records;
}

/**
 * Battle scenarios are narrative companions to the event records. Per the
 * project's data-trust rule, event details win: any scenario sentence that
 * states a quantity (troop counts, casualties, dates as numbers) is left out
 * when an event record covers the same battle, so the chat can never present
 * a conflicting figure. Simulation-only fields (unit strengths, positions)
 * and English-only fields are never used.
 */
export function addBattleUnits(
  ctx: BuildContext,
  scenarios: BattleScenario[],
  eventRecordForBattle: (battleId: string) => KbRecord | undefined
): KbRecord[] {
  const records: KbRecord[] = [];
  let droppedForQuantity = 0;

  for (const scenario of scenarios) {
    const battleId = scenario.id.replace(/^battle-of-/, '').replace(/^conquest-of-mecca$/, 'fath-makkah');
    const recordId = `battle:${battleId}`;
    const refs = { battleId };
    const eventRecord = eventRecordForBattle(battleId);
    if (!eventRecord) ctx.issue('warning', recordId, 'no event record carries this battleId');
    // The simulation's short name ("غزوة بدر") must find the event record too,
    // not only the simulation.
    else if (!eventRecord.aliases.includes(aliasForm(scenario.nameAr))) eventRecord.aliases.push(aliasForm(scenario.nameAr));
    const keep = (text: string | undefined): text is string => {
      if (!text) return false;
      if (eventRecord && mentionsQuantity(text)) {
        droppedForQuantity++;
        return false;
      }
      return true;
    };
    const name = scenario.nameAr;
    const secondary = { trust: 'secondary' as const, refs };

    splitSentences(scenario.descriptionAr).filter(keep).forEach((s, i) =>
      ctx.add({ recordId, slug: `description:${i}`, kind: 'battle_description', text: `${bare(name)}: ${s}`, ...secondary })
    );
    const phases = scenario.phases.map(p => p.nameAr).filter(keep);
    if (phases.length > 0) {
      ctx.add({ recordId, slug: 'phases', kind: 'battle_phases', text: undefined, list: { heading: `مراحل ${bare(name)} في المحاكاة`, items: phases }, ...secondary });
    }
    scenario.narration.forEach((point, i) => {
      splitSentences(point.textAr).filter(keep).forEach((s, j) =>
        ctx.add({ recordId, slug: `narration:${i}:${j}`, kind: 'battle_narration', text: s, ...secondary })
      );
    });
    splitSentences(scenario.outcome.summaryAr).filter(keep).forEach((s, i) =>
      ctx.add({ recordId, slug: `outcome:${i}`, kind: 'battle_outcome', text: `نتيجة ${bare(name)}: ${s}`, ...secondary })
    );
    splitSentences(scenario.outcome.significanceAr).filter(keep).forEach((s, i) =>
      ctx.add({ recordId, slug: `significance:${i}`, kind: 'battle_outcome', text: `أهمية ${bare(name)}: ${s}`, ...secondary })
    );
    const landmarks = scenario.map.landmarks.map(l => l.labelAr).filter(keep);
    if (landmarks.length > 0) {
      ctx.add({ recordId, slug: 'landmarks', kind: 'battle_landmarks', text: undefined, list: { heading: `من مواقع ${bare(name)}`, items: landmarks }, ...secondary });
    }

    records.push({
      id: recordId,
      type: 'battle',
      title: name,
      era: eventRecord?.era,
      eraKey: eventRecord?.eraKey,
      refs,
      aliases: [...new Set([aliasForm(name), ...(eventRecord?.aliases ?? [])])],
      weakAliases: [],
    });
  }
  ctx.issue('warning', 'battle-scenarios', `${droppedForQuantity} scenario sentences stating quantities were left out (event records are authoritative for figures)`);
  return records;
}
