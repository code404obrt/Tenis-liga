import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Fetches all active players sorted by ELO descending.
// Used for leaderboard display and opponent selectors.
export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("players")
      .select("id, name, elo, role")
      .eq("is_active", true)
      .order("elo", { ascending: false })
      .then(({ data }) => {
        setPlayers(data ?? []);
        setLoading(false);
      });
  }, []);

  return { players, loading };
}
