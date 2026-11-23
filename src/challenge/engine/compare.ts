/**
 * What a wrong pick teaches: the colored tiles and the plain-words sentence
 * (docs/phase5/challenge-spec.md, section 5.3, with the 2026-11-16 tiles).
 * The sentence matters more than the colors, so every tile has its clause.
 */
import type { GameEvent, GamePerson, LastEra } from '../../../shared/gameData.js';
import { FACT_LABELS } from '../../../shared/gameLabels.js';
import { toArabicIndic } from '../../../shared/arabic.js';
import { yearDiff } from '../../../shared/gameText.js';
import { directionAr, distanceKm, roundKm } from './geo.js';
import type { Level } from './levels.js';

/** green: same as the answer · yellow: close · red: different. */
export type Mark = 'green' | 'yellow' | 'red';

export interface Tile {
  key: string;
  /** The guess's value, as the tile shows it. */
  value: string;
  mark: Mark;
  /** «↑ مات بعده» / «↓ حصلت قبلها»: where the answer lies from the guess. */
  arrow?: string;
}

export interface Comparison {
  tiles: Tile[];
  /** «اللي بندوّر عليه: …» */
  sentence: string;
}

const LAST_ERA_ORDER: LastEra[] = ['prophet', 'abu-bakr', 'umar', 'uthman', 'ali', 'after'];
const HIJAZ = new Set(['madinah', 'makkah', 'hijaz']);
const MIGRATION_CLAUSE = { muhajir: 'من المهاجرين', ansari: 'من الأنصار', other: 'من قبيلة تانية' } as const;

const same = (yes: boolean, clause: string): string => (yes ? `${clause} زيه` : clause);

/** «من أكون؟»: the guess against the answer. The hard level shows the death year instead of the era. */
export function comparePeople(guess: GamePerson, answer: GamePerson, level: Level): Comparison {
  const tiles: Tile[] = [];
  const clauses: string[] = [];
  const islam = guess.islam === answer.islam;
  tiles.push({ key: 'islam', value: FACT_LABELS.islam[guess.islam], mark: islam ? 'green' : 'red' });
  clauses.push(same(islam, `أسلم ${FACT_LABELS.islam[answer.islam]}`));

  const migration = guess.migration === answer.migration;
  tiles.push({ key: 'migration', value: FACT_LABELS.migration[guess.migration], mark: migration ? 'green' : 'red' });
  clauses.push(same(migration, MIGRATION_CLAUSE[answer.migration]));

  const known = guess.knownFor === answer.knownFor;
  tiles.push({ key: 'knownFor', value: FACT_LABELS.knownFor[guess.knownFor], mark: known ? 'green' : 'red' });
  clauses.push(same(known, `اشتهر إنه ${FACT_LABELS.knownFor[answer.knownFor]}`));

  if (level === 'hard') {
    const diff = yearDiff(answer.deathYear, guess.deathYear);
    const mark: Mark = diff === 0 ? 'green' : Math.abs(diff) <= 5 ? 'yellow' : 'red';
    const arrow = diff > 0 ? '↑ اتوفّى بعده' : diff < 0 ? '↓ اتوفّى قبله' : undefined;
    tiles.push({ key: 'deathYear', value: `${toArabicIndic(Math.abs(guess.deathYear))} هـ`, mark, ...(arrow ? { arrow } : {}) });
    clauses.push(diff === 0 ? 'اتوفّى في نفس السنة' : diff > 0 ? 'اتوفّى بعده' : 'اتوفّى قبله');
  } else {
    const gap = Math.abs(LAST_ERA_ORDER.indexOf(guess.lastEra) - LAST_ERA_ORDER.indexOf(answer.lastEra));
    tiles.push({ key: 'lastEra', value: FACT_LABELS.lastEra[guess.lastEra], mark: gap === 0 ? 'green' : gap === 1 ? 'yellow' : 'red' });
    clauses.push(same(gap === 0, `عاش لحد ${FACT_LABELS.lastEra[answer.lastEra]}`));
  }

  const place = guess.deathPlace === answer.deathPlace;
  const near = !place && HIJAZ.has(guess.deathPlace) && HIJAZ.has(answer.deathPlace);
  tiles.push({ key: 'deathPlace', value: FACT_LABELS.deathPlace[guess.deathPlace], mark: place ? 'green' : near ? 'yellow' : 'red' });
  clauses.push(same(place, `اتوفّى في ${FACT_LABELS.deathPlace[answer.deathPlace]}`));

  return { tiles, sentence: `اللي بندوّر عليه: ${clauses.join('، ')}.` };
}

/** «معركة اليوم»: the guessed battle against the answer. `eras` is in chronological order. */
export function compareBattles(guess: GameEvent, answer: GameEvent, eras: readonly { id: string; nameAr: string }[]): Comparison {
  const diff = yearDiff(answer.year, guess.year);
  const yearMark: Mark = diff === 0 ? 'green' : Math.abs(diff) <= 2 ? 'yellow' : 'red';
  const yearArrow = diff > 0 ? '↑ حصلت بعدها' : diff < 0 ? '↓ حصلت قبلها' : undefined;
  const eraIndex = (id: string): number => eras.findIndex((e) => e.id === id);
  const eraGap = Math.abs(eraIndex(guess.era) - eraIndex(answer.era));
  const eraName = eras[eraIndex(guess.era)]?.nameAr ?? '';
  const prophet = guess.prophetPresent === answer.prophetPresent;
  const km = distanceKm(guess, answer);
  const kmMark: Mark = km < 30 ? 'green' : km < 400 ? 'yellow' : 'red';
  const dir = directionAr(guess, answer);
  const tiles: Tile[] = [
    { key: 'year', value: yearLabel(guess.year), mark: yearMark, ...(yearArrow ? { arrow: yearArrow } : {}) },
    { key: 'era', value: eraName, mark: eraGap === 0 ? 'green' : eraGap === 1 ? 'yellow' : 'red' },
    { key: 'prophet', value: guess.prophetPresent ? 'آه' : 'لأ', mark: prophet ? 'green' : 'red' },
    { key: 'distance', value: km < 30 ? 'نفس المكان تقريبًا' : `${toArabicIndic(roundKm(km))} كم`, mark: kmMark, ...(km >= 30 ? { arrow: dir } : {}) },
  ];
  const clauses = [
    diff === 0 ? 'حصلت في نفس السنة' : diff > 0 ? 'حصلت بعدها' : 'حصلت قبلها',
    eraGap === 0 ? 'في نفس العهد' : 'في عهد تاني',
    answer.prophetPresent ? 'النبي ﷺ كان فيها' : 'النبي ﷺ ماكانش فيها',
    km < 30 ? 'في نفس المكان تقريبًا' : `مكانها على بعد ${toArabicIndic(roundKm(km))} كم ناحية ${dir}`,
  ];
  return { tiles, sentence: `اللي بندوّر عليه: ${clauses.join('، ')}.` };
}

/** «١٢ هـ» or «٥ ق.هـ». */
export function yearLabel(year: number): string {
  return year < 0 ? `${toArabicIndic(-year)} ق.هـ` : `${toArabicIndic(year)} هـ`;
}

/** «مكان اليوم» and the place stage: «✕ مش X — … على بعد N كم منها ناحية …». */
export function placeMiss(guess: { name: string; lat: number; lon: number }, answer: { lat: number; lon: number }, what: 'city' | 'place'): string {
  const km = toArabicIndic(roundKm(distanceKm(guess, answer)));
  const dir = directionAr(guess, answer);
  return what === 'city'
    ? `✕ مش ${guess.name} — المدينة اللي بندوّر عليها على بعد ${km} كم منها ناحية ${dir}`
    : `✕ مش ${guess.name} — المكان الصح على بعد ${km} كم منه ناحية ${dir}`;
}

/** «زمان اليوم»: before or after, never by how much. */
export function timeMiss(guess: number, answer: number): string {
  return `✕ مش ${yearLabel(guess)} — ${answer > guess ? 'حصل بعد كده ↑' : 'حصل قبل كده ↓'}`;
}

/** «رقم اليوم»: bigger or smaller. */
export function numberMiss(guess: number, answer: number): string {
  return answer > guess ? 'الرقم الصح أكبر من كده ↑' : 'الرقم الصح أصغر من كده ↓';
}
