/**
 * Cross-record list units, so "which battles happened under Umar?" or
 * "where is Khalid mentioned?" can be answered from one unit. Lists say
 * "من" (some of / among) and never state a total: Nibras does not cover every
 * historical event, so a count drawn from it could be historically wrong.
 *
 * Military lists follow the terminology rule: غزوات only for the Prophet's
 * own campaigns, سرايا for expeditions he sent, معارك وفتوح after him.
 */
import { ERA_LABELS, type EraKey, type KbRecord, type MilitaryKind } from '../../shared/chatKb';
import type { CompanionData } from '../../src/companionsList';
import { genitiveName } from '../../shared/arabicGrammar';
import { bare, BuildContext } from './common';

const ERA_ALIASES: Record<EraKey, string[]> = {
  meccan: ['العهد المكي', 'الفترة المكية', 'المرحلة المكية'],
  medinan: ['العهد المدني', 'الفترة المدنية', 'المرحلة المدنية'],
  abuBakr: ['عهد أبي بكر', 'خلافة أبي بكر', 'عهد الصديق', 'خلافة الصديق', 'عهد أبي بكر الصديق', 'خلافة أبي بكر الصديق'],
  umar: ['عهد عمر', 'خلافة عمر', 'عهد الفاروق', 'خلافة الفاروق', 'عهد عمر بن الخطاب', 'خلافة عمر بن الخطاب'],
  uthman: ['عهد عثمان', 'خلافة عثمان', 'عهد ذي النورين', 'خلافة ذي النورين', 'عهد عثمان بن عفان', 'خلافة عثمان بن عفان'],
  ali: ['عهد علي', 'خلافة علي', 'عهد الإمام علي', 'خلافة الإمام علي', 'عهد علي بن أبي طالب', 'خلافة علي بن أبي طالب'],
};

/** Companion record of each era's ruler — lets "أيام عمر" / "زمن النبي" find the era. */
const ERA_RULERS: Partial<Record<EraKey | 'prophet', string>> = {
  prophet: 'companion:prophet-muhammad',
  abuBakr: 'companion:abu-bakr',
  umar: 'companion:umar',
  uthman: 'companion:uthman',
  ali: 'companion:ali',
};

// `label` is null for the whole Prophet's era, where "في عهد النبي ﷺ" would repeat the heading.
const MILITARY_LISTS: { kind: MilitaryKind; slug: string; heading: (label: string | null) => string }[] = [
  { kind: 'ghazwa', slug: 'ghazawat', heading: label => (label ? `من غزوات النبي ﷺ في ${label} في نبراس` : 'من غزوات النبي ﷺ في نبراس') },
  { kind: 'sariyya', slug: 'saraya', heading: label => `من السرايا والبعوث التي لم يشهدها النبي ﷺ${label ? ` في ${label}` : ''} في نبراس` },
  { kind: 'harb', slug: 'wars', heading: label => `من الحروب في ${label ?? 'حياة النبي ﷺ'} في نبراس` },
  { kind: 'maaraka', slug: 'battles', heading: label => `من المعارك والفتوح في ${label} في نبراس` },
];

export function addListUnits(
  ctx: BuildContext,
  eventRecords: KbRecord[],
  companions: CompanionData[],
  companionEvents: Map<string, Set<string>>
): KbRecord[] {
  const records: KbRecord[] = [];
  const titleOf = new Map(eventRecords.map(r => [r.id, r.title]));
  const companionIds = new Set(companions.map(c => `companion:${c.id}`));

  const addEraList = (id: string, eraKey: EraKey | 'prophet', label: string, aliases: string[], events: KbRecord[]) => {
    const recordId = `list:${id}`;
    for (const { kind, slug, heading } of MILITARY_LISTS) {
      const items = events.filter(e => e.military === kind).map(e => bare(e.title));
      if (items.length > 0) ctx.add({ recordId, slug, kind: 'list', text: undefined, list: { heading: heading(eraKey === 'prophet' ? null : label), items }, refs: {} });
    }
    const others = events.filter(e => !e.military).map(e => bare(e.title));
    if (others.length > 0) {
      ctx.add({ recordId, slug: 'events', kind: 'list', text: undefined, list: { heading: `من الأحداث الأخرى في ${label} في نبراس`, items: others }, refs: {} });
    }
    const ruler = ERA_RULERS[eraKey];
    if (ruler && !companionIds.has(ruler)) ctx.issue('warning', recordId, `era ruler record ${ruler} not found`);
    records.push({
      id: recordId,
      type: 'list',
      title: label,
      refs: {},
      aliases,
      weakAliases: [],
      ...(ruler && companionIds.has(ruler) && eraKey !== 'meccan' && eraKey !== 'medinan' ? { rulerRecordId: ruler } : {}),
    });
  };

  for (const key of Object.keys(ERA_LABELS) as EraKey[]) {
    addEraList(`era:${key}`, key, ERA_LABELS[key], ERA_ALIASES[key], eventRecords.filter(r => r.eraKey === key));
  }
  addEraList(
    'era:prophet',
    'prophet',
    'عهد النبي ﷺ',
    ['عهد النبي', 'العهد النبوي', 'زمن النبي', 'حياة النبي', 'عهد الرسول', 'غزوات النبي', 'غزوات الرسول'],
    eventRecords.filter(r => r.eraKey === 'meccan' || r.eraKey === 'medinan')
  );

  // Titles are written both "أم المؤمنين" and "من أمهات المؤمنين" (Umm Habiba).
  const mothers = companions
    .filter(c => c.title === 'أم المؤمنين' || c.title.includes('أمهات المؤمنين'))
    .map(c => c.name);
  if (mothers.length > 0) {
    const recordId = 'list:mothers-of-the-believers';
    ctx.add({ recordId, slug: 'names', kind: 'list', text: undefined, list: { heading: 'أمهات المؤمنين المذكورات في نبراس', items: mothers }, refs: {} });
    records.push({
      id: recordId,
      type: 'list',
      title: 'أمهات المؤمنين',
      refs: {},
      aliases: ['أمهات المؤمنين', 'أم المؤمنين', 'زوجات النبي', 'زوجات الرسول', 'أزواج النبي'],
      weakAliases: [],
    });
  }

  const caliphsId = 'list:rashidun-caliphs';
  ctx.add({
    recordId: caliphsId,
    slug: 'names',
    kind: 'list',
    text: undefined,
    list: { heading: 'الخلفاء الراشدون بالترتيب في نبراس', items: ['أبو بكر الصديق', 'عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب'] },
    refs: {},
  });
  records.push({
    id: caliphsId,
    type: 'list',
    title: 'الخلفاء الراشدون',
    refs: {},
    aliases: ['الخلفاء الراشدون', 'الخلفاء الراشدين', 'الخلافة الراشدة', 'الخليفة الأول', 'الخليفة الثاني', 'الخليفة الثالث', 'الخليفة الرابع'],
    weakAliases: [],
  });

  for (const companion of companions) {
    const events = [...(companionEvents.get(companion.id) ?? [])]
      .map(id => titleOf.get(id))
      .filter((title): title is string => !!title)
      .map(bare);
    if (events.length === 0) continue;
    ctx.add({
      recordId: `companion:${companion.id}`,
      slug: 'events',
      kind: 'companion_events',
      text: undefined,
      list: { heading: `ورد ذكر ${genitiveName(bare(companion.name))} في نبراس في`, items: events },
      refs: { companionId: companion.id },
    });
  }

  return records;
}
