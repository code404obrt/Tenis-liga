import PlayerManagement from "./PlayerManagement";
import MatchManagement from "./MatchManagement";
import SeasonManagement from "./SeasonManagement";

export default function AdminPanel() {
  return (
    <div className="space-y-4">
      <PlayerManagement />
      <MatchManagement />
      <SeasonManagement />
    </div>
  );
}
