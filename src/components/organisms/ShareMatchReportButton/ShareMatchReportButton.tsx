"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { useMatchStats } from "@/hooks/use-match-stats";
import { useShareImage } from "@/hooks/use-share-image";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/atoms/Button";
import { ShareMatchReport } from "@/components/molecules/ShareMatchReport";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";

interface ShareMatchReportButtonProps {
  match: Match;
  /** "icon" is the compact variant for list cards. */
  variant?: "button" | "icon";
  className?: string;
}

/**
 * Shares the report (score plus goals, assists and cards) of a completed
 * match as an image. Stats are fetched after the first tap.
 */
export function ShareMatchReportButton({
  match,
  variant = "button",
  className,
}: ShareMatchReportButtonProps) {
  const { currentTeam } = useAuthStore();
  const [armed, setArmed] = useState(false);
  // Set by a tap that happened before the stats were loaded; the effect
  // below finishes that tap once the query resolves.
  const pendingRef = useRef(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();
  const statsQuery = useMatchStats(armed ? match.id : undefined);
  const loaded = armed && statsQuery.isFetched;

  const doShare = useCallback(() => {
    if (reportRef.current) {
      share(reportRef.current, `verslag-${match.opponent}`, "share_report").catch(() => {});
    }
  }, [match.opponent, share]);

  useEffect(() => {
    if (!pendingRef.current || !loaded) return;
    pendingRef.current = false;
    doShare();
  }, [loaded, doShare]);

  const stats = (statsQuery.data ?? [])
    .map((s) => ({
      playerName: s.players?.name ?? "Onbekend",
      goals: s.goals ?? 0,
      assists: s.assists ?? 0,
      yellow_cards: s.yellow_cards ?? 0,
      red_cards: s.red_cards ?? 0,
    }))
    .filter((s) => s.goals > 0 || s.assists > 0 || s.yellow_cards > 0 || s.red_cards > 0);

  const busy = isGenerating || (armed && !loaded);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (loaded) {
      doShare();
      return;
    }
    pendingRef.current = true;
    setArmed(true);
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn("size-11 p-0 text-muted-foreground", className)}
          onClick={handleClick}
          disabled={busy}
          aria-label="Verslag delen"
          title="Verslag delen"
        >
          <Share2 className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className={cn("gap-2", className)}
          onClick={handleClick}
          disabled={busy}
        >
          <Share2 className="size-4" />
          {busy ? "Genereren..." : "Deel afbeelding"}
        </Button>
      )}

      {loaded && (
        <div className="fixed -left-[9999px] top-0">
          <div ref={reportRef}>
            <ShareMatchReport
              teamName={currentTeam?.name ?? "Team"}
              opponent={match.opponent}
              homeAway={match.home_away}
              matchDate={match.match_date}
              scoreHome={match.score_home ?? 0}
              scoreAway={match.score_away ?? 0}
              stats={stats}
            />
          </div>
        </div>
      )}
    </>
  );
}
