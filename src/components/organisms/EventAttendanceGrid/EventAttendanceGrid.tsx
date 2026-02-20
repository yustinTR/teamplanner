"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useEventAttendance, useEventAttendanceRealtime, useSetEventAttendance } from "@/hooks/use-event-attendance";
import { AttendanceSummary } from "@/components/molecules/AttendanceSummary";
import { AttendanceToggle } from "@/components/molecules/AttendanceToggle";
import { Spinner } from "@/components/atoms/Spinner";
import type { AttendanceStatus, Player } from "@/types";

interface EventAttendanceGridProps {
  eventId: string;
}

export function EventAttendanceGrid({ eventId }: EventAttendanceGridProps) {
  const { currentTeam, isCoach } = useAuthStore();
  const { data: players, isLoading: playersLoading } = usePlayers(currentTeam?.id);
  const { data: attendance, isLoading: attendanceLoading } = useEventAttendance(eventId);
  const setAttendance = useSetEventAttendance();

  useEventAttendanceRealtime(eventId);

  if (playersLoading || attendanceLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!players?.length) return null;

  const statusMap = new Map(
    attendance?.map((a) => [a.player_id, a.status]) ?? []
  );

  const groups: Record<string, Player[]> = {
    coming: [],
    maybe: [],
    not_coming: [],
    none: [],
  };

  for (const player of players) {
    const status = statusMap.get(player.id);
    if (status) {
      groups[status].push(player);
    } else {
      groups.none.push(player);
    }
  }

  const sectionLabels: Record<string, string> = {
    coming: "Aanwezig",
    maybe: "Misschien",
    not_coming: "Afwezig",
    none: "Geen reactie",
  };

  function handleCoachSetAttendance(playerId: string, status: AttendanceStatus) {
    setAttendance.mutate({ eventId, playerId, status });
  }

  return (
    <div className="space-y-4">
      <AttendanceSummary
        coming={groups.coming.length}
        notComing={groups.not_coming.length}
        maybe={groups.maybe.length}
      />

      {(["coming", "maybe", "not_coming", "none"] as const).map((group) => {
        const groupPlayers = groups[group];
        if (!groupPlayers.length) return null;

        return (
          <div key={group}>
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
              {sectionLabels[group]} ({groupPlayers.length})
            </h3>
            <div className="divide-y">
              {groupPlayers.map((player) => (
                <div key={player.id} className="py-2">
                  <div className="flex min-h-[44px] items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {player.name.charAt(0)}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {player.name}
                    </span>
                  </div>
                  {isCoach && !player.user_id && (
                    <div className="pb-2 pl-11">
                      <AttendanceToggle
                        value={statusMap.get(player.id) ?? null}
                        onChange={(status) => handleCoachSetAttendance(player.id, status)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
