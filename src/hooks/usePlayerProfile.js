import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Fetches confirmed matches for a player, joined with opponent name.
export function usePlayerMatches(playerId) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;

    supabase
      .from("matches")
      .select("*, player_a:player_a_id(id, name), player_b:player_b_id(id, name)")
      .or(`player_a_id.eq.${playerId},player_b_id.eq.${playerId}`)
      .eq("status", "confirmed")
      .order("played_at", { ascending: false })
      .then(({ data }) => {
        setMatches(data ?? []);
        setLoading(false);
      });
  }, [playerId]);

  return { matches, loading };
}

// Head-to-head record between two players
export function useHeadToHead(playerId, opponentId) {
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId || !opponentId) return;

    supabase
      .from("matches")
      .select("player_a_id, sets_won_a, sets_won_b")
      .or(
        `and(player_a_id.eq.${playerId},player_b_id.eq.${opponentId}),and(player_a_id.eq.${opponentId},player_b_id.eq.${playerId})`
      )
      .eq("status", "confirmed")
      .then(({ data }) => {
        let wins = 0;
        let losses = 0;
        for (const m of data ?? []) {
          const iAmA = m.player_a_id === playerId;
          const won = iAmA ? m.sets_won_a > m.sets_won_b : m.sets_won_b > m.sets_won_a;
          if (won) wins++;
          else losses++;
        }
        setRecord({ wins, losses });
        setLoading(false);
      });
  }, [playerId, opponentId]);

  return { record, loading };
}
