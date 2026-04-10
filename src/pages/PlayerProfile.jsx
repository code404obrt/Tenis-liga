import PlayerProfileView from "../components/Player/PlayerProfile";
import PlayerStats from "../components/Player/PlayerStats";

export default function PlayerProfilePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-tennis-dark">My Profile</h2>
      <PlayerStats />
      <PlayerProfileView />
    </div>
  );
}
