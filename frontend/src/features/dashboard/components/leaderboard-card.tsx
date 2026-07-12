import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types/dashboard";

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  className?: string;
}

export function LeaderboardCard({ entries, className }: LeaderboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-2xs p-6 space-y-4 flex flex-col justify-between",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Department Leaderboard
        </span>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
          ESG Score
        </span>
      </div>

      <ul
        className="divide-y divide-border/40"
        aria-label="Department rankings"
      >
        {entries.map((entry) => (
          <li
            key={entry.name}
            className="flex items-center justify-between py-3 last:pb-0 text-xs text-left"
          >
            {/* Rank and Name */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px]",
                  entry.rank === 1 &&
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  entry.rank === 2 &&
                    "bg-slate-400/15 text-slate-600 dark:text-slate-400",
                  entry.rank === 3 &&
                    "bg-amber-700/10 text-amber-800 dark:text-amber-500",
                  entry.rank > 3 && "bg-muted text-muted-foreground",
                )}
              >
                {entry.rank}
              </span>
              <span className="font-semibold text-foreground">
                {entry.name}
              </span>
            </div>

            {/* Score & Trend */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-foreground">{entry.score}</span>
              <div
                className={cn(
                  "flex items-center justify-center h-5 w-5 rounded-md",
                  entry.trend === "up" && "text-success bg-success/5",
                  entry.trend === "down" && "text-destructive bg-destructive/5",
                  entry.trend === "stable" &&
                    "text-muted-foreground bg-muted/5",
                )}
              >
                <span className="sr-only">Trend: {entry.trend}</span>
                {entry.trend === "up" && <TrendingUp size={12} />}
                {entry.trend === "down" && <TrendingDown size={12} />}
                {entry.trend === "stable" && <Minus size={12} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
