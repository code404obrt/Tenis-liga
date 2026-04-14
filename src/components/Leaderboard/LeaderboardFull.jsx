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

function WinPct({ wins, losses }) {
  const total = wins + losses;
  if (total === 0) return <span className="text-gray-300">—</span>;
  return <>{Math.round((wins / total) * 100)}%</>;
}

function StreakLabel({ streak }) {
  if (!streak) return <span className="text-gray-300">—</span>;
  const isWin = streak > 0;
  return (
    <span className={isWin ? "text-tennis-light font-bold" : "text-red-500 font-bold"}>
      {isWin ? "W" : "L"}{Math.abs(streak)}
    </span>
  );
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
    <div className="bg-white rounded-2xl overflow-hidden">
      {rows.map((p, i) => {
        const isMe = p.id === player?.id;
        const total = p.wins + p.losses;
        return (
          <div
            key={p.id}
            className={clsx(
              "flex items-center gap-2.5 px-3.5 py-3 border-b border-gray-100 last:border-0",
              isMe && "bg-tennis-light/10"
            )}
          >
            {/* Rank */}
            <span className="w-5 shrink-0 text-sm font-bold text-tennis-dark">{i + 1}</span>

            {/* Avatar */}
            <span className="w-8 h-8 shrink-0 rounded-full bg-tennis-dark text-white grid place-items-center text-xs font-semibold">
              {initials(p.name)}
            </span>

            {/* Name + secondary stats */}
            <div className="flex-1 min-w-0">
              <p className={clsx("text-sm font-semibold truncate", isMe ? "text-tennis-dark" : "text-gray-900")}>
                {p.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                {p.elo} ELO &nbsp;·&nbsp;
                <span className="text-tennis-light font-semibold">{p.wins}W</span>{" "}
                <span className="text-red-400 font-semibold">{p.losses}L</span>
                {total > 0 && <> &nbsp;·&nbsp; <WinPct wins={p.wins} losses={p.losses} /></>}
                &nbsp;·&nbsp; <StreakLabel streak={p.streak} />
              </p>
            </div>

            {/* Points */}
            <div className="shrink-0 text-right">
              <span className="block text-lg font-extrabold text-gray-900">{p.points}</span>
              <span className="block text-[10px] text-gray-400">pts</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
