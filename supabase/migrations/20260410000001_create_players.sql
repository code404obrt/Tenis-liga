-- Players: one row per user. user_id links to Supabase Auth.
create table players (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  name       text not null,
  email      text not null unique,
  elo        integer not null default 1200,
  role       text not null default 'player' check (role in ('player', 'admin')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table players enable row level security;

-- Anyone logged in can read all players
create policy "Players are readable by all authenticated users"
  on players for select
  to authenticated
  using (true);

-- Only admin can insert / update / delete
create policy "Admin can manage players"
  on players for all
  to authenticated
  using (
    exists (
      select 1 from players p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );
