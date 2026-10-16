/**
 * One-off migration (Phase 1): reads today's content files and writes content/.
 *
 *   npx tsx scripts/migrate-content.ts
 *
 * Re-runnable: it rewrites content/events, content/people, content/cities and the
 * fixed lists from the old files each time. Text is copied verbatim. Anything it
 * cannot map with certainty goes into docs/CONTENT_MIGRATION_REPORT.md for
 * Mostafa instead of being guessed. Removed in Phase 1C with the old files.
 *
 * content/ has been the source of truth since Phase 1A and has been edited since
 * (see docs/REFACTOR_PROGRESS.md), so the script refuses to overwrite it unless
 * run with --force.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import rawEvents from '../src/dataList.json';
import { eventsData, type EventItem } from '../src/legacyData';
import { companionsData, findCompanion, findCompanionCandidates } from '../src/companionsList';
import { citiesData } from '../src/citiesList';
import quranData from '../src/quranData.json';
import { getEraTitle, getRulerName } from '../src/utils/eventHelpers';
import { normalizeArabic } from '../shared/searchNormalize';
import { getEraKey } from '../src/utils/eraColors';
import { matchQuranKey } from '../src/utils/quranMatch';
import { resolveScenarioId } from '../src/utils/battleScenario';
import { battleScenarios } from './baseline/scenarios';
import { ROOT } from './baseline/lib';
import type { Category, ContentEvent, Count, Era, EventIcon, Person, QuranPassage } from '../shared/contentSchema';

const CONTENT = join(ROOT, 'content');
if (existsSync(join(CONTENT, 'events')) && !process.argv.includes('--force')) {
  console.error('content/ exists and is the source of truth; edits made there would be lost. Run with --force to overwrite.');
  process.exit(1);
}
const report: string[] = [];
const fail = (message: string): never => {
  throw new Error(message);
};

function writeJson(path: string, data: unknown): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

// ─── Eras ───────────────────────────────────────────────────────────────────
// Every spelling found in the data, mapped to one era id.
const ERA_IDS: Record<string, string> = {
  'العهد المكي': 'meccan',
  'العهد المدني': 'medinan',
  'أبو بكر الصديق': 'abu-bakr',
  'عهد أبي بكر الصديق': 'abu-bakr',
  'عمر بن الخطاب': 'umar',
  'عهد عثمان بن عفان': 'uthman',
  'عهد علي بن أبي طالب': 'ali',
};

// Copy of getEraTheme's title in src/components/EventPanel.tsx (the panel badge).
function panelTitle(era: string): string {
  if (era.includes('المكي') || era.includes('المدني')) return 'عهد النبوة';
  return getEraTitle(era);
}

const eras: Era[] = [];
for (const [label, id] of Object.entries(ERA_IDS)) {
  if (eras.some(era => era.id === id)) continue;
  const prophet = id === 'meccan' || id === 'medinan';
  eras.push({
    id,
    nameAr: getEraTitle(label),
    panelTitleAr: panelTitle(label),
    rulerAr: getRulerName(label),
    colorKey: getEraKey(label) as Era['colorKey'],
    group: prophet ? 'prophet' : 'rashidun',
    order: eras.length + 1,
  });
}

// ─── Categories ─────────────────────────────────────────────────────────────
// Marker colours from iconConfig in src/components/Map.tsx; names from the help
// window legend (src/components/HelpModal.tsx). Categories without a colour of
// their own were drawn in the أحداث colour, so they join "events".
const categories: Category[] = [
  { id: 'battle', nameAr: 'المعارك والغزوات', color: '#ef4444' },
  { id: 'migration', nameAr: 'الهجرات والانتقالات', color: '#10b981' },
  { id: 'revelation', nameAr: 'الوحي والبعثة', color: '#f59e0b' },
  { id: 'landmark', nameAr: 'المعالم والأماكن', color: '#3b82f6' },
  { id: 'treaty', nameAr: 'المعاهدات والصلح', color: '#8b5cf6' },
  { id: 'politics', nameAr: 'الأحداث السياسية', color: '#6366f1' },
  { id: 'events', nameAr: 'الأحداث العامة', color: '#06b6d4' },
];
const CATEGORY_IDS: Record<string, string> = {
  battle: 'battle',
  'غزوات ومعارك': 'battle',
  migration: 'migration',
  revelation: 'revelation',
  landmark: 'landmark',
  treaty: 'treaty',
  politics: 'politics',
  أحداث: 'events',
  فتوحات: 'events',
  'إنجازات حضارية': 'events',
  'أحداث سياسية': 'events',
};

// Copy of the old isBattle in src/utils/eventHelpers.ts: the category, or the title's first word.
const BATTLE_CATEGORIES = new Set(['battle', 'معركة', 'غزوات ومعارك', 'فتوحات']);
const BATTLE_TITLE_HEADS = new Set(['غزوه', 'سريه', 'معركه', 'موقعه', 'فتح']);
function isBattle(event: EventItem): boolean {
  if (BATTLE_CATEGORIES.has(event.category)) return true;
  const title = normalizeArabic(event.title);
  return BATTLE_TITLE_HEADS.has(title.split(' ')[0]) || /^(اعاده|اتمام|بدايه) (فتح|حروب)/.test(title);
}

// Copy of getCategoryIcon in src/components/Map.tsx: the icon today's title matching picks.
function iconFor(category: string, title: string): EventIcon {
  const has = (...words: string[]) => words.some(word => title.includes(word));
  if (has('وفاة', 'استشهاد')) return 'skull';
  if (has('خلافة', 'تولي', 'عاصمة')) return 'crown';
  if (category === 'battle' || has('معركة', 'موقعة', 'يوم', 'غزوة', 'حروب')) return 'swords';
  if (has('فتح')) return 'flag';
  if (has('مصحف', 'قرآن', 'وحي')) return 'book';
  if (category === 'treaty' || has('صلح', 'وثيقة', 'بيعة')) return 'scroll';
  if (category === 'migration' || has('هجرة', 'انتقال')) return 'tent';
  return 'pin';
}

// ─── Force sizes ────────────────────────────────────────────────────────────
const TASHKEEL = /[ً-ْٰـ]/g;
const toLatinDigits = (s: string): string => s.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
// Whole words that change what the number means; such sizes stay text only.
const QUALIFIERS = new Set(
  'أكثر اكثر أقل اقل بضع بضعة نيف نيفا يزيد تزيد ثم وقيل ألف ألفا الف الفا آلاف الاف مئة مائة مئات عشرات'.split(' '),
);
const APPROX = /حوال|نحو|قراب|زهاء|تقريب|يقارب/;

function parseCount(textAr: string): { count: Count; parsed: boolean } {
  const plain = toLatinDigits(textAr.replace(TASHKEEL, '')).replace(/(\d),(\d{3})/g, '$1$2');
  const numbers = (plain.match(/\d+/g) ?? []).map(Number);
  const approx = APPROX.test(plain) ? { approx: true } : {};
  if (!plain.split(/[\s()،,]+/).some(word => QUALIFIERS.has(word))) {
    if (numbers.length === 1) return { count: { textAr, value: numbers[0], ...approx }, parsed: true };
    const range = /(\d+)\s*(?:إلى|الى|-|–)\s*(\d+)/.exec(plain);
    if (numbers.length === 2 && range) {
      return { count: { textAr, min: Number(range[1]), max: Number(range[2]), ...approx }, parsed: true };
    }
  }
  return { count: { textAr }, parsed: false };
}

// ─── Events ─────────────────────────────────────────────────────────────────
type RawEvent = (typeof rawEvents)[number] & { date: { hijri?: number } };
const quran = quranData as Record<string, { surahNum: number; start: number; end: number }>;
const quranKeys = Object.keys(quran);
const passages: QuranPassage[] = quranKeys.map(key => ({
  key,
  surah: quran[key].surahNum,
  from: quran[key].start,
  to: quran[key].end,
}));
const passageId = (p: { surah: number; from: number; to: number }) => `${p.surah}:${p.from}-${p.to}`;
if (new Set(passages.map(passageId)).size !== passages.length) fail('two Quran passages share a verse range');

const ambiguousPeople: string[] = [];
const unparsedForces: string[] = [];
const noHijri: string[] = [];

function personRef(event: EventItem, labelAr: string): string {
  const person = findCompanion(labelAr) ?? fail(`${event.id}: no person for "${labelAr}"`);
  const candidates = findCompanionCandidates(labelAr);
  if (candidates.length > 1) {
    ambiguousPeople.push(
      `| \`${event.id}\` | ${labelAr} | \`${person.id}\` | ${candidates.map(c => `\`${c.id}\``).join(', ')} |`,
    );
  }
  return person.id;
}

function forceCount(event: EventItem, field: string, textAr: string | undefined): Count | undefined {
  if (textAr === undefined) return undefined;
  const { count, parsed } = parseCount(textAr);
  if (!parsed) unparsedForces.push(`| \`${event.id}\` | ${field} | ${textAr} |`);
  return count;
}

const raw = rawEvents as RawEvent[];
const sortKeyCount = new Map<number, number>();
for (const e of raw) sortKeyCount.set(e.date.gregorian, (sortKeyCount.get(e.date.gregorian) ?? 0) + 1);
const tieSeen = new Map<number, number>();
const ties: string[] = [];

const events: ContentEvent[] = eventsData.map((event, index) => {
  const source = raw[index];
  if (source.id !== event.id) fail(`event order differs at ${index}`);
  const eraId = ERA_IDS[event.era] ?? fail(`${event.id}: unknown era "${event.era}"`);
  const categoryId = CATEGORY_IDS[event.category] ?? fail(`${event.id}: unknown category "${event.category}"`);
  const sortKey = event.date.gregorian;
  let tieOrder: number | undefined;
  if ((sortKeyCount.get(sortKey) ?? 0) > 1) {
    tieOrder = tieSeen.get(sortKey) ?? 0;
    tieSeen.set(sortKey, tieOrder + 1);
    ties.push(`| ${sortKey} | ${tieOrder} | \`${event.id}\` |`);
  }
  if (source.date.hijri === undefined) noHijri.push(`| \`${event.id}\` | ${event.date.hijri_relative} |`);

  const army = forceCount(event, 'army', event.details.army_size);
  const enemyArmy = forceCount(event, 'enemyArmy', event.details.enemy_army_size);

  const quranRefs = (event.entities.quran_refs ?? []).map(labelAr => {
    const key = matchQuranKey(labelAr, quranKeys) ?? fail(`${event.id}: no Quran passage for "${labelAr}"`);
    return { surah: quran[key].surahNum, from: quran[key].start, to: quran[key].end, labelAr };
  });

  const battleScenarioId = event.battleId ? resolveScenarioId(event.battleId) : undefined;
  if (battleScenarioId && !battleScenarios[battleScenarioId]) fail(`${event.id}: no scenario ${battleScenarioId}`);

  // Key order here is the field order in every event file.
  const out: ContentEvent = {
    id: event.id,
    eraId,
    categoryId,
    isBattle: isBattle(event),
    icon: iconFor(event.category, event.title),
    ...(event.is_major_event !== undefined ? { isMajor: event.is_major_event } : {}),
    title: event.title,
    date: {
      sortKey,
      ...(tieOrder !== undefined ? { tieOrder } : {}),
      gregorian: { year: Math.floor(sortKey) },
      ...(source.date.hijri !== undefined ? { hijri: { year: source.date.hijri } } : {}),
      labelAr: event.date.hijri_relative,
    },
    location: { nameAr: event.location.name, coordinates: event.location.coordinates },
    summary: event.details.summary,
    fullDescription: event.details.full_description,
    courseOfEvents: event.details.course_of_events ?? [],
    ...(event.details.duration_days !== undefined ? { durationAr: event.details.duration_days } : {}),
    ...(army || enemyArmy ? { forces: { ...(army ? { army } : {}), ...(enemyArmy ? { enemyArmy } : {}) } } : {}),
    keyFigures: (event.entities.key_figures ?? []).map(labelAr => ({ personId: personRef(event, labelAr), labelAr })),
    roles: (event.details.companion_roles ?? []).map(r => ({
      personId: personRef(event, r.name),
      labelAr: r.name,
      roleAr: r.role_in_event,
    })),
    quran: quranRefs,
    hadith: event.entities.hadith_refs ?? [],
    sources: event.entities.sources ?? [],
    ...(battleScenarioId ? { battleScenarioId } : {}),
    ...(event.route ? { route: event.route } : {}),
  };
  return out;
});

// ─── People and cities ──────────────────────────────────────────────────────
const people: Person[] = companionsData.map(c => ({
  id: c.id,
  name: c.name,
  title: c.title,
  role: c.role,
  bio: c.description,
  birthDeath: c.birth_death,
  aliases: c.aliases,
}));

// ─── Event vs replay numbers (Decision 2 in the plan) ──────────────────────
const battleNumbers: string[] = [];
for (const event of events) {
  if (!event.battleScenarioId) continue;
  const scenario = battleScenarios[event.battleScenarioId];
  const side = (muslim: boolean) =>
    scenario.forces
      .filter(f => (f.faction === 'muslim') === muslim)
      .map(f => f.totalStrength.toLocaleString('en'))
      .join(' + ') || '—';
  battleNumbers.push(
    `| \`${event.id}\` | ${event.forces?.army?.textAr ?? '—'} | ${side(true)} | ` +
      `${event.forces?.enemyArmy?.textAr ?? '—'} | ${side(false)} | ${event.durationAr ?? '—'} | ${scenario.actualDayCount ?? '—'} |`,
  );
}

// ─── Write ──────────────────────────────────────────────────────────────────
for (const dir of ['events', 'people', 'cities']) rmSync(join(CONTENT, dir), { recursive: true, force: true });
writeJson(join(CONTENT, 'eras.json'), eras);
writeJson(join(CONTENT, 'categories.json'), categories);
for (const event of events) writeJson(join(CONTENT, 'events', `${event.id}.json`), event);
for (const person of people) writeJson(join(CONTENT, 'people', `${person.id}.json`), person);
// The curated order of people (most prominent first): chat question suggestions follow it.
writeJson(
  join(CONTENT, 'people-order.json'),
  people.map(p => p.id),
);
for (const city of citiesData) writeJson(join(CONTENT, 'cities', `${city.id}.json`), city);
writeJson(join(CONTENT, 'quran', 'passages.json'), passages);

const legacyCategories = Object.entries(CATEGORY_IDS)
  .map(([label, id]) => `| ${label} | \`${id}\` | ${raw.filter(e => e.category === label).length} |`)
  .join('\n');
const legacyEras = Object.entries(ERA_IDS)
  .map(([label, id]) => `| ${label} | \`${id}\` | ${raw.filter(e => e.era === label).length} |`)
  .join('\n');

report.push(
  '# Content migration report (Phase 1)',
  '',
  'Written by `scripts/migrate-content.ts`. Lists what the migration could not decide on its own.',
  'Nothing here was guessed: each record keeps what the app showed before the migration.',
  'This is the record as of the migration (1A); decisions taken since are in `docs/REFACTOR_PROGRESS.md`.',
  '',
  `Migrated ${events.length} events, ${people.length} people, ${citiesData.length} cities, ` +
    `${passages.length} Quran passages, ${eras.length} eras, ${categories.length} categories.`,
  '',
  '## 1. People names that match more than one person',
  '',
  'The app opens the first match. For Mostafa: confirm or name the right person for each row.',
  '',
  '| Event | Name shown | Opens today | All matches |',
  '| --- | --- | --- | --- |',
  ...(ambiguousPeople.length ? ambiguousPeople : ['| — | — | — | — |']),
  '',
  '## 2. Event and replay numbers that differ',
  '',
  'Event text (army size, duration) next to the replay scenario figures (strength, day count).',
  'For Mostafa: which figure to trust (plan, Decision 2). Nothing is changed until then.',
  '',
  '| Event | Army (event) | Muslims (replay) | Enemy (event) | Enemy (replay) | Duration (event) | Days (replay) |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...battleNumbers,
  '',
  '## 3. Force sizes kept as text only',
  '',
  'The text has no single plain number (several numbers, words such as "ألف" or "أكثر من", or none).',
  'The text is kept; a number can be added by hand later.',
  '',
  '| Event | Field | Text |',
  '| --- | --- | --- |',
  ...unparsedForces,
  '',
  `## 4. Events without a Hijri year (${noHijri.length})`,
  '',
  'The old data had a Hijri year for the other events only. The date label is kept as it was.',
  '',
  '| Event | Date label |',
  '| --- | --- |',
  ...noHijri,
  '',
  '## 5. Events that share a date (`tieOrder`)',
  '',
  'They keep their order on the timeline through `date.tieOrder`.',
  '',
  '| sortKey | tieOrder | Event |',
  '| --- | --- | --- |',
  ...ties,
  '',
  '## 6. Spellings merged into one id',
  '',
  'Not visible: the era badge, colours and markers stay the same.',
  '',
  '| Era as written | Era id | Events |',
  '| --- | --- | --- |',
  legacyEras,
  '',
  '| Category as written | Category id | Events |',
  '| --- | --- | --- |',
  legacyCategories,
  '',
);
writeFileSync(join(ROOT, 'docs', 'CONTENT_MIGRATION_REPORT.md'), report.join('\n'));

console.log(
  `Wrote content/: ${events.length} events, ${people.length} people, ${citiesData.length} cities, ` +
    `${passages.length} passages. Report: ${ambiguousPeople.length} ambiguous names, ` +
    `${unparsedForces.length} text-only force sizes, ${noHijri.length} without Hijri year, ${ties.length} tied dates.`,
);
