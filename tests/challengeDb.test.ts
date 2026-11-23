// Phase 6: the game's database rules, run against the real migrations in PGlite (Postgres in
// WebAssembly), with Supabase's roles and auth.uid() stood in for. No network, no Supabase project.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const A = '00000000-0000-4000-8000-00000000000a';
const B = '00000000-0000-4000-8000-00000000000b';
const C = '00000000-0000-4000-8000-00000000000c';
const MIGRATIONS = join(import.meta.dirname, '..', 'supabase', 'migrations');

// What a Supabase project has before our migrations run: the API roles, auth.users and auth.uid().
const SUPABASE_STUB = `
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  -- Supabase grants the API roles everything on new public tables and functions; RLS and revokes narrow it.
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  create schema auth; grant usage on schema auth to anon, authenticated, service_role;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated;
`;

let db: PGlite;
const today = async (): Promise<string> => (await db.query<{ d: string }>(`select ((now() at time zone 'Africa/Cairo')::date)::text as d`)).rows[0].d;

/** Runs `sql` as an API role (anon, or authenticated as `user`), like PostgREST does. */
async function as<T>(role: 'anon' | 'authenticated', user: string | null, sql: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [user ?? '']);
    await tx.exec(`set local role ${role}`);
    return (await tx.query<T>(sql, params)).rows;
  });
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(SUPABASE_STUB);
  for (const file of readdirSync(MIGRATIONS).sort()) await db.exec(readFileSync(join(MIGRATIONS, file), 'utf8'));
  await db.exec(`insert into auth.users (id, email) values ('${A}', 'a@example.com'), ('${B}', 'b@example.com'), ('${C}', 'c@example.com')`);
  await db.exec(`insert into public.players (id, display_name, name_key) values
    ('${A}', 'سيف', 'سيف'), ('${B}', 'نور', 'نور'), ('${C}', 'هاني', 'هاني')`);
  const d = await today();
  // A: won today in two modes (3 + 2 points) and the two days before; B: one win today from the
  // first try (3) but slower, and an unchecked carried-over win; C: lost today.
  await db.query(
    `insert into public.player_results (user_id, puzzle_date, level, mode, question_id, won, attempts, seconds, checked) values
      ($1, $4::date, 'easy', 'who', 'q1', true, 1, 30, true), ($1, $4::date, 'easy', 'battle', 'q2', true, 2, 40, true),
      ($1, $4::date - 1, 'easy', 'who', 'q0', true, 1, 20, true), ($1, $4::date - 2, 'easy', 'who', 'q9', true, 3, 50, false),
      ($2, $4::date, 'easy', 'who', 'q1', true, 1, 90, true), ($2, $4::date, 'easy', 'place', 'q3', true, 1, 10, false),
      ($3, $4::date, 'easy', 'who', 'q1', false, 3, 60, true)`,
    [A, B, C, d],
  );
}, 60_000);
afterAll(async () => db?.close());

describe('row-level security', () => {
  it('a signed-in player reads only their own profile and results', async () => {
    expect(await as<{ id: string }>('authenticated', A, 'select id from public.players')).toEqual([{ id: A }]);
    const rows = await as<{ user_id: string }>('authenticated', A, 'select user_id from public.player_results');
    expect(rows.length).toBe(4);
    expect(new Set(rows.map((r) => r.user_id))).toEqual(new Set([A]));
    // Asking for someone else's rows by id returns nothing.
    expect(await as('authenticated', A, 'select * from public.player_results where user_id = $1', [B])).toEqual([]);
  });

  it('a signed-in player cannot write, change or delete anything, even their own rows', async () => {
    await expect(as('authenticated', A, `insert into public.player_results (user_id, puzzle_date, level, mode, question_id, won, attempts, seconds, checked) values ('${A}', now()::date, 'easy', 'era', 'x', true, 1, 5, true)`)).rejects.toThrow(/permission denied/);
    await expect(as('authenticated', A, `update public.players set display_name = 'زيد' where id = '${A}'`)).rejects.toThrow(/permission denied/);
    await expect(as('authenticated', A, `delete from public.player_results where user_id = '${A}'`)).rejects.toThrow(/permission denied/);
  });

  it('a guest (anon) reads no player data at all, and still cannot read the guest rows', async () => {
    await expect(as('anon', null, 'select * from public.players')).rejects.toThrow(/permission denied/);
    await expect(as('anon', null, 'select * from public.player_results')).rejects.toThrow(/permission denied/);
    expect(await as('anon', null, 'select * from public.challenge_results')).toEqual([]);
  });

  it('deleting the auth user deletes the profile and every result', async () => {
    await db.exec(`insert into auth.users (id) values ('00000000-0000-4000-8000-0000000000dd')`);
    await db.exec(`insert into public.players (id, display_name, name_key) values ('00000000-0000-4000-8000-0000000000dd', 'مؤقت', 'مؤقت')`);
    await db.exec(`insert into public.player_results (user_id, puzzle_date, level, mode, question_id, won, attempts, seconds, checked) values ('00000000-0000-4000-8000-0000000000dd', now()::date, 'mid', 'who', 'q', true, 1, 9, true)`);
    await db.exec(`delete from auth.users where id = '00000000-0000-4000-8000-0000000000dd'`);
    const left = await db.query<{ n: number }>(`select (select count(*) from public.players where id = '00000000-0000-4000-8000-0000000000dd') + (select count(*) from public.player_results where user_id = '00000000-0000-4000-8000-0000000000dd') as n`);
    expect(Number(left.rows[0].n)).toBe(0);
  });

  it('two players cannot share a name', async () => {
    await db.exec(`insert into auth.users (id) values ('00000000-0000-4000-8000-0000000000ee')`);
    await expect(db.exec(`insert into public.players (id, display_name, name_key) values ('00000000-0000-4000-8000-0000000000ee', 'سيف', 'سيف')`)).rejects.toThrow(/unique/);
  });
});

interface Board { total: number; rows: Record<string, unknown>[]; me: Record<string, unknown> | null }
const board = async (role: 'anon' | 'authenticated', user: string | null, level: string, period: string): Promise<Board> =>
  (await as<{ b: Board }>(role, user, 'select public.challenge_board($1, $2) as b', [level, period]))[0].b;

describe('challenge_board()', () => {
  it("today's board ranks by checked points, then fewer seconds, and shows names only", async () => {
    const b = await board('anon', null, 'easy', 'day');
    expect(b.total).toBe(3);
    expect(b.rows.map((r) => [r.rank, r.name, r.points, r.seconds])).toEqual([[1, 'سيف', 5, 70], [2, 'نور', 3, 90], [3, 'هاني', 0, 60]]);
    // B's unchecked win (10 s, 3 points) is not counted; no row carries an id or an email.
    expect(JSON.stringify(b)).not.toMatch(/0000-4000|@example/);
    expect(b.me).toBeNull();
  });

  it("gives a signed-in player their own row and marks it", async () => {
    const b = await board('authenticated', C, 'easy', 'day');
    expect(b.me).toMatchObject({ rank: 3, name: 'هاني', me: true });
    expect(b.rows.filter((r) => r.me)).toHaveLength(1);
  });

  it('the streak board counts any won day (carried over too), longest first', async () => {
    const b = await board('anon', null, 'easy', 'streak');
    expect(b.rows.map((r) => [r.name, r.best, r.current])).toEqual([['سيف', 3, 3], ['نور', 1, 1]]);
  });

  it('an empty level is an empty board, and an unknown one is refused', async () => {
    expect(await board('anon', null, 'hard', 'week')).toEqual({ total: 0, rows: [], me: null });
    await expect(board('anon', null, 'easy', 'year')).rejects.toThrow(/unknown board/);
  });
});
