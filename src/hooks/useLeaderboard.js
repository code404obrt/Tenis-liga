import { supabase } from "../lib/supabase";

// Leaderboard reads. Joins players onto season_stats so the UI can render
// name + ELO + points in one pass.
export async function getLeaderboard(seasonId) {
  return supabase
    .from("season_stats")
    .select("*, player:players(id, name, elo)")
    .eq("season_id", seasonId)
    .order("points", { ascending: false });
}

export async function getActiveSeason() {
  return supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();
}
