"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { AttendanceStatus } from "@/types";

export function useEventAttendance(eventId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["event-attendance", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_attendance")
        .select("*, players(*)")
        .eq("event_id", eventId!);
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useSetEventAttendance() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      playerId,
      status,
    }: {
      eventId: string;
      playerId: string;
      status: AttendanceStatus;
    }) => {
      const { data, error } = await supabase
        .from("event_attendance")
        .upsert(
          {
            event_id: eventId,
            player_id: playerId,
            status,
            responded_at: new Date().toISOString(),
          },
          { onConflict: "event_id,player_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event-attendance", data.event_id] });
    },
  });
}

export function useEventAttendanceRealtime(eventId: string | undefined) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`event-attendance-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_attendance",
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["event-attendance", eventId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, queryClient, supabase]);
}
