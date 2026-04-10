import Card from "../Common/Card";
import RankRow from "./RankRow";

// TODO: Fetch top 5 + always-include logged-in player.
// For now a static placeholder.
export default function LeaderboardPreview() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-tennis-dark">Leaderboard</h2>
        <a href="/leaderboard" className="text-xs text-tennis-light">See all</a>
      </div>
      <div className="space-y-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <RankRow
            key={i}
            rank={i}
            player={{ name: `Player ${i}` }}
            elo={1200}
            points={0}
            delta={0}
          />
        ))}
      </div>
    </Card>
  );
}
