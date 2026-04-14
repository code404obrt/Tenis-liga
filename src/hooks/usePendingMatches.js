import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// Fetches pending matches where the logged-in player is the opponent (player_b)
// — i.e. matches they need to confirm or reject.
export function usePendingMatches(playerId) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    if (!playerId) return;
    setLoading(true);
    supabase
      .from("matches")
      .select("*, submitter:player_a_id(id, name), opponent:player_b_id(id, name)")
      .eq("player_b_id", playerId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMatches(data ?? []);
        setLoading(false);
      });
  }, [playerId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on deps change
  useEffect(() => { fetch(); }, [fetch]);

  return { matches, loading, refetch: fetch };
}
