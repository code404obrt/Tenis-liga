import { Link } from "react-router-dom";
import Card from "../Common/Card";
import RankRow from "./RankRow";

export default function LeaderboardPreview({ players = [], currentPlayerId, eloChanges = {} }) {
  const top5 = players.slice(0, 5);
  const currentPlayerRank = players.findIndex((p) => p.id === currentPlayerId) + 1;
  const currentPlayerInTop5 = currentPlayerRank > 0 && currentPlayerRank <= 5;
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-tennis-dark">Leaderboard</h2>
        <Link to="/leaderboard" className="text-xs text-tennis-light">
          See all
        </Link>
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-gray-400">No players yet</p>
      ) : (
        <div className="space-y-1">
          {top5.map((p, i) => (
            <RankRow
              key={p.id}
              rank={i + 1}
              player={p}
              elo={p.elo}
              points={p.points ?? 0}
              highlight={p.id === currentPlayerId}
              flash={eloChanges[p.id]}
            />
          ))}

          {/* Always show logged-in player if outside top 5 */}
          {currentPlayer && !currentPlayerInTop5 && (
            <>
              <div className="border-t border-dashed border-gray-200 my-1" />
              <RankRow
                rank={currentPlayerRank}
                player={currentPlayer}
                elo={currentPlayer.elo}
                points={currentPlayer.points ?? 0}
                highlight
                flash={eloChanges[currentPlayer.id]}
              />
            </>
          )}
        </div>
      )}
    </Card>
  );
}
