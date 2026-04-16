import { format, parseISO } from "date-fns";

export default function MatchFeedCard({ match, playerId }) {
  const sets = Array.isArray(match.sets) ? match.sets : [];
  const playedAt = match.played_at ? format(parseISO(match.played_at), "d MMM yyyy") : "—";
  const winnerIsA = match.sets_won_a > match.sets_won_b;

  const winnerName = winnerIsA ? match.player_a?.name : match.player_b?.name;
  const loserName  = winnerIsA ? match.player_b?.name : match.player_a?.name;
  const winnerSets = sets.map((s) => (winnerIsA ? s.me : s.opp));
  const loserSets  = sets.map((s) => (winnerIsA ? s.opp : s.me));

  const isParticipant = playerId && (match.player_a_id === playerId || match.player_b_id === playerId);
  const iWon = isParticipant && (
    (match.player_a_id === playerId && winnerIsA) ||
    (match.player_b_id === playerId && !winnerIsA)
  );

  return (
    <div className="py-3 border-b border-border last:border-0">
      {/* Winner row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-foreground truncate pr-2">
          {winnerName ?? "—"}
          {isParticipant && iWon && (
            <span className="ml-1.5 text-xs font-semibold text-primary">you</span>
          )}
        </span>
        <div className="flex shrink-0">
          {winnerSets.map((score, i) => (
            <span key={i} className="w-7 text-center text-sm font-bold text-primary font-mono">
              {score}
            </span>
          ))}
        </div>
      </div>

      {/* Loser row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-muted-foreground truncate pr-2">
          {loserName ?? "—"}
          {isParticipant && !iWon && (
            <span className="ml-1.5 text-xs font-semibold text-destructive">you</span>
          )}
        </span>
        <div className="flex shrink-0">
          {loserSets.map((score, i) => (
            <span key={i} className="w-7 text-center text-sm text-muted-foreground font-mono">
              {score}
            </span>
          ))}
        </div>
      </div>

      {/* Meta */}
      <p className="text-xs text-muted-foreground">
        {playedAt} · {match.surface}
        {match.location ? ` · ${match.location}` : ""}
      </p>
    </div>
  );
}
