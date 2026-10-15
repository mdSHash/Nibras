// Content snapshot (baseline part 1): everything the app shows for each event,
// person, city, Quran passage, battle replay and territory year, loaded the way
// the app loads it today. Text is stored as hashes so any wording change shows.
//
//   npx tsx scripts/baseline/content-snapshot.ts            compare with tests/baseline/content.json
//   npx tsx scripts/baseline/content-snapshot.ts --update   rewrite it (only after approval)
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { citiesData, companionsData, eventsData } from '../../src/data';
import { findCompanion } from '../../src/companionsList';
import quranData from '../../src/quranData.json';
import { getTerritoriesForYear } from '../../src/territoriesData';
import { getEraTitle, getRulerName, isBattle, isProphetEra, isRashidunEra } from '../../src/utils/eventHelpers';
import { matchQuranKey } from '../../src/utils/quranMatch';
import { resolveScenarioId } from '../../src/utils/battleScenario';
import { PANEL_BATTLE_SCENARIOS, battleScenarios } from './scenarios';
import { ROOT, hash16, sha256Hex, writeOrCompare } from './lib';

type QuranEntry = { text: string; link: string; surahNum: number; start: number; end: number };
const quran = quranData as Record<string, QuranEntry>;
const quranKeys = Object.keys(quran);

// Copy of EventPanel.tsx:96 (arNum), used for the dates the panel displays.
const arNum = (n: number | string): string => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// The scenarios the event panel offers a replay button for (see scenarios.ts).
const AVAILABLE_BATTLE_SCENARIOS = new Set(PANEL_BATTLE_SCENARIOS);

// Copy of ttsGemini.ts:92–109: audio file name = SHA-256("<text>|<voice>|<rate>").
const audioFile = (text: string, rate: number): string =>
  `${sha256Hex(`${String(text || '').replace(/\s+/g, ' ').trim()}|Charon|${rate}`)}.wav`;
const audioExists = (file: string): boolean => existsSync(join(ROOT, 'public', 'audio', file));

const person = (name: string) => ({ name, companionId: findCompanion(name)?.id ?? 'unresolved' });

const events = eventsData.map((e) => {
  const descriptionAudio = audioFile(e.details.full_description, 1);
  const titleAudio = audioFile(e.title, 1);
  const raw = e as typeof e & { date: { hijri?: unknown } };
  return {
    id: e.id,
    title: e.title,
    era: e.era,
    eraLabel: getEraTitle(e.era),
    ruler: getRulerName(e.era),
    category: e.category,
    isBattle: isBattle(e),
    isProphetEra: isProphetEra(e),
    isRashidunEra: isRashidunEra(e),
    isMajor: e.is_major_event ?? null,
    date: {
      gregorian: e.date.gregorian,
      hijri: raw.date.hijri ?? null,
      hijriRelative: e.date.hijri_relative,
      hijriDisplay: arNum(e.date.hijri_relative),
      gregorianDisplay: `${arNum(Math.floor(e.date.gregorian))} م`,
    },
    location: { name: e.location.name, coordinates: e.location.coordinates },
    text: {
      summary: hash16(e.details.summary),
      fullDescription: hash16(e.details.full_description),
      courseOfEvents: (e.details.course_of_events ?? []).map((step) => hash16(step)),
      durationDays: e.details.duration_days ?? null,
    },
    armySize: e.details.army_size ?? null,
    enemyArmySize: e.details.enemy_army_size ?? null,
    keyFigures: (e.entities.key_figures ?? []).map(person),
    companionRoles: (e.details.companion_roles ?? []).map((r) => ({ ...person(r.name), role: hash16(r.role_in_event) })),
    quran: (e.entities.quran_refs ?? []).map((ref) => {
      const key = matchQuranKey(ref, quranKeys);
      return { ref, key: key ?? 'unmatched', verseText: key ? hash16(quran[key].text) : null };
    }),
    hadith: (e.entities.hadith_refs ?? []).map((h) => hash16(h)),
    sources: (e.entities.sources ?? []).map((s) => hash16(s)),
    battle: e.battleId
      ? {
          battleId: e.battleId,
          scenarioId: resolveScenarioId(e.battleId),
          available: AVAILABLE_BATTLE_SCENARIOS.has(resolveScenarioId(e.battleId)),
        }
      : null,
    route: e.route ?? null,
    narration: {
      descriptionFile: descriptionAudio,
      descriptionExists: audioExists(descriptionAudio),
      titleFile: titleAudio,
      titleExists: audioExists(titleAudio),
    },
  };
});

const companions = companionsData.map((c) => ({
  id: c.id,
  name: c.name,
  title: c.title,
  role: hash16(c.role),
  birthDeath: c.birth_death,
  aliases: c.aliases,
  bio: hash16(c.description),
}));

const quranPassages = quranKeys.map((key) => ({
  id: key,
  surah: quran[key].surahNum,
  from: quran[key].start,
  to: quran[key].end,
  link: quran[key].link,
  text: hash16(quran[key].text),
}));

const battles = Object.entries(battleScenarios).map(([id, s]) => ({
  id,
  scenarioId: s.id,
  name: s.name,
  nameAr: s.nameAr,
  date: s.date,
  location: s.location,
  description: hash16(s.description),
  descriptionAr: hash16(s.descriptionAr),
  actualDayCount: s.actualDayCount ?? null,
  forces: s.forces.map((f) => ({
    faction: f.faction,
    label: f.label,
    labelAr: f.labelAr ?? null,
    totalStrength: f.totalStrength,
    units: f.units.length,
    soldiers: f.units.reduce((sum, u) => sum + u.soldierCount, 0),
  })),
  phases: s.phases.map((p) => p.id),
  narration: s.narration.map((n) => ({ id: n.id, time: n.time, textAr: hash16(n.textAr ?? null), text: hash16(n.text) })),
  choreography: hash16(JSON.stringify(s)),
}));

// The map draws territories for the selected event's gregorian value, or 610
// with nothing selected (Map.tsx TerritoryRenderer). Geometry is rounded so a
// build-time precompute (Phase 1) can match it.
const round = (value: unknown): unknown =>
  typeof value === 'number' ? Math.round(value * 1e4) / 1e4 : Array.isArray(value) ? value.map(round) : value;
const territoryYears = [...new Set([610, ...eventsData.map((e) => e.date.gregorian)])].sort((a, b) => a - b);
const territories = territoryYears.map((year) => ({
  id: String(year),
  groups: getTerritoriesForYear(year).map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    isEmpire: g.isEmpire ?? null,
    specificName: g.specificName ?? null,
    polygons: g.polygons.length,
    geometry: hash16(JSON.stringify(round(g.polygons.map((p) => p.coordinates)))),
  })),
}));

writeOrCompare('content.json', {
  counts: {
    events: events.length,
    companions: companions.length,
    cities: citiesData.length,
    quranPassages: quranPassages.length,
    battles: battles.length,
  },
  events,
  companions,
  cities: citiesData,
  quranPassages,
  battles,
  territories,
});
