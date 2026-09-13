/**
 * Build the retrieval corpus for the in-app chatbot.
 *
 * Resolves the app's fuzzy, string-based cross-entity links (event -> companion,
 * event -> Qur'an ref, event -> battle scenario) once, offline, using the app's
 * own production logic (findCompanion, matchQuranKey, the BATTLE_ID_MAP baked
 * into eventsData), so the serverless chat function never has to re-derive
 * fuzzy joins per request.
 *
 * Usage: npm run build:corpus
 * Output: public/data/chat-corpus.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { eventsData, citiesData, companionsData } from '../src/data';
import { findCompanion } from '../src/companionsList';
import quranData from '../src/quranData.json';
import { matchQuranKey } from '../src/utils/quranMatch';
import { normalizeArabic } from '../shared/searchNormalize';
import { scenarios } from '../src/battlefield/scenarios/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ChunkType =
  | 'event_summary'
  | 'event_course_step'
  | 'companion'
  | 'city'
  | 'quran_ref'
  | 'battle_narration'
  | 'battle_outcome';

interface CorpusChunk {
  id: string;
  type: ChunkType;
  text: string;
  normalizedText: string;
  era?: string;
  entityRefs: {
    eventId?: string;
    companionId?: string;
    quranKey?: string;
    battleId?: string;
    cityId?: string;
  };
  sourceLabel: string;
}

const chunks: CorpusChunk[] = [];
const unresolvedKeyFigures = new Set<string>();
const unresolvedQuranRefs = new Set<string>();

function pushChunk(partial: Omit<CorpusChunk, 'normalizedText'>) {
  const normalizedText = normalizeArabic(partial.text);
  if (!normalizedText) return;
  chunks.push({ ...partial, normalizedText });
}

// ─── Events ─────────────────────────────────────────────────────────────────
for (const event of eventsData) {
  const summaryText = [event.details.summary, event.details.full_description]
    .filter(Boolean)
    .join(' ');
  pushChunk({
    id: `event:${event.id}:summary`,
    type: 'event_summary',
    text: summaryText,
    era: event.era,
    entityRefs: { eventId: event.id, battleId: event.battleId },
    sourceLabel: event.title,
  });

  (event.details.course_of_events || []).forEach((step, idx) => {
    pushChunk({
      id: `event:${event.id}:course:${idx}`,
      type: 'event_course_step',
      text: step,
      era: event.era,
      entityRefs: { eventId: event.id, battleId: event.battleId },
      sourceLabel: event.title,
    });
  });

  // Resolve fuzzy joins now, offline — never at chat-query time.
  for (const figureName of event.entities.key_figures || []) {
    const companion = findCompanion(figureName);
    if (!companion) {
      unresolvedKeyFigures.add(figureName);
    }
  }
  for (const ref of event.entities.quran_refs || []) {
    const key = matchQuranKey(ref, Object.keys(quranData));
    if (!key || !(quranData as Record<string, unknown>)[key]) {
      unresolvedQuranRefs.add(ref);
    }
  }
}

// ─── Companions ─────────────────────────────────────────────────────────────
for (const companion of companionsData) {
  const text = [companion.title, companion.role, companion.description, companion.birth_death]
    .filter(Boolean)
    .join(' — ');
  pushChunk({
    id: `companion:${companion.id}`,
    type: 'companion',
    text,
    entityRefs: { companionId: companion.id },
    sourceLabel: companion.name,
  });
}

// ─── Cities ─────────────────────────────────────────────────────────────────
for (const city of citiesData) {
  const text = [city.description, city.significance].filter(Boolean).join(' — ');
  pushChunk({
    id: `city:${city.id}`,
    type: 'city',
    text,
    entityRefs: { cityId: city.id },
    sourceLabel: city.name,
  });
}

// ─── Qur'an references ──────────────────────────────────────────────────────
for (const [key, entry] of Object.entries(quranData as Record<string, { text: string }>)) {
  pushChunk({
    id: `quran:${key}`,
    type: 'quran_ref',
    text: entry.text,
    entityRefs: { quranKey: key },
    sourceLabel: key,
  });
}

// ─── Battle scenarios (Arabic fields only — no translation step) ───────────
for (const scenario of Object.values(scenarios)) {
  // battleId here is the short id used by EventItem.battleId / data.ts's
  // BATTLE_ID_MAP (e.g. "badr"), derived from the scenario registry key
  // (e.g. "battle-of-badr") by stripping the "battle-of-"/other prefixes —
  // mirrors the reverse mapping in App.tsx's onBattleOpen handler.
  const shortBattleId = scenario.id.replace(/^battle-of-/, '').replace(/^conquest-of-mecca$/, 'fath-makkah');

  (scenario.narration || []).forEach((point, idx) => {
    if (!point.textAr) return;
    pushChunk({
      id: `battle:${scenario.id}:narr:${idx}`,
      type: 'battle_narration',
      text: point.textAr,
      entityRefs: { battleId: shortBattleId },
      sourceLabel: scenario.nameAr,
    });
  });

  const outcomeText = [scenario.outcome.summaryAr, scenario.outcome.significanceAr]
    .filter(Boolean)
    .join(' — ');
  if (outcomeText) {
    pushChunk({
      id: `battle:${scenario.id}:outcome`,
      type: 'battle_outcome',
      text: outcomeText,
      entityRefs: { battleId: shortBattleId },
      sourceLabel: scenario.nameAr,
    });
  }
}

// ─── Write output ────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '../public/data');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'chat-corpus.json');
fs.writeFileSync(outPath, JSON.stringify(chunks));

const byType = chunks.reduce<Record<string, number>>((acc, c) => {
  acc[c.type] = (acc[c.type] || 0) + 1;
  return acc;
}, {});

console.log(`Wrote ${chunks.length} chunks to ${path.relative(process.cwd(), outPath)}`);
console.log('By type:', byType);
if (unresolvedKeyFigures.size > 0) {
  console.warn(`\n${unresolvedKeyFigures.size} unresolved key_figures (no matching companion):`);
  console.warn([...unresolvedKeyFigures].join(', '));
}
if (unresolvedQuranRefs.size > 0) {
  console.warn(`\n${unresolvedQuranRefs.size} unresolved quran_refs (no matching entry):`);
  console.warn([...unresolvedQuranRefs].join(', '));
}
