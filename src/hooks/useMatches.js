import { supabase } from "../lib/supabase";

// Thin CRUD wrappers for the matches table. Keep business logic
// (ELO, stats) in Edge Functions — these are plain reads/writes.

export async function listRecentMatches(limit = 20) {
  return supabase
    .from("matches")
    .select("*")
    .order("played_at", { ascending: false })
    .limit(limit);
}

export async function getPendingForPlayer(playerId) {
  return supabase
    .from("matches")
    .select("*")
    .eq("status", "pending")
    .or(`player_a_id.eq.${playerId},player_b_id.eq.${playerId}`);
}

export async function submitMatch(match) {
  return supabase.from("matches").insert(match).select().single();
}

export async function confirmMatch(matchId) {
  return supabase
    .from("matches")
    .update({ status: "confirmed" })
    .eq("id", matchId);
}

export async function rejectMatch(matchId, reason) {
  const { error } = await supabase
    .from("matches")
    .update({ status: "disputed" })
    .eq("id", matchId);
  if (error) return { error };
  return supabase.from("disputes").insert({ match_id: matchId, reason });
}
