// Phase 6: /api/challenge's rules (api/_lib/challengeAccount.ts) against an in-memory database:
// sign-in merge, server-side checking of rounds, names, deletion.
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { checkContent, readContent } from '../scripts/content/store';
import { buildGameData } from '../scripts/game/build';
import type { GameData } from '../shared/gameData';
import { ChallengeAccounts, type ChallengeDb, type ResultRow } from '../api/_lib/challengeAccount';
import type { AccountResult } from '../src/challenge/engine/account';
import { dailyRound } from '../src/challenge/engine/daily';
import type { Level, Mode } from '../src/challenge/engine/levels';

const ROOT = join(import.meta.dirname, '..');
const { raw } = readContent(join(ROOT, 'content'));
const data = buildGameData(checkContent(raw).content, join(ROOT, 'content', 'game')).report!.data as GameData;
const TODAY = '2026-11-22';
const NOW = () => new Date('2026-11-22T12:00:00Z');
const DEVICE = '11111111-2222-4333-8444-555555555555';

class MemoryDb implements ChallengeDb {
  users = new Map([['tok-a', 'A'], ['tok-b', 'B']]);
  players = new Map<string, { display_name: string; key: string }>();
  rows = new Map<string, ResultRow>();
  guest: Omit<AccountResult, 'checked'>[] = [];
  deleted: string[] = [];
  private k = (r: Pick<ResultRow, 'user_id' | 'puzzle_date' | 'level' | 'mode'>) => `${r.user_id}|${r.puzzle_date}|${r.level}|${r.mode}`;
  async userFor(t: string) { const id = this.users.get(t); return id ? { id } : null; }
  async player(id: string) { const p = this.players.get(id); return p ? { display_name: p.display_name } : null; }
  async addPlayer(id: string, name: string, key: string) {
    if ([...this.players.values()].some((p) => p.key === key)) return 'taken' as const;
    this.players.set(id, { display_name: name, key });
    return 'ok' as const;
  }
  async rename(id: string, name: string, key: string) {
    if ([...this.players.entries()].some(([o, p]) => o !== id && p.key === key)) return 'taken' as const;
    this.players.set(id, { display_name: name, key });
    return 'ok' as const;
  }
  async guestRows() { return this.guest; }
  async result(id: string, date: string, level: Level, mode: Mode) { const r = this.rows.get(this.k({ user_id: id, puzzle_date: date, level, mode })); return r ? { checked: r.checked } : null; }
  async saveResults(rows: ResultRow[], replace: boolean) { for (const r of rows) if (replace || !this.rows.has(this.k(r))) this.rows.set(this.k(r), r); }
  async results(id: string, since: string) { return [...this.rows.values()].filter((r) => r.user_id === id && r.puzzle_date >= since).map(({ user_id: _u, ...r }) => r); }
  async deleteUser(id: string) { this.deleted.push(id); this.players.delete(id); for (const [k, r] of this.rows) if (r.user_id === id) this.rows.delete(k); }
  async deleteGuestRows(d: string) { this.deleted.push(d); this.guest = []; }
}

let db: MemoryDb;
let api: ChallengeAccounts;
beforeEach(() => {
  db = new MemoryDb();
  api = new ChallengeAccounts(db, data, NOW);
});
const round = (mode: Mode, level: Level = 'easy', date = TODAY) => dailyRound(data, mode, level, date);
const wrong = (mode: Mode, level: Level = 'easy') => round(mode, level).options.find((o) => o.id !== round(mode, level).answerId)!.id;
const join_ = (extra: Record<string, unknown> = {}, token = 'tok-a') => api.handle(token, { action: 'join', name: 'سيف', ...extra });

describe('sign-in', () => {
  it('refuses a missing or unknown token', async () => {
    expect((await api.handle(null, { action: 'join' })).status).toBe(401);
    expect((await api.handle('forged', { action: 'join' })).status).toBe(401);
  });
  it('the first sign-in needs a good, free name (any age, Mostafa 2026-11-23)', async () => {
    expect((await join_({ name: undefined })).json.error).toBe('name');
    expect((await join_({ name: 'x' })).json.error).toBe('name');
    expect((await join_()).status).toBe(200);
    // Another player, the same name with other diacritics and spaces: taken.
    expect((await join_({ name: ' سَيف ' }, 'tok-b')).json.error).toBe('name_taken');
  });
  it('later sign-ins need no name', async () => {
    await join_();
    expect((await api.handle('tok-a', { action: 'join' })).json.player).toEqual({ name: 'سيف' });
  });
});

describe('merging the guest into the account', () => {
  it("carries the browser's anonymous days over for streaks only, and checks today's rounds", async () => {
    db.guest = [
      { puzzle_date: '2026-11-20', level: 'easy', mode: 'who', question_id: 'q', won: true, attempts: 2, seconds: 40 },
      { puzzle_date: '2026-11-21', level: 'easy', mode: 'who', question_id: 'q', won: true, attempts: 1, seconds: 1 },
      { puzzle_date: TODAY, level: 'easy', mode: 'who', question_id: 'q', won: true, attempts: 1, seconds: 9 },
    ];
    const plays = [
      { date: TODAY, level: 'easy', mode: 'who', picks: [wrong('who'), round('who').answerId], seconds: 33 },
      { date: TODAY, level: 'easy', mode: 'era', picks: ['made-up'], seconds: 5 },
      { date: '2026-11-01', level: 'easy', mode: 'battle', picks: [round('battle', 'easy', '2026-11-01').answerId], seconds: 5 },
    ];
    const reply = await join_({ deviceId: DEVICE, plays });
    const results = reply.json.results as AccountResult[];
    expect(results.map((r) => [r.puzzle_date, r.mode, r.checked, r.attempts]).sort()).toEqual([
      ['2026-11-20', 'who', false, 2],
      ['2026-11-21', 'who', false, 1],
      // Today's carried row was replaced by the re-played round (two tries, not the claimed one).
      [TODAY, 'who', true, 2],
    ]);
    // The made-up round and the old day were refused; the 1-second row was bounded to 2.
    expect(results.find((r) => r.puzzle_date === '2026-11-21')!.seconds).toBe(2);
  });
  it('a second sign-in (another device) adds, never overwrites a checked round', async () => {
    await join_({ plays: [{ date: TODAY, level: 'easy', mode: 'who', picks: [round('who').answerId], seconds: 20 }] });
    db.guest = [{ puzzle_date: TODAY, level: 'easy', mode: 'who', question_id: 'q', won: false, attempts: 2, seconds: 50 }];
    const again = await api.handle('tok-a', { action: 'join', deviceId: DEVICE, plays: [{ date: TODAY, level: 'easy', mode: 'who', picks: [wrong('who'), round('who').answerId], seconds: 5 }] });
    const who = (again.json.results as AccountResult[]).filter((r) => r.mode === 'who');
    expect(who).toEqual([expect.objectContaining({ won: true, attempts: 1, checked: true, seconds: 20 })]);
  });
});

describe('a round played while signed in', () => {
  beforeEach(async () => { await join_(); });
  it('is saved when the picks are a real play of today', async () => {
    const r = await api.handle('tok-a', { action: 'result', date: TODAY, level: 'mid', mode: 'battle', picks: [round('battle', 'mid').answerId], seconds: 14 });
    expect(r.json).toEqual({ saved: true, points: 3 });
  });
  it('is refused when the picks do not match, or the day is not today or yesterday', async () => {
    expect((await api.handle('tok-a', { action: 'result', date: TODAY, level: 'easy', mode: 'who', picks: ['x'], seconds: 3 })).json.error).toBe('bad_picks');
    expect((await api.handle('tok-a', { action: 'result', date: '2026-11-15', level: 'easy', mode: 'who', picks: [round('who', 'easy', '2026-11-15').answerId], seconds: 3 })).json.error).toBe('wrong_day');
    // Yesterday is accepted (a round that crossed midnight).
    expect((await api.handle('tok-a', { action: 'result', date: '2026-11-21', level: 'easy', mode: 'who', picks: [round('who', 'easy', '2026-11-21').answerId], seconds: 3 })).json.saved).toBe(true);
  });
  it('the first checked result stands: a better replay is ignored', async () => {
    await api.handle('tok-a', { action: 'result', date: TODAY, level: 'easy', mode: 'who', picks: [wrong('who'), round('who').answerId], seconds: 30 });
    expect((await api.handle('tok-a', { action: 'result', date: TODAY, level: 'easy', mode: 'who', picks: [round('who').answerId], seconds: 3 })).json.saved).toBe(false);
    expect([...db.rows.values()][0]).toMatchObject({ attempts: 2, seconds: 30 });
  });
  it('needs a name first', async () => {
    expect((await api.handle('tok-b', { action: 'result', date: TODAY, level: 'easy', mode: 'who', picks: [round('who').answerId], seconds: 3 })).json.error).toBe('no_player');
  });
});

describe('name and deletion', () => {
  it('renames, unless the name is taken or bad', async () => {
    await join_();
    await join_({ name: 'نور' }, 'tok-b');
    expect((await api.handle('tok-a', { action: 'name', name: 'نُور' })).json.error).toBe('name_taken');
    expect((await api.handle('tok-a', { action: 'name', name: 'http' })).json.error).toBe('name');
    expect((await api.handle('tok-a', { action: 'name', name: 'سيف الدين' })).json.player).toEqual({ name: 'سيف الدين' });
  });
  it("deletes the account and this browser's anonymous rows", async () => {
    await join_({ plays: [{ date: TODAY, level: 'easy', mode: 'who', picks: [round('who').answerId], seconds: 20 }] });
    expect((await api.handle('tok-a', { action: 'delete', deviceId: DEVICE })).json).toEqual({ ok: true });
    expect(db.deleted).toEqual(['A', DEVICE]);
    expect(db.players.size + db.rows.size).toBe(0);
  });
});
