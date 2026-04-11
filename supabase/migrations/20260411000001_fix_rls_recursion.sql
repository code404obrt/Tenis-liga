-- Fix infinite recursion in RLS policies that query the players table
-- from within a policy on the players table. The admin check must run
-- with SECURITY DEFINER so it bypasses RLS on its inner query.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from players
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Players
drop policy if exists "Admin can manage players" on players;
create policy "Admin can manage players"
  on players for all
  to authenticated
  using (public.is_admin());

-- Seasons
drop policy if exists "Admin can manage seasons" on seasons;
create policy "Admin can manage seasons"
  on seasons for all
  to authenticated
  using (public.is_admin());

-- Matches
drop policy if exists "Admin can manage all matches" on matches;
create policy "Admin can manage all matches"
  on matches for all
  to authenticated
  using (public.is_admin());

-- Disputes
drop policy if exists "Admin can read all disputes" on disputes;
create policy "Admin can read all disputes"
  on disputes for select
  to authenticated
  using (public.is_admin());
