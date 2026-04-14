import { format, parseISO } from "date-fns";
import clsx from "clsx";

export default function MatchCard({ match, playerId }) {
  const isPlayerA = match.player_a_id === playerId;
  const opponent = isPlayerA ? match.player_b : match.player_a;
  const setsWonMe = isPlayerA ? match.sets_won_a : match.sets_won_b;
  const setsWonOpp = isPlayerA ? match.sets_won_b : match.sets_won_a;
  const won = setsWonMe > setsWonOpp;
  const playedAt = match.played_at
    ? format(parseISO(match.played_at), "d MMM yyyy")
    : "—";

  // Build score string from player's perspective
  const sets = Array.isArray(match.sets) ? match.sets : [];
  const scoreStr = sets
    .map((s) => (isPlayerA ? `${s.me}-${s.opp}` : `${s.opp}-${s.me}`))
    .join("  ");

  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Won/Lost pill */}
        <span
          className={clsx(
            "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
            won
              ? "bg-tennis-light/15 text-tennis-dark"
              : "bg-red-50 text-red-500"
          )}
        >
          {won ? "W" : "L"}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{opponent?.name ?? "—"}</p>
          <p className="text-xs text-gray-400">
            {playedAt} · {match.surface}
            {match.location ? ` · ${match.location}` : ""}
          </p>
        </div>
      </div>
      <span className="text-sm font-mono text-gray-600 shrink-0 ml-2">
        {scoreStr}
      </span>
    </div>
  );
}
