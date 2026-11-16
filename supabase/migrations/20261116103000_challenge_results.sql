-- «تحدي اليوم» (Nibras Phase 5), applied to the Supabase project "nibras" (kcxegvkkewuwaushhbis,
-- free tier, eu-central-1) on 2026-11-16. One row per device, day, level and mode. No personal
-- data: device_id is a random id the game makes on first play; nothing a player types is stored.
create table public.challenge_results (
  id bigint generated always as identity primary key,
  puzzle_date date not null,
  level text not null check (level in ('easy', 'mid', 'hard')),
  mode text not null check (mode in ('who', 'battle', 'place', 'year', 'number', 'leader', 'era', 'order')),
  question_id text not null check (char_length(question_id) between 1 and 80),
  device_id uuid not null,
  won boolean not null,
  attempts smallint not null check (attempts between 1 and 5),
  seconds integer not null check (seconds between 2 and 3600),
  created_at timestamptz not null default now(),
  unique (puzzle_date, level, mode, device_id)
);
create index challenge_results_puzzle on public.challenge_results (puzzle_date, level, mode);

alter table public.challenge_results enable row level security;

-- The game may add today's result (Cairo date, a day either side for clocks); it can never read rows.
create policy "players add today's result" on public.challenge_results
  for insert to anon
  with check (puzzle_date between (now() at time zone 'Africa/Cairo')::date - 1 and (now() at time zone 'Africa/Cairo')::date + 1);

-- Only aggregates leave the database: rank among today's solvers, how many solved slower, average picks.
-- (The Supabase linter warns that anon can run a SECURITY DEFINER function; that is the point: it
-- returns totals only.)
create or replace function public.challenge_stats(p_date date, p_level text, p_mode text, p_device uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  with mine as (
    select won, attempts, seconds, created_at from challenge_results
    where puzzle_date = p_date and level = p_level and mode = p_mode and device_id = p_device
  ),
  solved as (
    select attempts, seconds, created_at from challenge_results
    where puzzle_date = p_date and level = p_level and mode = p_mode and won
  )
  select json_build_object(
    'players', (select count(*) from challenge_results where puzzle_date = p_date and level = p_level and mode = p_mode),
    'solvers', (select count(*) from solved),
    'rank', (select count(*) from solved, mine where mine.won and solved.created_at <= mine.created_at),
    'slower', (select count(*) from solved, mine where mine.won and (solved.attempts, solved.seconds) > (mine.attempts, mine.seconds)),
    'avgAttempts', (select round(avg(attempts)::numeric, 1) from solved)
  );
$$;

revoke all on function public.challenge_stats(date, text, text, uuid) from public;
revoke execute on function public.challenge_stats(date, text, text, uuid) from authenticated;
grant execute on function public.challenge_stats(date, text, text, uuid) to anon;
