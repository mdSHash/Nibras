// Content snapshot (baseline part 1): everything the app shows for each event,
// person, city, Quran passage, battle replay and territory year, loaded the way
// the app loads it today. Text is stored as hashes so any wording change shows.
//
//   npx tsx scripts/baseline/content-snapshot.ts            compare with tests/baseline/content.json
//   npx tsx scripts/baseline/content-snapshot.ts --update   rewrite it (only after approval)
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { citiesData, companionsData, eraOf, eventsData, passageFor } from '../../src/data';
import generatedQuranPassages from '../../src/generated/quranPassages.json';
import { getTerritoriesForYear } from '../../src/territories';
import { isBattle, isProphetEra, isRashidunEra } from '../../src/utils/eventHelpers';
import { KB_ERA_LABEL, kbBattleId } from '../chat-kb/kbNames';
import { PANEL_BATTLE_SCENARIOS, battleScenarios } from './scenarios';
import { ROOT, hash16, sha256Hex, writeOrCompare } from './lib';

const quran = Object.fromEntries(generatedQuranPassages.map((p) => [p.key, p]));

// Copy of EventPanel.tsx:96 (arNum), used for the dates the panel displays.
const arNum = (n: number | string): string => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// The scenarios the event panel offers a replay button for (see scenarios.ts).
const AVAILABLE_BATTLE_SCENARIOS = new Set(PANEL_BATTLE_SCENARIOS);

// Copy of ttsGemini.ts:92–109: audio file name = SHA-256("<text>|<voice>|<rate>").
const audioFile = (text: string, rate: number): string =>
  `${sha256Hex(`${String(text || '').replace(/\s+/g, ' ').trim()}|Charon|${rate}`)}.wav`;
const audioExists = (file: string): boolean => existsSync(join(ROOT, 'public', 'audio', file));


const events = eventsData.map((e) => {
  const descriptionAudio = audioFile(e.fullDescription, 1);
  const titleAudio = audioFile(e.title, 1);
  return {
    id: e.id,
    title: e.title,
    // The era label events carried before Phase 1B (also the chat KB's era name).
    era: KB_ERA_LABEL[e.eraId],
    eraLabel: eraOf(e).nameAr,
    ruler: eraOf(e).rulerAr,
    category: e.categoryId,
    isBattle: isBattle(e),
    isProphetEra: isProphetEra(e),
    isRashidunEra: isRashidunEra(e),
    isMajor: e.isMajor ?? null,
    date: {
      gregorian: e.date.sortKey,
      hijri: e.date.hijri?.year ?? null,
      hijriRelative: e.date.labelAr,
      hijriDisplay: arNum(e.date.labelAr),
      gregorianDisplay: `${arNum(e.date.gregorian.year)} م`,
    },
    location: { name: e.location.nameAr, coordinates: e.location.coordinates },
    text: {
      summary: hash16(e.summary),
      fullDescription: hash16(e.fullDescription),
      courseOfEvents: e.courseOfEvents.map((step) => hash16(step)),
      durationDays: e.durationAr ?? null,
    },
    armySize: e.forces?.army?.textAr ?? null,
    enemyArmySize: e.forces?.enemyArmy?.textAr ?? null,
    keyFigures: e.keyFigures.map((k) => ({ name: k.labelAr, companionId: k.personId })),
    companionRoles: e.roles.map((r) => ({ name: r.labelAr, companionId: r.personId, role: hash16(r.roleAr) })),
    quran: e.quran.map((q) => {
      const key = passageFor(q)?.key;
      return { ref: q.labelAr, key: key ?? 'unmatched', verseText: key ? hash16(quran[key].text) : null };
    }),
    hadith: e.hadith.map((h) => hash16(h)),
    sources: e.sources.map((s) => hash16(s)),
    battle: e.battleScenarioId
      ? {
          battleId: kbBattleId(e.battleScenarioId),
          scenarioId: e.battleScenarioId,
          available: AVAILABLE_BATTLE_SCENARIOS.has(e.battleScenarioId),
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
  birthDeath: c.birthDeath,
  aliases: c.aliases,
  bio: hash16(c.bio),
}));

const quranPassages = Object.keys(quran).map((key) => ({
  id: key,
  surah: quran[key].surah,
  from: quran[key].from,
  to: quran[key].to,
  link: quran[key].link,
  text: hash16(quran[key].text),
}));

const battles = Object.entries(battleScenarios).map(([id, s]) => ({
  id,
  scenarioId: s.id,
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
const territoryYears = [...new Set([610, ...eventsData.map((e) => e.date.sortKey)])].sort((a, b) => a - b);
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
