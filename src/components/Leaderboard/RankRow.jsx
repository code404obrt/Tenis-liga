import clsx from "clsx";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function RankRow({ rank, player, elo, points, highlight, flash }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors",
        highlight && "bg-tennis-light/15 border border-tennis-light",
        flash === "win" && "flash-win",
        flash === "loss" && "flash-loss"
      )}
    >
      <span className="w-5 shrink-0 text-sm font-bold text-tennis-dark">{rank}</span>
      <span className="w-8 h-8 shrink-0 rounded-full bg-tennis-dark text-white grid place-items-center text-xs font-semibold">
        {initials(player?.name)}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{player?.name ?? "—"}</p>
        <p className="text-xs text-gray-400">{elo} ELO</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="block text-base font-extrabold text-gray-900">{points}</span>
        <span className="block text-[10px] text-gray-400">pts</span>
      </div>
    </div>
  );
}
