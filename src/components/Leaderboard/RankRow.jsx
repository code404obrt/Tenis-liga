import clsx from "clsx";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function RankRow({ rank, player, elo, points, delta, highlight }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg",
        highlight && "bg-tennis-light/15 border border-tennis-light"
      )}
    >
      <span className="w-6 text-sm font-semibold text-tennis-dark">{rank}</span>
      <span className="w-8 h-8 rounded-full bg-tennis-dark text-white grid place-items-center text-xs">
        {initials(player?.name)}
      </span>
      <span className="flex-1 truncate text-sm">{player?.name ?? "—"}</span>
      <span className="text-xs text-gray-500 w-12 text-right">{elo}</span>
      <span className="text-sm font-semibold w-10 text-right">{points}</span>
      {delta != null && (
        <span
          className={clsx(
            "text-xs w-6 text-right",
            delta > 0 ? "text-tennis-light" : delta < 0 ? "text-red-500" : "text-gray-400"
          )}
        >
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "–"}
        </span>
      )}
    </div>
  );
}
