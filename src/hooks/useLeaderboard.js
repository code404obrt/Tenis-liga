import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("seasons")
      .select("*")
      .order("start_date", { ascending: false })
      .then(({ data }) => {
        const rows = data ?? [];
        setSeasons(rows);
        setActiveSeason(rows.find((s) => s.is_active) ?? rows[0] ?? null);
        setLoading(false);
      });
  }, []);

  return { seasons, activeSeason, loading };
}

export function useLeaderboard(seasonId) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!seasonId) { setLoading(false); return; }
    setLoading(true);

    // All active players
    const { data: players } = await supabase
      .from("players")
      .select("id, name, elo")
      .eq("is_active", true);

    // Season stats for this season
    const { data: stats } = await supabase
      .from("season_stats")
      .select("player_id, wins, losses, points")
      .eq("season_id", seasonId);

    // Confirmed matches for streak calculation
    const { data: matches } = await supabase
      .from("matches")
      .select("player_a_id, player_b_id, sets_won_a, sets_won_b, played_at")
      .eq("season_id", seasonId)
      .eq("status", "confirmed")
      .order("played_at", { ascending: false });

    const statsMap = Object.fromEntries(
      (stats ?? []).map((s) => [s.player_id, s])
    );

    const streakMap = calcStreaks(players ?? [], matches ?? []);

    const merged = (players ?? []).map((p) => ({
      ...p,
      wins: statsMap[p.id]?.wins ?? 0,
      losses: statsMap[p.id]?.losses ?? 0,
      points: statsMap[p.id]?.points ?? 0,
      streak: streakMap[p.id] ?? 0,
    }));

    // Sort: points desc, then ELO desc
    merged.sort((a, b) => b.points - a.points || b.elo - a.elo);

    setRows(merged);
    setLoading(false);
  }, [seasonId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { rows, loading };
}

// Streak: positive = win streak, negative = loss streak
function calcStreaks(players, matches) {
  const streakMap = {};

  for (const p of players) {
    let streak = 0;
    let streakType = null; // "win" | "loss"

    for (const m of matches) {
      const isA = m.player_a_id === p.id;
      const isB = m.player_b_id === p.id;
      if (!isA && !isB) continue;

      const won = isA ? m.sets_won_a > m.sets_won_b : m.sets_won_b > m.sets_won_a;
      const result = won ? "win" : "loss";

      if (streakType === null) {
        streakType = result;
        streak = won ? 1 : -1;
      } else if (result === streakType) {
        streak = won ? streak + 1 : streak - 1;
      } else {
        break;
      }
    }

    streakMap[p.id] = streak;
  }

  return streakMap;
}

export async function getActiveSeason() {
  return supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();
}
