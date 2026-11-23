import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkContent, readContent } from '../scripts/content/store';
import { buildGameData } from '../scripts/game/build';
import type { GameData, GameEvent, GamePerson } from '../shared/gameData';
import { yearDiff } from '../shared/gameText';
import { cairoDate, dailyRng, hash, previousDay, puzzleNumber, rngFrom } from '../src/challenge/engine/seed';
import { LEVELS, MODES, OPTION_COUNT, TRIES } from '../src/challenge/engine/levels';
import { niceNumber, numberOptions, shiftYear, yearOptions } from '../src/challenge/engine/options';
import { LAUNCH_DATE, cluesOpen, cycle, dailyRound, practiceRound, suggestLevel } from '../src/challenge/engine/daily';
import { compareBattles, comparePeople, numberMiss, timeMiss } from '../src/challenge/engine/compare';
import { STORAGE_KEY, emptyState, PICKS_ALLOWED, headline, loadState, recordResult, saveState, visibleStreak, type GameResult } from '../src/challenge/engine/progress';

const ROOT = join(import.meta.dirname, '..');
const { raw } = readContent(join(ROOT, 'content'));
const data = buildGameData(checkContent(raw).content, join(ROOT, 'content', 'game')).report!.data as GameData;
const days = Array.from({ length: 10 }, (_, i) => new Date(Date.UTC(2026, 10, 16 + i)).toISOString().slice(0, 10));

describe('seed', () => {
  it('is the same for the same day, mode and level, and differs across levels and days', () => {
    const a = dailyRng('2026-12-01', 'who', 'easy');
    const b = dailyRng('2026-12-01', 'who', 'easy');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(dailyRng('2026-12-01', 'who', 'mid')()).not.toBe(dailyRng('2026-12-01', 'who', 'easy')());
    expect(hash('نبراس')).toBe(hash('نبراس'));
  });
  it('uses the Cairo date and numbers puzzles from launch day', () => {
    expect(cairoDate(new Date('2026-11-15T23:30:00Z'))).toBe('2026-11-16');
    expect(puzzleNumber(LAUNCH_DATE, LAUNCH_DATE)).toBe(1);
    expect(previousDay('2027-01-01')).toBe('2026-12-31');
  });
});

describe('option helpers', () => {
  it('skips year 0 and keeps a disputed year clear of ±1 distractors', () => {
    expect(shiftYear(1, -1)).toBe(-1);
    expect(shiftYear(-1, 1)).toBe(1);
    for (let s = 0; s < 30; s++) {
      const opts = yearOptions({ year: 34, disputed: true }, 'hard', rngFrom(s));
      expect(opts).toHaveLength(OPTION_COUNT);
      for (const y of opts) if (y !== 34) expect(Math.abs(yearDiff(y, 34))).toBeGreaterThan(1);
    }
  });
  it('gives five numbers, each more than 7% from every other', () => {
    expect(niceNumber(313 * 2.5)).toBe(780);
    for (const level of LEVELS) {
      for (const value of [12, 313, 1400, 30000, 200000]) {
        const opts = numberOptions(value, level, rngFrom(value));
        expect(opts).toHaveLength(OPTION_COUNT);
        for (const a of opts) for (const b of opts) if (a !== b) expect(Math.abs(a - b) / Math.max(a, b)).toBeGreaterThan(0.07);
      }
    }
  });
});

describe('daily rounds from the question bank', () => {
  for (const mode of MODES) {
    for (const level of LEVELS) {
      it(`${mode} / ${level}: ten days, ten different questions, five options with the answer, every wrong pick teaches`, () => {
        expect(cycle(data, mode, level).length).toBeGreaterThanOrEqual(10);
        const seen = new Set<string>();
        for (const day of days) {
          const r = dailyRound(data, mode, level, day);
          expect(dailyRound(data, mode, level, day).questionId).toBe(r.questionId);
          seen.add(r.questionId);
          const ids = r.options.map((o) => o.id);
          expect(new Set(ids).size).toBe(ids.length);
          if (mode === 'order') {
            expect(ids).toHaveLength(4);
            expect([...ids].sort()).toEqual(r.answerId.split(',').sort());
            const wrong = [...r.answerId.split(',')].reverse().join(',');
            expect(r.teach(wrong).cells.map((c) => c.mark)).toContain('red');
          } else {
            expect(ids).toHaveLength(OPTION_COUNT);
            expect(ids).toContain(r.answerId);
            for (const o of r.options.filter((x) => x.id !== r.answerId)) {
              const t = r.teach(o.id);
              expect(t.cells.length, `${r.questionId} ${o.id}`).toBe(r.heads.length);
            }
          }
          expect(r.prompt.length).toBeGreaterThan(3);
          expect(r.fact.length).toBeGreaterThan(3);
        }
        expect(seen.size).toBe(10);
      });
    }
  }
  it('gives three tries, a Nibras line on every person, battle and place option, and names what the result opens', () => {
    expect(TRIES).toBe(3);
    expect(PICKS_ALLOWED).toBe(3);
    for (const mode of MODES) {
      for (const level of LEVELS) {
        for (const day of days) {
          const r = dailyRound(data, mode, level, day);
          expect(r.linkLabel, `${mode} ${level} ${day}`).not.toBe('');
          if (mode === 'who' || mode === 'battle' || mode === 'place' || mode === 'order') {
            for (const o of r.options) expect(o.about, `${mode} ${o.id}`).toBeTruthy();
          }
        }
      }
    }
    // The line is the start of the record, unchanged.
    const p = data.people[0];
    const who = dailyRound(data, 'who', 'easy', days[0]).options.find((o) => o.id === p.id);
    if (who) expect(p.bioShort.startsWith(who.about!)).toBe(true);
  });
  it('plays practice rounds that are not the daily question', () => {
    const today = dailyRound(data, 'who', 'easy', days[0]);
    for (let i = 0; i < 10; i++) expect(practiceRound(data, 'who', 'easy', today.questionId).questionId).not.toBe(today.questionId);
  });
  it('opens clues by level and every two wrong picks, and suggests a level', () => {
    expect([0, 1, 2, 4].map((w) => cluesOpen('easy', w, 5))).toEqual([2, 2, 3, 4]);
    expect(cluesOpen('mid', 0, 3)).toBe(1);
    expect(suggestLevel('easy', true, 1, 60)).toBe('mid');
    expect(suggestLevel('mid', true, 3, 15)).toBe('hard');
    expect(suggestLevel('hard', true, 1, 5)).toBeNull();
    expect(suggestLevel('mid', true, TRIES, 90)).toBe('easy'); // a win on the last try
    expect(suggestLevel('hard', true, 2, 90)).toBeNull();
    expect(suggestLevel('hard', false, TRIES, 90)).toBe('mid');
    expect(suggestLevel('easy', false, 5, 90)).toBeNull();
  });
});

describe('comparisons', () => {
  const person = (id: string): GamePerson => data.people.find((p) => p.id === id)!;
  const event = (id: string): GameEvent => data.events.find((e) => e.id === id)!;
  it('explains «من أكون؟» in plain words', () => {
    const c = comparePeople(person('abu-ubaidah-ibn-al-jarrah'), person('khalid'), 'easy');
    expect(c.tiles.map((t) => t.mark)).toEqual(['red', 'green', 'green', 'green', 'green']);
    expect(c.sentence.startsWith('اللي بندوّر عليه: أسلم بعد الهجرة')).toBe(true);
  });
  it('explains «المعركة» with year, era, the Prophet ﷺ and distance', () => {
    const c = compareBattles(event('battle-uhud'), event('battle-badr'), data.eras);
    expect(c.tiles.map((t) => t.key)).toEqual(['year', 'era', 'prophet', 'distance']);
  });
  it('never says how far the year is', () => {
    expect(timeMiss(5, 9)).toBe('✕ مش ٥ هـ — حصل بعد كده ↑');
    expect(numberMiss(1000, 313)).toBe('الرقم الصح أصغر من كده ↓');
  });
});

describe('scoring and streaks', () => {
  it('picks the headline by attempt', () => {
    expect([1, 2, 3, 5].map((a) => headline(true, a, 5))).toEqual(['عبقري!', 'ممتاز!', 'أحسنت!', 'في آخر لحظة!']);
    expect(headline(false, 5, 5)).toBe('المرة دي فلتت منك');
    expect([1, 2, 3].map((a) => headline(true, a, PICKS_ALLOWED))).toEqual(['عبقري!', 'ممتاز!', 'في آخر لحظة!']);
  });
  const result = (date: string, won = true, mode: GameResult['mode'] = 'who'): GameResult => ({ date, puzzle: 1, mode, level: 'easy', won, attempts: 2, seconds: 30 });
  it('counts the first win of the day and restarts after a gap', () => {
    let s = recordResult(emptyState('2026-12-01'), result('2026-12-01'));
    s = recordResult({ ...s, results: {} }, result('2026-12-02'));
    expect(s.streaks.easy.current).toBe(2);
    s = recordResult({ ...s, results: {} }, result('2026-12-05'));
    expect(s.streaks.easy).toMatchObject({ current: 1, best: 2 });
    expect(visibleStreak(s.streaks.easy, '2026-12-07')).toBe(0);
  });
  it('survives broken or blocked storage and starts a new day fresh', () => {
    expect(loadState({ getItem: () => '{oops' }, '2026-12-01')).toEqual(emptyState('2026-12-01'));
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
    saveState(storage, recordResult(emptyState('2026-12-01'), result('2026-12-01')));
    expect(loadState(storage, '2026-12-02').results).toEqual({});
    expect(store.has(STORAGE_KEY)).toBe(true);
  });
});
