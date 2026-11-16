import { describe, expect, it } from 'vitest';
import game from '../src/generated/game.json';
import type { GameData, GameEvent, GamePerson } from '../shared/gameData';
import { yearDiff } from '../shared/gameText';
import { cairoDate, dailyRng, hash, previousDay, puzzleNumber, rngFrom } from '../src/challenge/engine/seed';
import { LEVELS, MODES, LEVEL_CONFIG } from '../src/challenge/engine/levels';
import { levelPool, niceNumber, numberOptions, shiftYear, timeOptions } from '../src/challenge/engine/options';
import { buildPuzzle, modePool, numberItems } from '../src/challenge/engine/puzzles';
import { compareBattles, comparePeople, numberMiss, timeMiss } from '../src/challenge/engine/compare';
import { distanceKm } from '../src/challenge/engine/geo';
import {
  STORAGE_KEY,
  emptyState,
  headline,
  loadState,
  recordResult,
  saveState,
  stagePoints,
  visibleStreak,
  type GameResult,
} from '../src/challenge/engine/progress';

const data = game as GameData;
const days = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 11, 1 + i)).toISOString().slice(0, 10));

describe('seed', () => {
  it('is the same for the same day, mode and level, and differs across levels and days', () => {
    const a = dailyRng('2026-12-01', 'who', 'easy');
    const b = dailyRng('2026-12-01', 'who', 'easy');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(dailyRng('2026-12-01', 'who', 'mid')()).not.toBe(dailyRng('2026-12-01', 'who', 'easy')());
    expect(dailyRng('2026-12-02', 'who', 'easy')()).not.toBe(dailyRng('2026-12-01', 'who', 'easy')());
    expect(hash('نبراس')).toBe(hash('نبراس'));
  });
  it('uses the Cairo date', () => {
    expect(cairoDate(new Date('2026-11-15T23:30:00Z'))).toBe('2026-11-16');
    expect(cairoDate(new Date('2026-11-15T21:00:00Z'))).toBe('2026-11-15');
  });
  it('numbers puzzles from launch day', () => {
    expect(puzzleNumber('2026-12-01', '2026-12-01')).toBe(1);
    expect(puzzleNumber('2027-01-01', '2026-12-01')).toBe(32);
    expect(previousDay('2027-01-01')).toBe('2026-12-31');
  });
});

describe('option generators', () => {
  it('skips year 0 when shifting years', () => {
    expect(shiftYear(1, -1)).toBe(-1);
    expect(shiftYear(-1, 1)).toBe(1);
    expect(shiftYear(2, -3)).toBe(-2);
  });
  it('keeps a disputed year clear of ±1 distractors', () => {
    for (let s = 0; s < 50; s++) {
      const opts = timeOptions({ year: 34, disputed: true }, 'hard', rngFrom(s));
      for (const y of opts) if (y !== 34) expect(Math.abs(yearDiff(y, 34))).toBeGreaterThan(1);
    }
  });
  it('rounds to nice numbers', () => {
    expect(niceNumber(313 * 2.5)).toBe(780);
    expect(niceNumber(12.4)).toBe(12);
    expect(niceNumber(1234)).toBe(1200);
  });
  it('keeps every number option more than 7% from the others', () => {
    for (const level of LEVELS) {
      for (const value of [12, 313, 1400, 3000, 30000, 120000]) {
        const opts = numberOptions(value, level, rngFrom(value));
        expect(opts).toHaveLength(4);
        expect(opts).toContain(value);
        for (const a of opts) for (const b of opts) if (a !== b) expect(Math.abs(a - b) / Math.max(a, b)).toBeGreaterThan(0.07);
      }
    }
  });
  it('draws the easy answer from tier 1, topping up from the nearest tier only when needed', () => {
    const people = modePool(data, 'who') as GamePerson[];
    expect(levelPool(people, 'easy').every((p) => p.tier === 1)).toBe(true);
    const cities = modePool(data, 'place') as { id: string; tier: 1 | 2 | 3 }[];
    const mid = levelPool(cities, 'mid');
    expect(mid.length).toBeGreaterThanOrEqual(4);
    expect(mid.filter((c) => c.tier === 2).length).toBe(cities.filter((c) => c.tier === 2).length);
  });
});

describe('daily puzzles from the real dataset', () => {
  for (const mode of MODES) {
    for (const level of LEVELS) {
      it(`${mode} / ${level}: 4 unique options with the answer, every day`, () => {
        for (const day of days) {
          const p = buildPuzzle(data, mode, level, dailyRng(day, mode, level));
          const again = buildPuzzle(data, mode, level, dailyRng(day, mode, level));
          expect(again).toEqual(p);
          if (p.mode === 'time' || p.mode === 'number') {
            const target = p.mode === 'time' ? p.answer.year : p.answer.value;
            expect(new Set(p.options).size).toBe(4);
            expect(p.options).toContain(target);
            expect([...p.options].sort((a, b) => a - b)).toEqual(p.options);
            if (p.mode === 'time') expect(p.options).not.toContain(0);
          } else if (p.mode === 'full') {
            for (const opts of [p.nameOptions, p.placeOptions]) {
              expect(new Set(opts.map((o) => o.id)).size).toBe(4);
              expect(opts.map((o) => o.id)).toContain(p.answer.id);
            }
            expect(new Set(p.placeOptions.map((o) => o.place)).size).toBe(4);
            expect(p.yearOptions).toContain(p.answer.year);
          } else {
            expect(new Set(p.options.map((o) => o.id)).size).toBe(4);
            expect(p.options.map((o) => o.id)).toContain(p.answer.id);
          }
        }
      });
    }
  }
  it('asks «رقم اليوم» in plain words, with ships when the force is a fleet', () => {
    const items = numberItems(data.events);
    expect(items.length).toBeGreaterThanOrEqual(4);
    for (const i of items) expect(i.prompt).toMatch(/^كم كان عدد (جيش|مراكب) (المسلمين|العدو) في «.+»؟$/);
  });
  it('spaces the «الحدث الكامل» places by the level when the data allows', () => {
    const p = buildPuzzle(data, 'full', 'easy', dailyRng('2026-12-05', 'full', 'easy'));
    if (p.mode !== 'full') throw new Error('mode');
    const pts = p.placeOptions;
    const spaced = pts.every((a) => pts.every((b) => a === b || distanceKm(a, b) >= LEVEL_CONFIG.easy.placeSpacingKm));
    expect(spaced).toBe(true);
  });
});

describe('comparisons', () => {
  const person = (id: string): GamePerson => data.people.find((p) => p.id === id)!;
  const event = (id: string): GameEvent => data.events.find((e) => e.id === id)!;
  it('explains «من أكون؟» in plain words, era at easy and death year at hard', () => {
    const easy = comparePeople(person('abu-ubaidah-ibn-al-jarrah'), person('khalid'), 'easy');
    expect(easy.tiles.map((t) => t.mark)).toEqual(['red', 'green', 'green', 'green', 'green']);
    expect(easy.sentence).toBe('اللي بندوّر عليه: أسلم بعد الهجرة، من المهاجرين زيه، اشتهر إنه قائد جيوش زيه، عاش لحد عهد عمر زيه، اتوفّى في الشام زيه.');
    const hard = comparePeople(person('amr'), person('khalid'), 'hard');
    expect(hard.tiles[3]).toMatchObject({ key: 'deathYear', mark: 'red', arrow: '↓ مات قبله' });
  });
  it('marks a Hijaz death place as close', () => {
    const c = comparePeople(person('abu-dharr-al-ghifari'), person('abu-bakr'), 'easy');
    expect(c.tiles.find((t) => t.key === 'deathPlace')?.mark).toBe('yellow');
  });
  it('explains «معركة اليوم» with year, era, the Prophet ﷺ and distance', () => {
    const c = compareBattles(event('battle-uhud'), event('battle-badr'), data.eras);
    expect(c.tiles.map((t) => t.key)).toEqual(['year', 'era', 'prophet', 'distance']);
    expect(c.tiles[0]).toMatchObject({ mark: 'yellow', arrow: '↓ حصلت قبلها' });
    expect(c.sentence).toMatch(/^اللي بندوّر عليه: حصلت قبلها، في نفس العهد، النبي ﷺ كان فيها، مكانها على بعد .+ كم ناحية .+\.$/);
  });
  it('never says how far the year is, only before or after', () => {
    expect(timeMiss(5, 9)).toBe('✕ مش ٥ هـ — حصل بعد كده ↑');
    expect(timeMiss(-3, -5)).toBe('✕ مش ٣ ق.هـ — حصل قبل كده ↓');
    expect(numberMiss(1000, 313)).toBe('الرقم الصح أصغر ↓');
  });
});

describe('scoring and streaks', () => {
  it('gives full points first try, half on the second, none after two misses', () => {
    expect(stagePoints('name', 1, true)).toBe(40);
    expect(stagePoints('place', 2, true)).toBe(15);
    expect(stagePoints('year', 2, false)).toBe(0);
  });
  it('picks the headline by attempt', () => {
    expect([1, 2, 3, 4].map((a) => headline(true, a, 4))).toEqual(['عبقري!', 'ممتاز!', 'أحسنت!', 'في آخر لحظة!']);
    expect(headline(true, 3, 3)).toBe('في آخر لحظة!');
    expect(headline(false, 4, 4)).toBe('المرة دي فلتت منك');
  });
  const result = (date: string, won = true, mode: GameResult['mode'] = 'who'): GameResult => ({ date, puzzle: 1, mode, level: 'easy', won, attempts: 2, seconds: 30 });
  it('counts the first win of the day, grows on consecutive days and restarts after a gap', () => {
    let s = emptyState('2026-12-01');
    s = recordResult(s, result('2026-12-01'));
    s = recordResult(s, result('2026-12-01', true, 'battle'));
    expect(s.streaks.easy.current).toBe(1);
    s = recordResult({ ...s, results: {} }, result('2026-12-02'));
    expect(s.streaks.easy.current).toBe(2);
    s = recordResult({ ...s, results: {} }, result('2026-12-05'));
    expect(s.streaks.easy).toMatchObject({ current: 1, best: 2 });
    expect(visibleStreak(s.streaks.easy, '2026-12-06')).toBe(1);
    expect(visibleStreak(s.streaks.easy, '2026-12-07')).toBe(0);
  });
  it('keeps the first result of a mode and ignores a replay', () => {
    let s = recordResult(emptyState('2026-12-01'), result('2026-12-01', false));
    s = recordResult(s, result('2026-12-01', true));
    expect(s.results['easy:who'].won).toBe(false);
    expect(s.streaks.easy.current).toBe(0);
  });
  it('survives broken or blocked storage and starts a new day fresh', () => {
    expect(loadState({ getItem: () => '{oops' }, '2026-12-01')).toEqual(emptyState('2026-12-01'));
    expect(loadState({ getItem: () => { throw new Error('blocked'); } }, '2026-12-01').results).toEqual({});
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
    saveState(storage, recordResult(emptyState('2026-12-01'), result('2026-12-01')));
    expect(loadState(storage, '2026-12-01').results['easy:who']).toBeDefined();
    const nextDay = loadState(storage, '2026-12-02');
    expect(nextDay.results).toEqual({});
    expect(nextDay.streaks.easy.current).toBe(1);
    expect(() => saveState({ setItem: () => { throw new Error('full'); } }, nextDay)).not.toThrow();
    expect(store.has(STORAGE_KEY)).toBe(true);
  });
});
