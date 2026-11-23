-- «تحدي اليوم» accounts are open to every age (Mostafa, 2026-11-23): the 13+ question is gone, so its
-- timestamp is no longer stored. Applied while `players` was still empty.
alter table public.players drop column age_confirmed_at;
