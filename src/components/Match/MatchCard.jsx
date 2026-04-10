// TODO: Render a single match row / card used in feeds and profile lists.
// Shows opponent, score, surface, date, and a Won/Lost/neutral pill.
export default function MatchCard({ match }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3 text-sm">
      Match #{match?.id ?? "—"} — TODO
    </div>
  );
}
