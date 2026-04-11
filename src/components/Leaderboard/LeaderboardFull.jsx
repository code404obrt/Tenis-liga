import clsx from "clsx";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useAuthStore } from "../../store/authStore";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function StreakBadge({ streak }) {
  if (!streak) return <span className="text-gray-300">—</span>;
  const isWin = streak > 0;
  return (
    <span
      className={clsx(
        "text-xs font-semibold",
        isWin ? "text-tennis-light" : "text-red-500"
      )}
    >
      {isWin ? "W" : "L"}{Math.abs(streak)}
    </span>
  );
}

function WinPct({ wins, losses }) {
  const total = wins + losses;
  if (total === 0) return <span className="text-gray-300">—</span>;
  return <span>{Math.round((wins / total) * 100)}%</span>;
}

export default function LeaderboardFull({ seasonId }) {
  const { rows, loading } = useLeaderboard(seasonId);
  const player = useAuthStore((s) => s.player);

  if (loading) {
    return <p className="text-sm text-gray-400 py-4 text-center">Loading…</p>;
  }

  if (rows.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No players yet</p>;
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_3rem_3rem_2rem_2rem_3rem_3rem] gap-x-2 px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-medium">
        <span>#</span>
        <span>Player</span>
        <span className="text-right">ELO</span>
        <span className="text-right">Pts</span>
        <span className="text-right">W</span>
        <span className="text-right">L</span>
        <span className="text-right">Win%</span>
        <span className="text-right">Streak</span>
      </div>

      {/* Rows */}
      {rows.map((p, i) => {
        const isMe = p.id === player?.id;
        return (
          <div
            key={p.id}
            className={clsx(
              "grid grid-cols-[2rem_1fr_3rem_3rem_2rem_2rem_3rem_3rem] gap-x-2 px-3 py-2.5 items-center border-b border-gray-50 last:border-0",
              isMe && "bg-tennis-light/10"
            )}
          >
            <span className="text-sm font-semibold text-tennis-dark">{i + 1}</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 shrink-0 rounded-full bg-tennis-dark text-white grid place-items-center text-xs">
                {initials(p.name)}
              </span>
              <span className={clsx("text-sm truncate", isMe && "font-semibold text-tennis-dark")}>
                {p.name}
              </span>
            </div>
            <span className="text-xs text-gray-500 text-right">{p.elo}</span>
            <span className="text-sm font-semibold text-right">{p.points}</span>
            <span className="text-sm text-right text-tennis-light font-medium">{p.wins}</span>
            <span className="text-sm text-right text-red-400 font-medium">{p.losses}</span>
            <span className="text-xs text-right text-gray-600">
              <WinPct wins={p.wins} losses={p.losses} />
            </span>
            <span className="text-right">
              <StreakBadge streak={p.streak} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
