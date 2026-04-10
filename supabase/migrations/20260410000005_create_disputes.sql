-- Disputes: created when opponent rejects a match result.
create table disputes (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references matches on delete cascade,
  rejected_by uuid not null references players on delete restrict,
  reason      text,
  created_at  timestamptz not null default now()
);

alter table disputes enable row level security;

-- Players can read disputes for their own matches
create policy "Players can read their own disputes"
  on disputes for select
  to authenticated
  using (
    exists (
      select 1 from matches m
      join players p on p.user_id = auth.uid()
      where m.id = disputes.match_id
        and (m.player_a_id = p.id or m.player_b_id = p.id)
    )
  );

-- A player can insert a dispute if they are player_b on the match
create policy "Opponent can create a dispute"
  on disputes for insert
  to authenticated
  with check (
    rejected_by = (select id from players where user_id = auth.uid())
  );

-- Admin can read all disputes
create policy "Admin can read all disputes"
  on disputes for select
  to authenticated
  using (
    exists (
      select 1 from players p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );
