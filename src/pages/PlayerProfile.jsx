import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { usePlayers } from "../hooks/usePlayers";
import { usePlayerMatches, useHeadToHead } from "../hooks/usePlayerProfile";
import Card from "../components/Common/Card";
import MatchCard from "../components/Match/MatchCard";
import clsx from "clsx";

export default function PlayerProfilePage() {
  const player = useAuthStore((s) => s.player);
  const { players } = usePlayers();
  const { matches, loading } = usePlayerMatches(player?.id);
  const [h2hOpponentId, setH2hOpponentId] = useState("");

  const opponents = players.filter((p) => p.id !== player?.id);
  const myStats = players.find((p) => p.id === player?.id);

  // Compute wins/losses/streak from match history
  const wins = matches.filter((m) => {
    const isA = m.player_a_id === player?.id;
    return isA ? m.sets_won_a > m.sets_won_b : m.sets_won_b > m.sets_won_a;
  }).length;
  const losses = matches.length - wins;
  const winPct = matches.length ? Math.round((wins / matches.length) * 100) : null;

  // Current streak
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
    <div className="space-y-4">
      {/* Hero */}
      <Card dark>
        <p className="text-xs uppercase opacity-70">My Profile</p>
        <h2 className="text-xl font-semibold mt-1">{player?.name ?? "—"}</h2>
        <div className="flex items-center gap-6 mt-3 text-sm">
          <Stat label="ELO" value={myStats?.elo ?? player?.elo ?? 1200} />
          <Stat label="W / L" value={`${wins} / ${losses}`} />
          <Stat label="Win%" value={winPct !== null ? `${winPct}%` : "—"} />
          <Stat
            label="Streak"
            value={streak ? `${streak > 0 ? "W" : "L"}${Math.abs(streak)}` : "—"}
          />
        </div>
      </Card>

      {/* Head to head */}
      <Card>
        <h3 className="font-semibold text-tennis-dark mb-3">Head to head</h3>
        <select
          value={h2hOpponentId}
          onChange={(e) => setH2hOpponentId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white mb-3"
        >
          <option value="">Select opponent…</option>
          {opponents.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {h2hOpponentId && (
          <HeadToHeadRecord playerId={player?.id} opponentId={h2hOpponentId} opponents={opponents} />
        )}
      </Card>

      {/* Match history */}
      <Card>
        <h3 className="font-semibold text-tennis-dark mb-1">Match history</h3>
        {loading ? (
          <p className="text-sm text-gray-400 py-3 text-center">Loading…</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-gray-400 py-3 text-center">No confirmed matches yet</p>
        ) : (
          <div>
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} playerId={player?.id} />
            ))}
          </div>
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

function HeadToHeadRecord({ playerId, opponentId, opponents }) {
  const { record, loading } = useHeadToHead(playerId, opponentId);
  const opponent = opponents.find((p) => p.id === opponentId);
  const total = record.wins + record.losses;

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
      <div className="text-center">
        <p className="text-2xl font-bold text-tennis-dark">{record.wins}</p>
        <p className="text-xs text-gray-500">You</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400">
          {total === 0 ? "No matches" : `${total} match${total !== 1 ? "es" : ""}`}
        </p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-400">{record.losses}</p>
        <p className="text-xs text-gray-500">{opponent?.name ?? "—"}</p>
      </div>
    </div>
  );
}
