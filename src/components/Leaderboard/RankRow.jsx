import { Trophy, Medal } from "lucide-react";
import clsx from "clsx";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-rank-gold" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-rank-silver" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-rank-bronze" />;
  return (
    <span className="w-5 h-5 flex items-center justify-center text-muted-foreground text-sm font-bold">
      {rank}
    </span>
  );
}

export default function RankRow({ rank, player, elo, points, highlight, flash }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors",
        highlight && "bg-primary/10 border border-primary/30",
        flash === "win" && "flash-win",
        flash === "loss" && "flash-loss"
      )}
    >
      <span className="w-5 shrink-0 flex items-center justify-center">
        <RankIcon rank={rank} />
      </span>
      <span className="w-8 h-8 shrink-0 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-semibold">
        {initials(player?.name)}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{player?.name ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{elo} ELO</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="block text-base font-extrabold text-foreground">{points}</span>
        <span className="block text-[10px] text-muted-foreground">pts</span>
      </div>
    </div>
  );
}
