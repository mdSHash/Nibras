/**
 * «تحدي اليوم» accounts (Phase 6): what /api/challenge does, behind a small database interface so
 * the rules are tested without Supabase (tests/challengeApi.test.ts). Every round is re-played
 * against the day's puzzle (the same engine the game runs) before it is saved as checked.
 */
import type { GameData } from '../../shared/gameData.js';
import { boundSeconds, checkDisplayName, checkPlay, foldName, tidyName, type AccountResult } from '../../src/challenge/engine/account.js';
import { dailyRound } from '../../src/challenge/engine/daily.js';
import { LEVELS, MODES, type Level, type Mode } from '../../src/challenge/engine/levels.js';
import { cairoDate, previousDay } from '../../src/challenge/engine/seed.js';

export interface ResultRow extends AccountResult { user_id: string }

export interface ChallengeDb {
  /** The signed-in user behind an access token, or null when it is not valid. */
  userFor(token: string): Promise<{ id: string } | null>;
  player(id: string): Promise<{ display_name: string } | null>;
  addPlayer(id: string, name: string, key: string): Promise<'ok' | 'taken'>;
  rename(id: string, name: string, key: string): Promise<'ok' | 'taken'>;
  /** The anonymous rows one browser added in Phase 5F (challenge_results, by device id). */
  guestRows(deviceId: string): Promise<Omit<AccountResult, 'checked'>[]>;
  result(id: string, date: string, level: Level, mode: Mode): Promise<{ checked: boolean } | null>;
  /** Saves rows; `replace` overwrites a row with the same key, otherwise an existing row is kept. */
  saveResults(rows: ResultRow[], replace: boolean): Promise<void>;
  results(id: string, since: string): Promise<AccountResult[]>;
  deleteUser(id: string): Promise<void>;
  deleteGuestRows(deviceId: string): Promise<void>;
}

export interface Reply { status: number; json: Record<string, unknown> }
const fail = (status: number, error: string, messageAr: string): Reply => ({ status, json: { error, messageAr } });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** How far back the account page reads (its calendar and history). */
export const HISTORY_DAYS = 120;

interface PlayIn { date: string; level: Level; mode: Mode; picks: string[]; seconds: number }
const asPlay = (v: unknown): PlayIn | null => {
  if (!v || typeof v !== 'object') return null;
  const p = v as Record<string, unknown>;
  if (typeof p.date !== 'string' || !LEVELS.includes(p.level as Level) || !MODES.includes(p.mode as Mode) || !Array.isArray(p.picks)) return null;
  return { date: p.date, level: p.level as Level, mode: p.mode as Mode, picks: p.picks.filter((x): x is string => typeof x === 'string').slice(0, 6), seconds: Number(p.seconds) };
};

export class ChallengeAccounts {
  constructor(private db: ChallengeDb, private data: GameData, private now: () => Date = () => new Date()) {}

  private today(): string {
    return cairoDate(this.now());
  }

  /** Re-plays one round; the row to save, or why not. A day other than today or yesterday (Cairo) is refused. */
  private check(userId: string, play: PlayIn): ResultRow | string {
    const today = this.today();
    if (play.date !== today && play.date !== previousDay(today)) return 'wrong_day';
    const round = dailyRound(this.data, play.mode, play.level, play.date);
    const outcome = checkPlay(round, play.picks);
    if (!outcome) return 'bad_picks';
    return { user_id: userId, puzzle_date: play.date, level: play.level, mode: play.mode, question_id: round.questionId.slice(0, 80), won: outcome.won, attempts: outcome.attempts, seconds: boundSeconds(play.seconds), checked: true };
  }

  private async summary(id: string, name: string): Promise<Reply> {
    const since = new Date(Date.parse(`${this.today()}T00:00:00Z`) - HISTORY_DAYS * 86_400_000).toISOString().slice(0, 10);
    return { status: 200, json: { player: { name }, results: await this.db.results(id, since) } };
  }

  async handle(token: string | null, body: Record<string, unknown>): Promise<Reply> {
    if (!token) return fail(401, 'signed_out', 'لازم تسجّل دخول الأول.');
    const user = await this.db.userFor(token);
    if (!user) return fail(401, 'signed_out', 'خرجت من حسابك. سجّل دخول تاني.');
    switch (body.action) {
      case 'join':
        return this.join(user.id, body);
      case 'result':
        return this.result(user.id, body);
      case 'name':
        return this.rename(user.id, body.name);
      case 'delete':
        await this.db.deleteUser(user.id);
        if (typeof body.deviceId === 'string' && UUID.test(body.deviceId)) await this.db.deleteGuestRows(body.deviceId);
        return { status: 200, json: { ok: true } };
      default:
        return fail(400, 'bad_request', 'طلب مش مفهوم.');
    }
  }

  /**
   * First sign-in (with a name) and every sign-in after, on any device:
   * carries this browser's anonymous rows over (streak days only, never points), then re-plays
   * the browser's finished rounds of today and yesterday and saves those as checked.
   */
  private async join(id: string, body: Record<string, unknown>): Promise<Reply> {
    let player = await this.db.player(id);
    if (!player) {
      const name = typeof body.name === 'string' ? tidyName(body.name) : '';
      const problem = checkDisplayName(name);
      if (problem) return fail(400, 'name', problem);
      if ((await this.db.addPlayer(id, name, foldName(name))) === 'taken') return fail(409, 'name_taken', 'الاسم ده مستخدم. اختار اسم تاني.');
      player = { display_name: name };
    }
    if (typeof body.deviceId === 'string' && UUID.test(body.deviceId)) {
      const carried = (await this.db.guestRows(body.deviceId)).map((r): ResultRow => ({ ...r, user_id: id, seconds: boundSeconds(r.seconds), checked: false }));
      if (carried.length) await this.db.saveResults(carried, false);
    }
    const plays = Array.isArray(body.plays) ? body.plays.slice(0, 2 * LEVELS.length * MODES.length) : [];
    const checked: ResultRow[] = [];
    for (const raw of plays) {
      const play = asPlay(raw);
      const row = play && this.check(id, play);
      if (row && typeof row !== 'string') checked.push(row);
    }
    // A checked round replaces the carried-over row of the same round, never another checked one.
    const fresh: ResultRow[] = [];
    for (const row of checked) if (!(await this.db.result(id, row.puzzle_date, row.level, row.mode))?.checked) fresh.push(row);
    if (fresh.length) await this.db.saveResults(fresh, true);
    return this.summary(id, player.display_name);
  }

  /** A daily round just finished while signed in. The first checked result of a round stands. */
  private async result(id: string, body: Record<string, unknown>): Promise<Reply> {
    if (!(await this.db.player(id))) return fail(409, 'no_player', 'اختار اسمك الأول.');
    const play = asPlay(body);
    if (!play) return fail(400, 'bad_request', 'النتيجة ناقصة.');
    const row = this.check(id, play);
    if (row === 'wrong_day') return fail(400, 'wrong_day', 'السؤال ده مش بتاع النهارده.');
    if (row === 'bad_picks') return fail(400, 'bad_picks', 'النتيجة دي مش مطابقة لسؤال النهارده.');
    if (typeof row === 'string') return fail(400, 'bad_request', 'النتيجة ناقصة.');
    const existing = await this.db.result(id, row.puzzle_date, row.level, row.mode);
    if (existing?.checked) return { status: 200, json: { saved: false } };
    await this.db.saveResults([row], true);
    return { status: 200, json: { saved: true, points: row.won ? Math.max(0, 4 - row.attempts) : 0 } };
  }

  private async rename(id: string, raw: unknown): Promise<Reply> {
    const name = typeof raw === 'string' ? tidyName(raw) : '';
    const problem = checkDisplayName(name);
    if (problem) return fail(400, 'name', problem);
    if (!(await this.db.player(id))) return fail(409, 'no_player', 'اختار اسمك الأول.');
    if ((await this.db.rename(id, name, foldName(name))) === 'taken') return fail(409, 'name_taken', 'الاسم ده مستخدم. اختار اسم تاني.');
    return { status: 200, json: { player: { name } } };
  }
}
