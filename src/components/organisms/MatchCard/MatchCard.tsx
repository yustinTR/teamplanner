import { MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/Card";
import { MatchStatusBadge } from "@/components/molecules/MatchStatusBadge";
import { MatchScore } from "@/components/molecules/MatchScore";
import { formatDateShort } from "@/lib/utils";
import { HOME_AWAY_LABELS } from "@/lib/constants";
import type { Match } from "@/types";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  className?: string;
}

export function MatchCard({ match, onClick, className }: MatchCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn("w-full text-left", onClick && "cursor-pointer")}
    >
      <Card className={cn("hover:bg-accent/50 transition-colors", className)}>
        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{match.opponent}</h3>
              <span className="text-xs text-muted-foreground">
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

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDateShort(match.match_date)}
            </span>
            {match.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {match.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Component>
  );
}
