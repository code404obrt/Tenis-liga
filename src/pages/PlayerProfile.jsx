import { useState } from "react";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { usePlayers } from "../hooks/usePlayers";
import { usePlayerMatches, useHeadToHead } from "../hooks/usePlayerProfile";
import Card from "../components/Common/Card";
import MatchCard from "../components/Match/MatchCard";

export default function PlayerProfilePage() {
  const player = useAuthStore((s) => s.player);
  const { players } = usePlayers();
  const { matches, loading } = usePlayerMatches(player?.id);
  const [h2hOpponentId, setH2hOpponentId] = useState("");

  const opponents = players.filter((p) => p.id !== player?.id);
  const myStats = players.find((p) => p.id === player?.id);

  const wins = matches.filter((m) => {
    const isA = m.player_a_id === player?.id;
    return isA ? m.sets_won_a > m.sets_won_b : m.sets_won_b > m.sets_won_a;
  }).length;
  const losses = matches.length - wins;
  const winPct = matches.length ? Math.round((wins / matches.length) * 100) : null;

  let streak = 0;
  let streakType = null;
  for (const m of matches) {
    const isA = m.player_a_id === player?.id;
    const won = isA ? m.sets_won_a > m.sets_won_b : m.sets_won_b > m.sets_won_a;
    const result = won ? "win" : "loss";
    if (streakType === null) { streakType = result; streak = won ? 1 : -1; }
    else if (result === streakType) { streak = won ? streak + 1 : streak - 1; }
    else break;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <Card dark>
        <p className="text-xs uppercase text-primary/70 tracking-wide">My Profile</p>
        <h2 className="font-display text-2xl mt-1">{player?.name ?? "—"}</h2>
        <div className="flex items-center gap-6 mt-3">
          <Stat label="ELO" value={myStats?.elo ?? player?.elo ?? 1200} />
          <Stat label="W / L" value={`${wins} / ${losses}`} />
          <Stat label="Win%" value={winPct !== null ? `${winPct}%` : "—"} />
          <Stat
            label="Streak"
            value={streak ? `${streak > 0 ? "W" : "L"}${Math.abs(streak)}` : "—"}
          />
        </div>
      </Card>

      {/* 2-column grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Head to head */}
        <Card className="p-0 overflow-hidden animate-slide-up">
          <div className="px-4 py-3 border-b border-border bg-gradient-card">
            <h3 className="font-display text-2xl">Head to Head</h3>
          </div>
          <div className="p-4">
            <select
              value={h2hOpponentId}
              onChange={(e) => setH2hOpponentId(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-secondary text-foreground mb-3"
            >
              <option value="">Select opponent…</option>
              {opponents.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {h2hOpponentId && (
              <HeadToHeadRecord playerId={player?.id} opponentId={h2hOpponentId} opponents={opponents} />
            )}
          </div>
        </Card>

        {/* Match history */}
        <Card className="p-0 overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="px-4 py-3 border-b border-border bg-gradient-card">
            <h3 className="font-display text-2xl">Match History</h3>
          </div>
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : matches.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center px-4">No confirmed matches yet</p>
            ) : (
              matches.map((m) => (
                <MatchCard key={m.id} match={m} playerId={player?.id} />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="font-display text-lg">{value}</div>
    </div>
  );
}

function HeadToHeadRecord({ playerId, opponentId, opponents }) {
  const { record, matches, loading } = useHeadToHead(playerId, opponentId);
  const opponent = opponents.find((p) => p.id === opponentId);
  const total = record.wins + record.losses;

  if (loading) return (
    <div className="flex items-center justify-center py-4">
      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Score summary */}
      <div className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
        <div className="text-center">
          <p className="font-display text-3xl text-success">{record.wins}</p>
          <p className="text-xs text-muted-foreground">You</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {total === 0 ? "No matches" : `${total} match${total !== 1 ? "es" : ""}`}
          </p>
        </div>
        <div className="text-center">
          <p className="font-display text-3xl text-destructive">{record.losses}</p>
          <p className="text-xs text-muted-foreground">{opponent?.name ?? "—"}</p>
        </div>
      </div>

      {/* Match list */}
      {matches.map((m) => {
        const iAmA = m.player_a_id === playerId;
        const sets = Array.isArray(m.sets) ? m.sets : [];
        const setsWonMe = iAmA ? m.sets_won_a : m.sets_won_b;
        const setsWonOpp = iAmA ? m.sets_won_b : m.sets_won_a;
        const won = setsWonMe > setsWonOpp;
        const scoreStr = sets.map((s) => (iAmA ? `${s.me}-${s.opp}` : `${s.opp}-${s.me}`)).join("  ");
        const playedAt = m.played_at ? format(parseISO(m.played_at), "d MMM yyyy") : "—";

        return (
          <div key={m.id} className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={clsx(
                "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                won ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {won ? "W" : "L"}
              </span>
              <p className="text-xs text-muted-foreground">{playedAt} · {m.surface}</p>
            </div>
            <span className="text-sm font-mono text-muted-foreground shrink-0">{scoreStr}</span>
          </div>
        );
      })}
    </div>
  );
}
