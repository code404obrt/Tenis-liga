import { useState } from "react";
import { Trophy } from "lucide-react";
import LeaderboardFull from "../components/Leaderboard/LeaderboardFull";
import { useSeasons } from "../hooks/useLeaderboard";

export default function LeaderboardPage() {
  const { seasons, activeSeason, loading } = useSeasons();
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);

  const effectiveSeasonId = selectedSeasonId ?? activeSeason?.id ?? null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Leaderboard
        </h2>

        {seasons.length > 1 && (
          <select
            value={effectiveSeasonId ?? ""}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
            className="text-sm border border-border rounded-lg px-2 py-1.5 bg-secondary text-foreground"
          >
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}{s.is_active ? " (active)" : ""}
              </option>
            ))}
          </select>
        )}

        {seasons.length === 1 && activeSeason && (
          <span className="text-sm text-muted-foreground">{activeSeason.name}</span>
        )}
      </div>

      {loading || !effectiveSeasonId ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <LeaderboardFull seasonId={effectiveSeasonId} />
      )}
    </div>
  );
}
