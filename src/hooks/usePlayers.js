import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    // Get active season
    const { data: season } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .single();

    // Get all active players
    const { data: playerRows } = await supabase
      .from("players")
      .select("id, name, elo, role")
      .eq("is_active", true);

    if (!playerRows) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    // Get season stats if we have an active season
    let statsMap = {};
    if (season) {
      const { data: stats } = await supabase
        .from("season_stats")
        .select("player_id, wins, losses, points")
        .eq("season_id", season.id);

      if (stats) {
        statsMap = Object.fromEntries(stats.map((s) => [s.player_id, s]));
      }
    }

    // Merge and sort by ELO descending
    const merged = playerRows.map((p) => ({
      ...p,
      wins: statsMap[p.id]?.wins ?? 0,
      losses: statsMap[p.id]?.losses ?? 0,
      points: statsMap[p.id]?.points ?? 0,
    })).sort((a, b) => b.elo - a.elo);

    setPlayers(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { players, loading, refetch: fetch };
}
