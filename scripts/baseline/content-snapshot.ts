// Content snapshot (baseline part 1): everything the app shows for each event,
// person, city, Quran passage and territory year (battle replays are not checked), loaded the way
// the app loads it today. Text is stored as hashes so any wording change shows.
//
//   npx tsx scripts/baseline/content-snapshot.ts            compare with tests/baseline/content.json
//   npx tsx scripts/baseline/content-snapshot.ts --update   rewrite it (only after approval)
//   npx tsx scripts/baseline/content-snapshot.ts --update-narration
//       rewrite only the events' narration entries (new recordings of approved text, as the daily
//       recording run does, .github/workflows/narration.yml), then compare everything as usual
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { citiesData, eraOf, passageFor } from '../../src/data';
import { fullEvents as eventsData, fullPeople as companionsData } from '../content/generated';
import generatedQuranPassages from '../../src/generated/quranPassages.json';
import generatedBattleVideos from '../../src/generated/battleVideos.json';
import { readFileSync, writeFileSync } from 'node:fs';
import { NO_EVENT_YEAR, periodForYear } from '../../shared/territoryMap';
import type { GeneratedTerritoryMap } from '../../shared/contentSchema';
import { isBattle, isProphetEra, isRashidunEra } from '../../src/utils/eventHelpers';
import { KB_ERA_LABEL, kbBattleId } from '../chat-kb/kbNames';
import generatedNarration from '../../src/generated/narration.json';
import { narrationFileName, type GeneratedNarration, type NarrationKind } from '../../shared/narration';
import { eventSlug } from '../../shared/routes';
import { ROOT, hash16, writeOrCompare } from './lib';

const quran = Object.fromEntries(generatedQuranPassages.map((p) => [p.key, p]));

// Copy of EventPanel.tsx:96 (arNum), used for the dates the panel displays.
const arNum = (n: number | string): string => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// As src/narration.ts finds it: the fresh recording of the event's title or description, or null.
const narration: GeneratedNarration = generatedNarration;
const audioFile = (e: { id: string; slug?: string }, kind: NarrationKind): string | null => {
  const hash = narration[e.id]?.[kind];
  return hash ? narrationFileName(eventSlug(e), kind, hash) : null;
};
const audioExists = (file: string | null): boolean => file !== null && existsSync(join(ROOT, 'public', 'audio', file));

const events = eventsData.map((e) => {
  const descriptionAudio = audioFile(e, 'description');
  const titleAudio = audioFile(e, 'title');
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
          // Phase 3H: the video that opens instead of the replay, and a hash of the captions it shows.
          ...(e.battleVideo
            ? {
                video: {
                  provider: e.battleVideo.provider,
                  id: e.battleVideo.id,
                  captions: hash16(JSON.stringify(generatedBattleVideos.find((v) => v.eventId === e.id)?.captions ?? null)),
                },
              }
            : {}),
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


// What the map shows at each date the app can select: the date of each event, or the year with
// nothing selected. Each period's areas, labels and legend; geometry as a hash.
const territoryMap = JSON.parse(readFileSync(new URL('../../src/generated/territories.json', import.meta.url), 'utf8')) as GeneratedTerritoryMap;
const territoryYears = [...new Set([NO_EVENT_YEAR, ...eventsData.map((e) => e.date.sortKey)])].sort((a, b) => a - b);
const territories = territoryYears.map((year) => {
  const period = periodForYear(territoryMap, year)!;
  return {
    id: String(year),
    from: period.from,
    causes: period.causes,
    areas: period.areas.map((i) => {
      const { rings, ...shape } = territoryMap.shapes[i];
      return { ...shape, geometry: hash16(JSON.stringify(rings)) };
    }),
    labels: period.labels.map((l) => l.text),
    legend: period.legend.map((l) => l.text),
  };
});

if (process.argv.includes('--update-narration')) {
  const file = new URL('../../tests/baseline/content.json', import.meta.url);
  const committed = JSON.parse(readFileSync(file, 'utf8')) as { events: { id: string; narration: unknown }[] };
  const now = new Map(events.map((e) => [e.id, e.narration]));
  for (const e of committed.events) if (now.has(e.id)) e.narration = now.get(e.id);
  writeFileSync(file, `${JSON.stringify(committed, null, 2)}\n`);
  console.log('Updated the narration entries of tests/baseline/content.json');
}

writeOrCompare('content.json', {
  counts: {
    events: events.length,
    companions: companions.length,
    cities: citiesData.length,
    quranPassages: quranPassages.length,
  },
  events,
  companions,
  cities: citiesData,
  quranPassages,
  territories,
});
