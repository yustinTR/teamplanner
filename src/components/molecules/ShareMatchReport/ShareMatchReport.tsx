import { cn } from "@/lib/utils";

interface StatEntry {
  playerName: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

interface ShareMatchReportProps {
  teamName: string;
  opponent: string;
  homeAway: "home" | "away";
  matchDate: string;
  scoreHome: number;
  scoreAway: number;
  stats: StatEntry[];
  className?: string;
}

export function ShareMatchReport({
  teamName,
  opponent,
  homeAway,
  matchDate,
  scoreHome,
  scoreAway,
  stats,
  className,
}: ShareMatchReportProps) {
  const date = new Date(matchDate);
  const dateStr = date.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const homeName = homeAway === "home" ? teamName : opponent;
  const awayName = homeAway === "away" ? teamName : opponent;

  const goalScorers = stats.filter((s) => s.goals > 0);
  const assistMakers = stats.filter((s) => s.assists > 0);
  const yellowCards = stats.filter((s) => s.yellow_cards > 0);
  const redCards = stats.filter((s) => s.red_cards > 0);

  return (
    <div
      className={cn(
        "flex w-[540px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white",
        className
      )}
    >
      {/* Date */}
      <p className="text-center text-sm text-white/50">
        {dateStr} · {timeStr}
      </p>

      {/* Score */}
      <div className="my-4 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="text-lg font-semibold">{homeName}</span>
          <span className="text-4xl font-bold tabular-nums">
            {scoreHome} - {scoreAway}
          </span>
          <span className="text-lg font-semibold">{awayName}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        {goalScorers.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Doelpunten
            </h3>
            {goalScorers.map((s) => (
              <p key={s.playerName} className="text-sm text-white/80">
                {s.playerName} {s.goals > 1 ? `(${s.goals}x)` : ""}
              </p>
            ))}
          </div>
        )}

        {assistMakers.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Assists
            </h3>
            {assistMakers.map((s) => (
              <p key={s.playerName} className="text-sm text-white/80">
                {s.playerName} {s.assists > 1 ? `(${s.assists}x)` : ""}
              </p>
            ))}
          </div>
        )}

        {(yellowCards.length > 0 || redCards.length > 0) && (
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Kaarten
            </h3>
            {yellowCards.map((s) => (
              <p key={`y-${s.playerName}`} className="text-sm text-yellow-400">
                {s.playerName}
              </p>
            ))}
            {redCards.map((s) => (
              <p key={`r-${s.playerName}`} className="text-sm text-red-400">
                {s.playerName}
              </p>
            ))}
          </div>
        )}

        {goalScorers.length === 0 &&
          assistMakers.length === 0 &&
          yellowCards.length === 0 &&
          redCards.length === 0 && (
            <p className="text-center text-sm text-white/40">
              Geen statistieken ingevuld.
            </p>
          )}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/30">
        myteamplanner.nl
      </div>
    </div>
  );
}
