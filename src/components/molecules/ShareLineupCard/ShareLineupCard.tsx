import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/atoms/PlayerCard";
import type { CardTier } from "@/lib/player-rating";

interface SharePlayer {
  name: string;
  positionLabel: string;
  x: number;
  y: number;
  overall?: number | null;
  cardTier?: CardTier | null;
}

interface ShareLineupCardProps {
  teamName: string;
  opponent: string;
  matchDate: string;
  formation: string;
  players: SharePlayer[];
  benchNames: string[];
  className?: string;
}

export function ShareLineupCard({
  teamName,
  opponent,
  matchDate,
  formation,
  players,
  benchNames,
  className,
}: ShareLineupCardProps) {
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

  return (
    <div
      className={cn(
        "flex w-[540px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">{teamName}</h2>
        <p className="mt-0.5 text-base text-white/70">vs. {opponent}</p>
        <p className="mt-0.5 text-sm text-white/50">
          {dateStr} · {timeStr} · {formation}
        </p>
      </div>

      {/* Pitch */}
      <div className="relative aspect-[68/105] w-full overflow-hidden rounded-xl bg-green-600">
        {/* Field markings */}
        <div className="absolute inset-3 rounded-md border-2 border-white/40" />
        <div className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="absolute inset-x-[20%] top-3 h-[18%] border-2 border-t-0 border-white/40" />
        <div className="absolute inset-x-[20%] bottom-3 h-[18%] border-2 border-b-0 border-white/40" />

        {/* Players */}
        {players.map((player, i) => (
          <div
            key={i}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            {player.overall != null && player.cardTier != null ? (
              <PlayerCard
                name={player.name}
                position={player.positionLabel}
                overall={player.overall}
                tier={player.cardTier}
                size="sm"
              />
            ) : (
              <>
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white shadow-md">
                  {player.positionLabel}
                </div>
                <span className="mt-0.5 max-w-[60px] truncate text-center text-[10px] font-medium text-white drop-shadow-md">
                  {player.name.split(" ").pop()}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bench */}
      {benchNames.length > 0 && (
        <p className="mt-3 text-center text-sm text-white/60">
          Bank: {benchNames.join(", ")}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/30">
        myteamplanner.nl
      </div>
    </div>
  );
}
