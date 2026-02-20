"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useEventAttendance, useSetEventAttendance } from "@/hooks/use-event-attendance";
import { AttendanceToggle } from "@/components/molecules/AttendanceToggle";

interface MyEventAttendanceProps {
  eventId: string;
}

export function MyEventAttendance({ eventId }: MyEventAttendanceProps) {
  const { currentPlayer } = useAuthStore();
  const { data: attendance } = useEventAttendance(eventId);
  const setAttendance = useSetEventAttendance();

  if (!currentPlayer) return null;

  const myStatus = attendance?.find(
    (a) => a.player_id === currentPlayer.id
  )?.status ?? null;

  return (
    <div>
      <h2 className="mb-2 text-sm font-medium">Jouw aanwezigheid</h2>
      <AttendanceToggle
        value={myStatus}
        onChange={(status) =>
          setAttendance.mutate({
            eventId,
            playerId: currentPlayer.id,
            status,
          })
        }
        disabled={setAttendance.isPending}
      />
    </div>
  );
}
