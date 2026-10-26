"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLineup } from "@/hooks/use-lineup";
import { usePlayers } from "@/hooks/use-players";
import { useMatchPlayers } from "@/hooks/use-match-players";
import { useAvailability } from "@/hooks/use-availability";
import { useShareImage } from "@/hooks/use-share-image";
import { useAuthStore } from "@/stores/auth-store";
import { buildShareLineupData } from "@/lib/share-lineup";
import { Button } from "@/components/atoms/Button";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import { cn } from "@/lib/utils";

interface ShareLineupButtonProps {
  matchId: string;
  opponent: string;
  matchDate: string;
  /** "icon" is the compact variant for list cards. */
  variant?: "button" | "icon";
  className?: string;
}

/**
 * Shares the saved lineup of a match as an image. Data is only fetched after
 * the first tap, so a list of matches does not fire a query per card. Without
 * a saved lineup the user is sent to the lineup editor instead.
 */
export function ShareLineupButton({
  matchId,
  opponent,
  matchDate,
  variant = "button",
  className,
}: ShareLineupButtonProps) {
  const router = useRouter();
  const { currentTeam } = useAuthStore();
  const [armed, setArmed] = useState(false);
  // Set by a tap that happened before the data was loaded; the effect below
  // finishes that tap once the queries resolve.
  const pendingRef = useRef(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();

  const lineupQuery = useLineup(armed ? matchId : undefined);
  const playersQuery = usePlayers(armed ? currentTeam?.id : undefined);
  const matchPlayersQuery = useMatchPlayers(armed ? matchId : undefined);
  const availabilityQuery = useAvailability(armed ? matchId : undefined);

  const loaded =
    armed &&
    lineupQuery.isFetched &&
    playersQuery.isFetched &&
    matchPlayersQuery.isFetched &&
    availabilityQuery.isFetched;

  const data = loaded
    ? buildShareLineupData({
        lineup: lineupQuery.data,
        players: playersQuery.data,
        matchPlayers: matchPlayersQuery.data,
        availability: availabilityQuery.data,
        showRatings: currentTeam?.show_ratings ?? true,
      })
    : null;

  const doShare = useCallback(() => {
    if (!data) {
      toast("Nog geen opstelling. Maak er eerst een.");
      router.push(`/matches/${matchId}/lineup`);
      return;
    }
    if (shareRef.current) {
      share(shareRef.current, `opstelling-${opponent}`).catch(() => {});
    }
  }, [data, matchId, opponent, router, share]);

  useEffect(() => {
    if (!pendingRef.current || !loaded) return;
    pendingRef.current = false;
    doShare();
  }, [loaded, doShare]);

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
          aria-label="Opstelling delen"
          title="Opstelling delen"
        >
          <Share2 className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5", className)}
          onClick={handleClick}
          disabled={busy}
        >
          <Share2 className="size-4" />
          {busy ? "Genereren..." : "Delen"}
        </Button>
      )}

      {data && (
        <div className="fixed -left-[9999px] top-0">
          <div ref={shareRef}>
            <ShareLineupCard
              teamName={currentTeam?.name ?? "Team"}
              opponent={opponent}
              matchDate={matchDate}
              formation={data.formation}
              players={data.players}
              benchNames={data.benchNames}
            />
          </div>
        </div>
      )}
    </>
  );
}
