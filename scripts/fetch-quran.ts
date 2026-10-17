/**
 * npm run fetch:quran — fetches the verse text of every passage in
 * content/quran/passages.json, and of every verse a battle video recites (the
 * `quran-<surah>-<ayah>` cue ids in content/battle-videos/<event id>/captions.ar.vtt),
 * from Quran.com and writes content/quran/verses.json.
 *
 *   npx tsx scripts/fetch-quran.ts
 *
 * The Qur'an reference is Quran.com (decided 2026-10-16, docs/REFACTOR_PROGRESS.md):
 * the Uthmani text of the public API, api.quran.com/api/v4/quran/verses/uthmani.
 * The text is stored exactly as the API returns it (surrounding spaces trimmed),
 * never typed or edited by hand (CLAUDE.md, rule 2). The file is committed, so builds
 * and CI stay offline; run this again after adding a passage. It prints every verse
 * that is new or whose text changed.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './baseline/lib';
import { readBattleVideos } from './content/battleVideos';
import type { QuranPassage, QuranVerses } from '../shared/contentSchema';

const API = 'https://api.quran.com/api/v4/quran/verses/uthmani';
const PASSAGES_FILE = join(ROOT, 'content', 'quran', 'passages.json');
const VERSES_FILE = join(ROOT, 'content', 'quran', 'verses.json');

type ApiResponse = { verses: { verse_key: string; text_uthmani: string }[] };

async function fetchSurah(surah: number): Promise<Map<string, string>> {
  const res = await fetch(`${API}?chapter_number=${surah}`);
  if (!res.ok) throw new Error(`Quran.com: surah ${surah}: HTTP ${res.status}`);
  const body = (await res.json()) as ApiResponse;
  return new Map(body.verses.map(v => [v.verse_key, v.text_uthmani.trim()]));
}

const passages = JSON.parse(readFileSync(PASSAGES_FILE, 'utf8')) as QuranPassage[];
let previous: QuranVerses['verses'] = {};
try {
  previous = (JSON.parse(readFileSync(VERSES_FILE, 'utf8')) as QuranVerses).verses;
} catch {
  // First run.
}

const needed = new Map<number, Set<number>>();
for (const p of passages) {
  const ayahs = needed.get(p.surah) ?? new Set<number>();
  for (let a = p.from; a <= p.to; a++) ayahs.add(a);
  needed.set(p.surah, ayahs);
}
for (const video of readBattleVideos(join(ROOT, 'content'))) {
  for (const [, surah, ayah] of (video.files['captions.ar.vtt'] ?? '').matchAll(/^quran-(\d+)-(\d+)(?:-part)?$/gm)) {
    needed.set(Number(surah), (needed.get(Number(surah)) ?? new Set<number>()).add(Number(ayah)));
  }
}

const verses: QuranVerses['verses'] = {};
for (const surah of [...needed.keys()].sort((a, b) => a - b)) {
  const fetched = await fetchSurah(surah);
  for (const ayah of [...needed.get(surah)!].sort((a, b) => a - b)) {
    const key = `${surah}:${ayah}`;
    const text = fetched.get(key);
    if (!text) throw new Error(`Quran.com returned no verse ${key}`);
    verses[key] = text;
    if (previous[key] === undefined) console.log(`  new      ${key}`);
    else if (previous[key] !== text) console.log(`  changed  ${key}`);
  }
}

const file: QuranVerses = {
  source: 'Quran.com API v4, /quran/verses/uthmani (text_uthmani)',
  fetchedOn: new Date().toISOString().slice(0, 10),
  verses,
};
writeFileSync(VERSES_FILE, `${JSON.stringify(file, null, 2)}\n`);
console.log(`Wrote content/quran/verses.json: ${Object.keys(verses).length} verses from ${needed.size} surahs.`);
