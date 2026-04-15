import { format, parseISO } from "date-fns";

// Displays a match in the "option-a" feed style:
// winner name + bold scores on top, loser name + muted scores below, meta underneath.
// Works for both league feed (no playerId) and personal context (playerId provided).
export default function MatchFeedCard({ match, playerId }) {
  const sets = Array.isArray(match.sets) ? match.sets : [];
  const playedAt = match.played_at ? format(parseISO(match.played_at), "d MMM yyyy") : "—";
  const winnerIsA = match.sets_won_a > match.sets_won_b;

  // Determine winner/loser names
  const winnerName = winnerIsA ? match.player_a?.name : match.player_b?.name;
  const loserName = winnerIsA ? match.player_b?.name : match.player_a?.name;

  // Scores per set: winner row and loser row
  // sets[i].me = player_a score, sets[i].opp = player_b score
  const winnerSets = sets.map((s) => (winnerIsA ? s.me : s.opp));
  const loserSets  = sets.map((s) => (winnerIsA ? s.opp : s.me));

  // If viewing as a participant, bold the "you" label
  const isParticipant = playerId && (match.player_a_id === playerId || match.player_b_id === playerId);
  const iWon = isParticipant && (
    (match.player_a_id === playerId && winnerIsA) ||
    (match.player_b_id === playerId && !winnerIsA)
  );

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      {/* Winner row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-gray-900 truncate pr-2">
          {winnerName ?? "—"}
          {isParticipant && iWon && <span className="ml-1.5 text-xs font-semibold text-tennis-light">you</span>}
        </span>
        <div className="flex shrink-0">
          {winnerSets.map((score, i) => (
            <span key={i} className="w-7 text-center text-sm font-bold text-tennis-dark font-mono">
              {score}
            </span>
          ))}
        </div>
      </div>

      {/* Loser row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-400 truncate pr-2">
          {loserName ?? "—"}
          {isParticipant && !iWon && <span className="ml-1.5 text-xs font-semibold text-red-400">you</span>}
        </span>
        <div className="flex shrink-0">
          {loserSets.map((score, i) => (
            <span key={i} className="w-7 text-center text-sm text-gray-300 font-mono">
              {score}
            </span>
          ))}
        </div>
      </div>

      {/* Meta */}
      <p className="text-xs text-gray-400">
        {playedAt} · {match.surface}
        {match.location ? ` · ${match.location}` : ""}
      </p>
    </div>
  );
}
