-- Incremental upsert for season_stats: inserts if new, adds to existing counts if row exists.
create or replace function public.upsert_season_stats(
  p_season_id uuid,
  p_player_id uuid,
  p_wins integer,
  p_losses integer,
  p_points integer
) returns void
language sql
security definer
as $$
  insert into season_stats (season_id, player_id, wins, losses, points)
  values (p_season_id, p_player_id, p_wins, p_losses, p_points)
  on conflict (season_id, player_id)
  do update set
    wins   = season_stats.wins   + excluded.wins,
    losses = season_stats.losses + excluded.losses,
    points = season_stats.points + excluded.points;
$$;
