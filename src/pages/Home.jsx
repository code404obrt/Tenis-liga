import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import LeaderboardPreview from "../components/Leaderboard/LeaderboardPreview";
import PendingConfirmationCard from "../components/Match/PendingConfirmationCard";
import MatchCard from "../components/Match/MatchCard";
import MatchFeedCard from "../components/Match/MatchFeedCard";
import { useAuthStore } from "../store/authStore";
import { usePlayers } from "../hooks/usePlayers";
import { usePendingMatches } from "../hooks/usePendingMatches";
import { supabase } from "../lib/supabase";

export default function Home() {
  const player = useAuthStore((s) => s.player);
  const { players, refetch: refetchPlayers } = usePlayers();
  const { matches: pendingMatches, refetch: refetchPending } = usePendingMatches(player?.id);
  const [eloChanges, setEloChanges] = useState({});
  const [myLastMatch, setMyLastMatch] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const playersRef = useRef(players);
  useEffect(() => { playersRef.current = players; }, [players]);

  const fetchHomeMatches = useCallback(async () => {
    if (!player?.id) return;
    // My last confirmed match
    const { data: myMatches } = await supabase
      .from("matches")
      .select("*, player_a:player_a_id(id, name), player_b:player_b_id(id, name)")
      .or(`player_a_id.eq.${player.id},player_b_id.eq.${player.id}`)
      .eq("status", "confirmed")
      .order("played_at", { ascending: false })
      .limit(1);
    setMyLastMatch(myMatches?.[0] ?? null);

    // Recent confirmed matches (all players)
    const { data: recent } = await supabase
      .from("matches")
      .select("*, player_a:player_a_id(id, name), player_b:player_b_id(id, name)")
      .eq("status", "confirmed")
      .order("played_at", { ascending: false })
      .limit(5);
    setRecentMatches(recent ?? []);
  }, [player]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on deps change
  useEffect(() => { fetchHomeMatches(); }, [fetchHomeMatches]);

  function onMatchAction() {
    refetchPending();
    // Snapshot ELO before Edge Function runs
    const snapshot = Object.fromEntries(playersRef.current.map((p) => [p.id, p.elo]));
    // Wait for Edge Function to update ELO, then refetch
    setTimeout(() => {
      refetchPlayers();
      fetchHomeMatches();
      // After state updates, compare new ELO vs snapshot
      setTimeout(() => {
        const changes = {};
        playersRef.current.forEach((p) => {
          const prev = snapshot[p.id];
          if (prev !== undefined && p.elo !== prev) {
            changes[p.id] = p.elo > prev ? "win" : "loss";
          }
        });
        if (Object.keys(changes).length > 0) {
          setEloChanges(changes);
          setTimeout(() => setEloChanges({}), 1400);
        }
      }, 200);
    }, 500);
  }

  // Rank = position in players list sorted by ELO (1-based)
  const rank = players.length
    ? players.findIndex((p) => p.id === player?.id) + 1
    : null;

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <Card dark>
        <p className="text-xs uppercase opacity-70">Tennis League</p>
        <h2 className="text-xl font-semibold mt-1">
          {player?.name ?? "Welcome"}
        </h2>
        <div className="flex items-center gap-6 mt-3 text-sm">
          <Stat label="Rank" value={rank ? `#${rank}` : "—"} />
          <Stat label="ELO" value={player?.elo ?? 1200} />
          <Stat label="Streak" value="—" />
        </div>
      </Card>

      {/* Add match result CTA */}
      <Link to="/match/new" className="block">
        <Button size="lg">Add match result</Button>
      </Link>

      {/* Pending confirmation cards */}
      {pendingMatches.map((match) => (
        <PendingConfirmationCard key={match.id} match={match} onAction={onMatchAction} />
      ))}

      {/* Leaderboard preview */}
      <LeaderboardPreview players={players} currentPlayerId={player?.id} eloChanges={eloChanges} />

      {/* My last match */}
      <Card>
        <h3 className="font-semibold text-tennis-dark mb-2">My last match</h3>
        {myLastMatch ? (
          <MatchCard match={myLastMatch} playerId={player?.id} />
        ) : (
          <p className="text-sm text-gray-400">No matches yet</p>
        )}
      </Card>

      {/* Recent matches feed */}
      <Card>
        <h3 className="font-semibold text-tennis-dark mb-2">Recent matches</h3>
        {recentMatches.length > 0 ? (
          recentMatches.map((m) => (
            <MatchFeedCard key={m.id} match={m} />
          ))
        ) : (
          <p className="text-sm text-gray-400">No matches yet</p>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
