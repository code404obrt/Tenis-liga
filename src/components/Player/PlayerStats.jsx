// TODO: Wins, losses, points, ELO, current streak tile row.
export default function PlayerStats({ stats }) {
  return (
    <div className="text-sm text-gray-500">
      PlayerStats — TODO ({stats ? "has data" : "no data"})
    </div>
  );
}
