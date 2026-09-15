/**
 * Cross-record list units, so "which battles happened under Umar?" or
 * "where is Khalid mentioned?" can be answered from one unit. Lists say
 * "من" (some of / among) and never state a total: Nibras does not cover every
 * historical event, so a count drawn from it could be historically wrong.
 */
import { ERA_LABELS, type EraKey, type KbRecord } from '../../shared/chatKb';
import type { CompanionData } from '../../src/companionsList';
import { bare, BuildContext } from './common';

const ERA_ALIASES: Record<EraKey, string[]> = {
  meccan: ['العهد المكي', 'الفترة المكية', 'المرحلة المكية'],
  medinan: ['العهد المدني', 'الفترة المدنية', 'المرحلة المدنية'],
  abuBakr: ['عهد أبي بكر', 'خلافة أبي بكر', 'عهد الصديق', 'خلافة الصديق', 'عهد أبي بكر الصديق', 'خلافة أبي بكر الصديق'],
  umar: ['عهد عمر', 'خلافة عمر', 'عهد الفاروق', 'خلافة الفاروق', 'عهد عمر بن الخطاب', 'خلافة عمر بن الخطاب'],
  uthman: ['عهد عثمان', 'خلافة عثمان', 'عهد ذي النورين', 'خلافة ذي النورين', 'عهد عثمان بن عفان', 'خلافة عثمان بن عفان'],
  ali: ['عهد علي', 'خلافة علي', 'عهد الإمام علي', 'خلافة الإمام علي', 'عهد علي بن أبي طالب', 'خلافة علي بن أبي طالب'],
};

export function addListUnits(
  ctx: BuildContext,
  eventRecords: KbRecord[],
  companions: CompanionData[],
  companionEvents: Map<string, Set<string>>
): KbRecord[] {
  const records: KbRecord[] = [];
  const titleOf = new Map(eventRecords.map(r => [r.id, r.title]));

  const addEraList = (id: string, label: string, aliases: string[], events: KbRecord[]) => {
    const recordId = `list:${id}`;
    const battles = events.filter(e => e.isBattle).map(e => bare(e.title));
    const others = events.filter(e => !e.isBattle).map(e => bare(e.title));
    if (battles.length > 0) {
      ctx.add({ recordId, slug: 'battles', kind: 'list', text: undefined, list: { heading: `من الغزوات والمعارك في ${label} في نبراس`, items: battles }, refs: {} });
    }
    if (others.length > 0) {
      ctx.add({ recordId, slug: 'events', kind: 'list', text: undefined, list: { heading: `من الأحداث الأخرى في ${label} في نبراس`, items: others }, refs: {} });
    }
    records.push({ id: recordId, type: 'list', title: label, refs: {}, aliases, weakAliases: [] });
  };

  for (const key of Object.keys(ERA_LABELS) as EraKey[]) {
    addEraList(`era:${key}`, ERA_LABELS[key], ERA_ALIASES[key], eventRecords.filter(r => r.eraKey === key));
  }
  addEraList(
    'era:prophet',
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
      list: { heading: `ورد ذكر ${bare(companion.name)} في نبراس في`, items: events },
      refs: { companionId: companion.id },
    });
  }

  return records;
}
