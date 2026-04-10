-- Season stats: one row per player per season. Updated by Edge Function
-- when a match is confirmed.
create table season_stats (
  id        uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons on delete cascade,
  player_id uuid not null references players on delete cascade,
  wins      integer not null default 0,
  losses    integer not null default 0,
  points    integer not null default 0,   -- 3 per win, 0 per loss
  unique (season_id, player_id)
);

alter table season_stats enable row level security;

create policy "Season stats are readable by all authenticated users"
  on season_stats for select
  to authenticated
  using (true);

-- Only the service role (Edge Functions) writes to this table.
-- Players never write directly.
