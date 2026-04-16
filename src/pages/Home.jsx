import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
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
    const { data: myMatches } = await supabase
      .from("matches")
      .select("*, player_a:player_a_id(id, name), player_b:player_b_id(id, name)")
      .or(`player_a_id.eq.${player.id},player_b_id.eq.${player.id}`)
      .eq("status", "confirmed")
      .order("played_at", { ascending: false })
      .limit(1);
    setMyLastMatch(myMatches?.[0] ?? null);

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
    const snapshot = Object.fromEntries(playersRef.current.map((p) => [p.id, p.elo]));
    setTimeout(() => {
      refetchPlayers();
      fetchHomeMatches();
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

  const rank = players.length
    ? players.findIndex((p) => p.id === player?.id) + 1
    : null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero card + CTA */}
      <div className="flex items-start justify-between gap-4">
        <Card dark className="flex-1">
          <p className="text-xs uppercase text-primary/70 tracking-wide">Tennis League</p>
          <h2 className="text-xl font-display mt-1">{player?.name ?? "Welcome"}</h2>
          <div className="flex items-center gap-6 mt-3 text-sm">
            <Stat label="Rank" value={rank ? `#${rank}` : "—"} />
            <Stat label="ELO" value={player?.elo ?? 1200} />
            <Stat label="Streak" value="—" />
          </div>
        </Card>
        <Link to="/match/new" className="shrink-0 mt-1">
          <Button size="md" className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            Add match
          </Button>
        </Link>
      </div>

      {/* Pending confirmation cards */}
      {pendingMatches.map((match) => (
        <PendingConfirmationCard key={match.id} match={match} onAction={onMatchAction} />
      ))}

      {/* 2-column grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Standings */}
        <div className="animate-slide-up">
          <LeaderboardPreview players={players} currentPlayerId={player?.id} eloChanges={eloChanges} />
        </div>

        {/* Right: Recent matches */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-gradient-card">
              <h3 className="font-display text-2xl">Recent Matches</h3>
            </div>
            <div className="px-4">
              {recentMatches.length > 0 ? (
                recentMatches.map((m) => (
                  <MatchFeedCard key={m.id} match={m} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">No matches yet</p>
              )}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-gradient-card">
              <h3 className="font-display text-2xl">My Last Match</h3>
            </div>
            <div>
              {myLastMatch ? (
                <MatchCard match={myLastMatch} playerId={player?.id} />
              ) : (
                <p className="text-sm text-muted-foreground px-4 py-4">No matches yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="text-base font-display text-lg">{value}</div>
    </div>
  );
}
