// Phase 6: the account rules the game and /api/challenge share (src/challenge/engine/account.ts).
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkContent, readContent } from '../scripts/content/store';
import { buildGameData } from '../scripts/game/build';
import type { GameData } from '../shared/gameData';
import { dailyRound } from '../src/challenge/engine/daily';
import { MODES } from '../src/challenge/engine/levels';
import { emptyState, recordResult, type DailyState } from '../src/challenge/engine/progress';
import { checkDisplayName, checkPlay, finishedPlays, foldName, mergeIntoLocal, pointsFor, streakFromDays, type AccountResult } from '../src/challenge/engine/account';

const ROOT = join(import.meta.dirname, '..');
const { raw } = readContent(join(ROOT, 'content'));
const data = buildGameData(checkContent(raw).content, join(ROOT, 'content', 'game')).report!.data as GameData;
const DAY = '2026-11-22';

const wrongOf = (round: ReturnType<typeof dailyRound>, n: number): string[] => {
  if (round.mode !== 'order') return round.options.map((o) => o.id).filter((id) => id !== round.answerId).slice(0, n);
  // Orders other than the answer: the answer's ids rotated.
  const ids = round.answerId.split(',');
  return Array.from({ length: n }, (_, i) => [...ids.slice(i + 1), ...ids.slice(0, i + 1)].join(','));
};

describe('checkPlay', () => {
  for (const mode of MODES) {
    it(`accepts a real play of «${mode}» and refuses made-up ones`, () => {
      const round = dailyRound(data, mode, 'easy', DAY);
      const [w1, w2] = wrongOf(round, 2);
      expect(checkPlay(round, [round.answerId])).toEqual({ won: true, attempts: 1 });
      expect(checkPlay(round, [w1, round.answerId])).toEqual({ won: true, attempts: 2 });
      expect(checkPlay(round, [w1, w2])).toEqual({ won: false, attempts: 2 });
      expect(checkPlay(round, [w1])).toBeNull(); // the round had not ended
      expect(checkPlay(round, [w1, w1])).toBeNull(); // a repeated pick
      expect(checkPlay(round, [w1, w2, round.answerId])).toBeNull(); // a pick after the round was lost
      expect(checkPlay(round, [round.answerId, w1])).toBeNull(); // a pick after the win
      expect(checkPlay(round, ['not-an-option'])).toBeNull();
      expect(checkPlay(round, [])).toBeNull();
      expect(checkPlay(round, 'x')).toBeNull();
    });
  }
  it('a «رتّب» pick must be an order of the four events', () => {
    const round = dailyRound(data, 'order', 'mid', DAY);
    const ids = round.answerId.split(',');
    expect(checkPlay(round, [[ids[0], ids[0], ids[1], ids[2]].join(',')])).toBeNull();
    expect(checkPlay(round, [ids.slice(0, 3).join(',')])).toBeNull();
  });
  it("is checked against that day's round: yesterday's answer is not today's", () => {
    const today = dailyRound(data, 'who', 'hard', DAY);
    const other = dailyRound(data, 'who', 'hard', '2026-11-21');
    if (other.answerId !== today.answerId && !today.options.some((o) => o.id === other.answerId)) expect(checkPlay(today, [other.answerId])).toBeNull();
  });
});

describe('points and names', () => {
  it('scores 3, 2, 1 for a win by try, 0 for a loss', () => {
    expect([1, 2, 3].map((a) => pointsFor(true, a))).toEqual([3, 2, 1]);
    expect(pointsFor(false, 1)).toBe(0);
    expect(pointsFor(true, 5)).toBe(0);
  });
  it('takes plain Arabic or Latin names of 2 to 20 letters', () => {
    for (const ok of ['مصطفى', 'أم يوسف', 'Sara_99', 'يوسف ١٤', 'طالب تاريخ']) expect(checkDisplayName(ok)).toBeNull();
    expect(checkDisplayName('م')).toMatch(/حرفين/);
    expect(checkDisplayName('ا'.repeat(21))).toMatch(/٢٠/);
    expect(checkDisplayName('١٢٣٤')).toMatch(/حروف/);
    expect(checkDisplayName('www.site.com')).toMatch(/اسم تاني/);
    expect(checkDisplayName('نِبْرَاس')).toMatch(/اسم تاني/);
    expect(checkDisplayName('😀😀')).toMatch(/حروف عربي/);
  });
  it('folds names so look-alikes collide', () => {
    expect(foldName('أحمد  ')).toBe(foldName('احمد'));
    expect(foldName('مُصْطَفى')).toBe(foldName('مصطفي'));
    expect(foldName('Sara')).toBe(foldName('sara'));
  });
});

describe('streakFromDays', () => {
  it('counts the run that reaches today or yesterday, and the longest ever', () => {
    expect(streakFromDays(['2026-11-20', '2026-11-21', '2026-11-22'], DAY)).toEqual({ current: 3, best: 3, lastWin: DAY });
    expect(streakFromDays(['2026-11-17', '2026-11-18', '2026-11-19', '2026-11-21'], DAY)).toEqual({ current: 1, best: 3, lastWin: '2026-11-21' });
    expect(streakFromDays(['2026-11-17', '2026-11-18'], DAY)).toEqual({ current: 0, best: 2, lastWin: '2026-11-18' });
    expect(streakFromDays([], DAY)).toEqual({ current: 0, best: 0, lastWin: null });
    expect(streakFromDays(['2026-11-22', '2026-11-22', '2026-11-23'], DAY).current).toBe(1); // repeats and future days ignored
  });
  it('a merged streak keeps growing the next day like a local one', () => {
    const merged = mergeIntoLocal(emptyState(DAY), [row('2026-11-21', true), row(DAY, true)], DAY);
    const next = recordResult({ ...merged, date: '2026-11-23', results: {} }, { date: '2026-11-23', puzzle: 8, mode: 'who', level: 'easy', won: true, attempts: 1, seconds: 9 });
    expect(next.streaks.easy).toEqual({ current: 3, best: 3, lastWin: '2026-11-23' });
  });
});

const row = (date: string, won: boolean, mode: AccountResult['mode'] = 'who', level: AccountResult['level'] = 'easy'): AccountResult =>
  ({ puzzle_date: date, level, mode, question_id: 'q', won, attempts: 2, seconds: 30, checked: true });

describe('mergeIntoLocal (first sign-in and every sign-in after)', () => {
  it("joins the guest's today with the account's days into one streak per level", () => {
    // The guest won today on this device; the account (another device) won the three days before.
    let guest = emptyState(DAY);
    guest = recordResult(guest, { date: DAY, puzzle: 7, mode: 'battle', level: 'easy', won: true, attempts: 1, seconds: 12 });
    const account = [row('2026-11-19', true), row('2026-11-20', true), row('2026-11-21', true), row('2026-11-21', true, 'who', 'mid')];
    const merged = mergeIntoLocal(guest, account, DAY);
    expect(merged.streaks.easy).toEqual({ current: 4, best: 4, lastWin: DAY });
    expect(merged.streaks.mid).toEqual({ current: 1, best: 1, lastWin: '2026-11-21' });
    expect(merged.streaks.hard).toEqual({ current: 0, best: 0, lastWin: null });
  });
  it("takes today's rounds from both, the guest's own where both have one, and keeps the level choice", () => {
    let guest: DailyState = { ...emptyState(DAY), level: 'mid' };
    guest = recordResult(guest, { date: DAY, puzzle: 7, mode: 'who', level: 'easy', won: false, attempts: 2, seconds: 50 });
    const merged = mergeIntoLocal(guest, [row(DAY, true, 'who'), row(DAY, true, 'place'), row('2026-11-21', true, 'era')], DAY);
    expect(Object.keys(merged.results).sort()).toEqual(['easy:place', 'easy:who']);
    expect(merged.results['easy:who'].won).toBe(false);
    expect(merged.level).toBe('mid');
  });
  it('a stale local state (another day) contributes nothing but its level', () => {
    let old: DailyState = { ...emptyState('2026-11-10'), level: 'hard' };
    old = recordResult(old, { date: '2026-11-10', puzzle: 1, mode: 'who', level: 'hard', won: true, attempts: 1, seconds: 5 });
    const merged = mergeIntoLocal(old, [], DAY);
    expect(merged).toMatchObject({ date: DAY, level: 'hard', results: {} });
    expect(merged.streaks.hard.current).toBe(0);
  });
  it('signing in twice changes nothing the second time', () => {
    const account = [row('2026-11-21', true), row(DAY, true)];
    const once = mergeIntoLocal(emptyState(DAY), account, DAY);
    expect(mergeIntoLocal(once, account, DAY)).toEqual(once);
  });
});

describe('finishedPlays', () => {
  it("sends only today's finished rounds, with their picks and seconds", () => {
    const plays = { date: DAY, plays: { 'easy:who': { picks: ['a', 'b'], startedAt: 0, endedAt: 31_400 }, 'easy:era': { picks: ['x'], startedAt: 0 }, 'bad:who': { picks: ['a'], startedAt: 0, endedAt: 9 } } };
    expect(finishedPlays(plays, DAY)).toEqual([{ date: DAY, level: 'easy', mode: 'who', picks: ['a', 'b'], seconds: 31 }]);
    expect(finishedPlays({ ...plays, date: '2026-11-01' }, DAY)).toEqual([]);
    expect(finishedPlays(null, DAY)).toEqual([]);
  });
});
