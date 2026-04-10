-- Matches: core table. sets is a JSONB array: [{me, opp, tiebreak?}, ...]
-- player_a is always the submitter.
create table matches (
  id           uuid primary key default gen_random_uuid(),
  season_id    uuid not null references seasons on delete restrict,
  player_a_id  uuid not null references players on delete restrict,
  player_b_id  uuid not null references players on delete restrict,
  submitted_by uuid not null references players on delete restrict,
  sets         jsonb not null default '[]',
  sets_won_a   integer,
  sets_won_b   integer,
  surface      text not null default 'Clay'
                 check (surface in ('Clay', 'Hard', 'Grass', 'Indoor')),
  location     text,
  played_at    date not null default current_date,
  status       text not null default 'pending'
                 check (status in ('pending', 'confirmed', 'disputed', 'voided')),
  created_at   timestamptz not null default now(),
  constraint different_players check (player_a_id <> player_b_id)
);

alter table matches enable row level security;

-- All authenticated users can read matches
create policy "Matches are readable by all authenticated users"
  on matches for select
  to authenticated
  using (true);

-- A player can submit a match (insert) if they are one of the two players
create policy "Players can submit their own matches"
  on matches for insert
  to authenticated
  with check (
    player_a_id = (select id from players where user_id = auth.uid())
    or player_b_id = (select id from players where user_id = auth.uid())
  );

-- A player can update only their own matches while status is pending/disputed
create policy "Players can update their own pending matches"
  on matches for update
  to authenticated
  using (
    (
      player_a_id = (select id from players where user_id = auth.uid())
      or player_b_id = (select id from players where user_id = auth.uid())
    )
    and status in ('pending', 'disputed')
  );

-- Admin can do anything
create policy "Admin can manage all matches"
  on matches for all
  to authenticated
  using (
    exists (
      select 1 from players p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );
