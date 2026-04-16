import { format, parseISO } from "date-fns";
import clsx from "clsx";

export default function MatchCard({ match, playerId }) {
  const isParticipant = playerId && (match.player_a_id === playerId || match.player_b_id === playerId);
  const isPlayerA = match.player_a_id === playerId;
  const sets = Array.isArray(match.sets) ? match.sets : [];
  const playedAt = match.played_at
    ? format(parseISO(match.played_at), "d MMM yyyy")
    : "—";

  if (isParticipant) {
    const opponent = isPlayerA ? match.player_b : match.player_a;
    const setsWonMe = isPlayerA ? match.sets_won_a : match.sets_won_b;
    const setsWonOpp = isPlayerA ? match.sets_won_b : match.sets_won_a;
    const won = setsWonMe > setsWonOpp;
    const scoreStr = sets
      .map((s) => (isPlayerA ? `${s.me}-${s.opp}` : `${s.opp}-${s.me}`))
      .join("  ");

    return (
      <div className="flex items-center justify-between px-3 py-3 border-b border-border last:border-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className={clsx(
            "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
            won ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {won ? "W" : "L"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{opponent?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">
              {playedAt} · {match.surface}
              {match.location ? ` · ${match.location}` : ""}
            </p>
          </div>
        </div>
        <span className="text-sm font-mono text-muted-foreground shrink-0 ml-2">{scoreStr}</span>
      </div>
    );
  }

  // League feed: show both players
  const scoreStr = sets.map((s) => `${s.me}-${s.opp}`).join("  ");
  const winnerIsA = match.sets_won_a > match.sets_won_b;

  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          <span className={winnerIsA ? "text-foreground font-semibold" : "text-muted-foreground"}>
            {match.player_a?.name ?? "—"}
          </span>
          <span className="text-muted-foreground font-normal"> vs </span>
          <span className={!winnerIsA ? "text-foreground font-semibold" : "text-muted-foreground"}>
            {match.player_b?.name ?? "—"}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {playedAt} · {match.surface}
          {match.location ? ` · ${match.location}` : ""}
        </p>
      </div>
      <span className="text-sm font-mono text-muted-foreground shrink-0 ml-2">{scoreStr}</span>
    </div>
  );
}
