-- Seasons: only one can be active at a time (enforced by partial unique index).
create table seasons (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  start_date date not null,
  end_date   date,
  is_active  boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ensures only one active season exists at any time
create unique index one_active_season on seasons (is_active) where is_active = true;

alter table seasons enable row level security;

create policy "Seasons are readable by all authenticated users"
  on seasons for select
  to authenticated
  using (true);

create policy "Admin can manage seasons"
  on seasons for all
  to authenticated
  using (
    exists (
      select 1 from players p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );
