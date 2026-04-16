import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import Card from "../Common/Card";
import RankRow from "./RankRow";

export default function LeaderboardPreview({ players = [], currentPlayerId, eloChanges = {} }) {
  const top5 = players.slice(0, 5);
  const currentPlayerRank = players.findIndex((p) => p.id === currentPlayerId) + 1;
  const currentPlayerInTop5 = currentPlayerRank > 0 && currentPlayerRank <= 5;
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-card">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Standings
        </h2>
        <Link to="/leaderboard" className="text-xs text-primary hover:text-accent transition-colors">
          See all
        </Link>
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground p-4">No players yet</p>
      ) : (
        <div className="divide-y divide-border">
          {top5.map((p, i) => (
            <div key={p.id} className="px-2 py-0.5">
              <RankRow
                rank={i + 1}
                player={p}
                elo={p.elo}
                points={p.points ?? 0}
                highlight={p.id === currentPlayerId}
                flash={eloChanges[p.id]}
              />
            </div>
          ))}

          {/* Always show logged-in player if outside top 5 */}
          {currentPlayer && !currentPlayerInTop5 && (
            <>
              <div className="border-t border-dashed border-border mx-4" />
              <div className="px-2 py-0.5">
                <RankRow
                  rank={currentPlayerRank}
                  player={currentPlayer}
                  elo={currentPlayer.elo}
                  points={currentPlayer.points ?? 0}
                  highlight
                  flash={eloChanges[currentPlayer.id]}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
