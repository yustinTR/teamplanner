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
    onMutate: async ({ eventId, playerId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["event-attendance", eventId] });
      const previous = queryClient.getQueryData(["event-attendance", eventId]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["event-attendance", eventId], (old: any[] | undefined) => {
        if (!old) return old;
        const exists = old.some((a) => a.player_id === playerId);
        if (exists) {
          return old.map((a) =>
            a.player_id === playerId ? { ...a, status } : a
          );
        }
        // New record: add placeholder so UI updates immediately
        return [...old, { id: `temp-${playerId}`, player_id: playerId, event_id: eventId, status, responded_at: new Date().toISOString(), players: null }];
      });
      return { previous };
    },
    onError: (_err, { eventId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["event-attendance", eventId], context.previous);
      }
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
