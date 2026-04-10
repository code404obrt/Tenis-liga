import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import LeaderboardPreview from "../components/Leaderboard/LeaderboardPreview";

export default function Home() {
  return (
    <div className="space-y-4">
      {/* Hero card */}
      <Card dark>
        <p className="text-xs uppercase opacity-80">Spring 2025</p>
        <h2 className="text-xl font-semibold mt-1">Welcome back</h2>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <Stat label="Rank" value="—" />
          <Stat label="ELO" value="1200" />
          <Stat label="Streak" value="—" />
        </div>
      </Card>

      {/* Add match result CTA */}
      <Link to="/match/new" className="block">
        <Button size="lg">Add match result</Button>
      </Link>

      {/* Pending confirmation card slot */}
      {/* TODO: render PendingConfirmation when player has a pending match */}

      {/* Leaderboard preview */}
      <LeaderboardPreview />

      {/* My last match slot */}
      <Card>
        <h3 className="font-semibold text-tennis-dark mb-2">My last match</h3>
        <p className="text-sm text-gray-500">TODO — score display + won/lost pill</p>
      </Card>

      {/* Recent matches feed slot */}
      <Card>
        <h3 className="font-semibold text-tennis-dark mb-2">Recent matches</h3>
        <p className="text-sm text-gray-500">TODO — all players feed</p>
      </Card>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs opacity-80">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
