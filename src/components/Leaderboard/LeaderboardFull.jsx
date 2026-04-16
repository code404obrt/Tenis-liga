import clsx from "clsx";
import { Trophy, Medal } from "lucide-react";
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
  if (total === 0) return <span className="text-muted-foreground">—</span>;
  return <>{Math.round((wins / total) * 100)}%</>;
}

function StreakLabel({ streak }) {
  if (!streak) return <span className="text-muted-foreground">—</span>;
  const isWin = streak > 0;
  return (
    <span className={isWin ? "text-success font-bold" : "text-destructive font-bold"}>
      {isWin ? "W" : "L"}{Math.abs(streak)}
    </span>
  );
}

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-rank-gold" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-rank-silver" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-rank-bronze" />;
  return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground text-sm font-bold">{rank}</span>;
}

export default function LeaderboardFull({ seasonId }) {
  const { rows, loading } = useLeaderboard(seasonId);
  const player = useAuthStore((s) => s.player);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No players yet</p>;
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="divide-y divide-border">
        {rows.map((p, i) => {
          const isMe = p.id === player?.id;
          const total = p.wins + p.losses;
          return (
            <div
              key={p.id}
              className={clsx(
                "flex items-center gap-2.5 px-3.5 py-3 transition-colors",
                isMe ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-secondary/50"
              )}
            >
              {/* Rank */}
              <span className="w-5 shrink-0 flex items-center justify-center">
                <RankIcon rank={i + 1} />
              </span>

              {/* Avatar */}
              <span className="w-8 h-8 shrink-0 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-semibold">
                {initials(p.name)}
              </span>

              {/* Name + secondary stats */}
              <div className="flex-1 min-w-0">
                <p className={clsx("text-sm font-semibold truncate", isMe ? "text-primary" : "text-foreground")}>
                  {p.name}
                  {isMe && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                  {p.elo} ELO &nbsp;·&nbsp;
                  <span className="text-success font-semibold">{p.wins}W</span>{" "}
                  <span className="text-destructive font-semibold">{p.losses}L</span>
                  {total > 0 && <> &nbsp;·&nbsp; <WinPct wins={p.wins} losses={p.losses} /></>}
                  &nbsp;·&nbsp; <StreakLabel streak={p.streak} />
                </p>
              </div>

              {/* Points */}
              <div className="shrink-0 text-right">
                <span className="block text-lg font-display text-foreground">{p.points}</span>
                <span className="block text-[10px] text-muted-foreground">pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
