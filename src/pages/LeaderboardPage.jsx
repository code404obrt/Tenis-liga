import { useState } from "react";
import LeaderboardFull from "../components/Leaderboard/LeaderboardFull";
import { useSeasons } from "../hooks/useLeaderboard";

export default function LeaderboardPage() {
  const { seasons, activeSeason, loading } = useSeasons();
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);

  // Use selected season, falling back to active season
  const effectiveSeasonId = selectedSeasonId ?? activeSeason?.id ?? null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-tennis-dark">Leaderboard</h2>

        {/* Season selector */}
        {seasons.length > 1 && (
          <select
            value={effectiveSeasonId ?? ""}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
          >
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.is_active ? " (active)" : ""}
              </option>
            ))}
          </select>
        )}

        {seasons.length === 1 && activeSeason && (
          <span className="text-sm text-gray-500">{activeSeason.name}</span>
        )}
      </div>

      {loading || !effectiveSeasonId ? (
        <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
      ) : (
        <LeaderboardFull seasonId={effectiveSeasonId} />
      )}
    </div>
  );
}
