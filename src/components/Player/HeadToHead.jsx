// TODO: Head-to-head record vs a specific opponent.
export default function HeadToHead({ opponent }) {
  return (
    <div className="text-sm text-gray-500">
      HeadToHead — TODO ({opponent?.name ?? "—"})
    </div>
  );
}
