import LeaderboardFull from "../components/Leaderboard/LeaderboardFull";

export default function LeaderboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-tennis-dark">Leaderboard</h2>
      <LeaderboardFull />
    </div>
  );
}
