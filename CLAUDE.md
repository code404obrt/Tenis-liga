# Tennis League App — Claude Context

## Project

A mobile-first web app for tracking tennis matches between 20 players.
Full plan: `../tennis-league-app-plan.md`

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS v3 — tennis green theme (`tennis-dark: #27500A`, `tennis-light: #639922`, `tennis-bg: #F5F5F5`)
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **State:** Zustand (`authStore`, `matchStore`, `uiStore`)
- **Router:** react-router-dom v6
- **Icons:** lucide-react
- **Utils:** clsx, date-fns

## Supabase Project

- Project ref: `ajzyadgkvviuldgsiecp`
- URL in `.env.local` (gitignored)
- Migrations in `supabase/migrations/`

## Database Tables

- `players` — one row per user. `user_id` links to `auth.users`. Has `role` (player/admin), `elo` (default 1200), `is_active`
- `seasons` — only one active at a time (partial unique index on `is_active = true`)
- `matches` — `sets` stored as JSONB array `[{me, opp, tiebreak?}]`. `player_a_id` is always the submitter
- `season_stats` — written only by Edge Functions (server-side), never directly from frontend
- `disputes` — created when opponent rejects a match

## RLS

All tables have RLS enabled. Admin policies use `public.is_admin()` SECURITY DEFINER function to avoid infinite recursion (players policy querying players table).

## Auth

- No self-signup — admin creates all accounts manually (Supabase dashboard + SQL insert)
- Admin creates auth user in Supabase dashboard, then inserts player row via SQL
- `useAuth()` called once in `AuthProvider` in `App.jsx` — bootstraps session and fetches player row
- All other components read from `useAuthStore()`

## Key Decisions

- `season_stats` and ELO are updated server-side only (Edge Function on match confirm) — never on frontend
- Pending matches excluded from all stats and leaderboard
- `usePlayers()` hook fetches players ordered by ELO descending — used for rank calculation and leaderboard
- Admin panel planned but not yet built — player creation is manual for now

## Current Progress

### Done
- [x] Vite + React scaffold
- [x] Tailwind with tennis green theme
- [x] Supabase project + schema migrations (5 tables + RLS)
- [x] Authentication (login/logout, protected routes, player row fetch)
- [x] Home screen with real data (hero card, leaderboard preview)
- [x] App shell (Header, Sidebar, Navigation)
- [x] New Match form — scoreboard with progressive set unlocking, tiebreak input, surface/date/location, validation with error feedback, submit to Supabase

### In Progress / Next
- [ ] Match confirmation flow (pending card on home, confirm/reject by opponent)
- [ ] Email notifications (on submit, on reject, on confirm)
- [ ] ELO + points Edge Function (runs server-side on match confirm)
- [ ] Leaderboard page (full, with season selector)
- [ ] Player profile page
- [ ] Admin panel (create players, manage seasons, override matches)

## Match Submission Notes

- `sets` stored as JSONB: only filled sets included (2 or 3 entries)
- `player_a_id` = submitter, `player_b_id` = opponent
- `season_id` required — match submit button disabled if no active season
- Valid set scores: 6-0 to 6-4, 7-5, 7-6 (tiebreak). 6-5 is invalid.
- `sets_won_a` / `sets_won_b` computed on frontend from validation, stored on submit
- Status starts as `pending`, moves to `confirmed` or `disputed` via opponent action

## Running the App

```bash
cd tennis-league-app
npm run dev
```

## Pushing DB Migrations

```bash
supabase db push
```
