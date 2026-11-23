-- «تحدي اليوم» accounts and leaderboard (Nibras Phase 6), on the Supabase project "nibras"
-- (kcxegvkkewuwaushhbis, free tier). Google sign-in, 13+ only (Mostafa, 2026-11-22).
--
-- Only the Vercel function /api/challenge writes these tables (secret key, which bypasses RLS):
-- it checks every round against the day's puzzle before saving it. A signed-in player may read
-- their own profile and results, nobody else's; the leaderboard leaves the database only through
-- challenge_board(), which returns display names and scores, never ids or emails.
-- Deleting the auth user (the account page's «احذف حسابي وبياناتي») deletes both by cascade.

create table public.players (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 20),
  -- The name folded for comparison (no diacritics, one space, lower case): two players can't share it.
  name_key text not null unique check (char_length(name_key) between 2 and 20),
  -- When the player confirmed they are 13 or older (asked before Google sign-in).
  age_confirmed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.player_results (
  user_id uuid not null references public.players (id) on delete cascade,
  puzzle_date date not null,
  level text not null check (level in ('easy', 'mid', 'hard')),
  mode text not null check (mode in ('who', 'battle', 'place', 'year', 'number', 'leader', 'era', 'order')),
  question_id text not null check (char_length(question_id) between 1 and 80),
  won boolean not null,
  -- Up to 5 for rounds carried over from before 5G (five tries then); three since.
  attempts smallint not null check (attempts between 1 and 5),
  seconds integer not null check (seconds between 2 and 3600),
  -- Board points: a win on the first try 3, second 2, third 1; a loss 0.
  points smallint generated always as (case when won then greatest(0, 4 - attempts) else 0 end) stored,
  -- True when the function re-played the picks against the day's round. Rounds carried over from
  -- the guest's anonymous rows (challenge_results) count for streaks only, never for points.
  checked boolean not null,
  created_at timestamptz not null default now(),
  primary key (user_id, puzzle_date, level, mode)
);
create index player_results_board on public.player_results (level, puzzle_date) where checked;
create index player_results_wins on public.player_results (level, user_id, puzzle_date) where won;

alter table public.players enable row level security;
alter table public.player_results enable row level security;

revoke all on public.players, public.player_results from anon, authenticated;
grant select on public.players, public.player_results to authenticated;

create policy "a player reads their own profile" on public.players
  for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = id);
create policy "a player reads their own results" on public.player_results
  for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- The leaderboard for a level: 'day' (today's points, then fewer seconds), 'week' (since Saturday,
-- Cairo), 'streak' (longest run of won days, then the current run). Top 10, the caller's own row
-- (when signed in) and the number of players. Dates are the server's Cairo date, never the caller's.
create or replace function public.challenge_board(p_level text, p_period text)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'Africa/Cairo')::date;
  since date;
  caller uuid := auth.uid();
  result json;
begin
  if p_level not in ('easy', 'mid', 'hard') or p_period not in ('day', 'week', 'streak') then
    raise exception 'unknown board' using errcode = '22023';
  end if;

  if p_period = 'streak' then
    with days as (
      select distinct user_id, puzzle_date as d from player_results where level = p_level and won
    ), grouped as (
      select user_id, d, d - (row_number() over (partition by user_id order by d))::int as grp from days
    ), runs as (
      select user_id, count(*)::int as len, max(d) as last from grouped group by user_id, grp
    ), per as (
      select user_id, max(len) as best, coalesce(max(len) filter (where last >= today - 1), 0) as cur
      from runs group by user_id
    ), ranked as (
      select rank() over (order by per.best desc, per.cur desc) as rk, per.*, p.display_name
      from per join players p on p.id = per.user_id
    )
    select json_build_object(
      'total', (select count(*) from ranked),
      'rows', coalesce((select json_agg(json_build_object('rank', rk, 'name', display_name, 'best', best, 'current', cur, 'me', user_id = caller) order by rk, display_name)
                        from (select * from ranked order by rk, display_name limit 10) top), '[]'::json),
      'me', (select json_build_object('rank', rk, 'name', display_name, 'best', best, 'current', cur, 'me', true) from ranked where user_id = caller)
    ) into result;
  else
    -- Saturday starts the week (extract(dow): Sunday 0 … Saturday 6).
    since := case when p_period = 'day' then today else today - ((extract(dow from today)::int + 1) % 7) end;
    with per as (
      select user_id, sum(points)::int as pts, sum(seconds)::int as secs, count(*)::int as rounds
      from player_results
      where level = p_level and checked and puzzle_date between since and today
      group by user_id
    ), ranked as (
      select rank() over (order by per.pts desc, per.secs asc) as rk, per.*, p.display_name
      from per join players p on p.id = per.user_id
    )
    select json_build_object(
      'total', (select count(*) from ranked),
      'rows', coalesce((select json_agg(json_build_object('rank', rk, 'name', display_name, 'points', pts, 'seconds', secs, 'rounds', rounds, 'me', user_id = caller) order by rk, display_name)
                        from (select * from ranked order by rk, display_name limit 10) top), '[]'::json),
      'me', (select json_build_object('rank', rk, 'name', display_name, 'points', pts, 'seconds', secs, 'rounds', rounds, 'me', true) from ranked where user_id = caller)
    ) into result;
  end if;
  return result;
end;
$$;

revoke all on function public.challenge_board(text, text) from public;
grant execute on function public.challenge_board(text, text) to anon, authenticated;
