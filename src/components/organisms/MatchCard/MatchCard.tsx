import { MapPin, Clock, Users } from "lucide-react";
import { MatchStatusBadge } from "@/components/molecules/MatchStatusBadge";
import { MatchScore } from "@/components/molecules/MatchScore";
import { formatDateShort, calculateGatheringTime, formatTime } from "@/lib/utils";
import { HOME_AWAY_LABELS } from "@/lib/constants";
import type { Match } from "@/types";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  className?: string;
  defaultGatheringMinutes?: number;
}

export function MatchCard({ match, onClick, className, defaultGatheringMinutes = 60 }: MatchCardProps) {
  const Component = onClick ? "button" : "div";
  const isUpcoming = match.status === "upcoming";

  const gatheringTime = isUpcoming
    ? match.gathering_time
      ? formatTime(match.gathering_time)
      : formatTime(
          calculateGatheringTime(
            match.match_date,
            defaultGatheringMinutes,
            match.travel_time_minutes,
          )
        )
    : null;

  return (
    <Component
      onClick={onClick}
      className={cn("w-full text-left", onClick && "cursor-pointer")}
    >
      <div className={cn(
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900">{match.opponent}</h3>
            <span className="text-xs font-medium text-primary-600">
              {HOME_AWAY_LABELS[match.home_away]}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <MatchStatusBadge status={match.status} />
            {match.status === "completed" && (
              <MatchScore
                scoreHome={match.score_home}
                scoreAway={match.score_away}
              />
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDateShort(match.match_date)}
          </span>
          {isUpcoming && gatheringTime && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              Verzamelen {gatheringTime}
            </span>
          )}
          {match.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {match.location}
            </span>
          )}
        </div>
      </div>
    </Component>
  );
}
