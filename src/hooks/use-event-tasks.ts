"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { EventTaskInsert, EventTaskUpdate } from "@/types";

export function useEventTasks(eventId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["event-tasks", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_tasks")
        .select("*, players:assigned_to(id, name)")
        .eq("event_id", eventId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useCreateEventTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: EventTaskInsert) => {
      const { data, error } = await supabase
        .from("event_tasks")
        .insert(task)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event-tasks", data.event_id] });
    },
  });
}

export function useUpdateEventTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, eventId, ...update }: EventTaskUpdate & { id: string; eventId: string }) => {
      const { data, error } = await supabase
        .from("event_tasks")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { ...data, eventId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event-tasks", data.eventId] });
    },
  });
}

export function useDeleteEventTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase.from("event_tasks").delete().eq("id", id);
      if (error) throw error;
      return { eventId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event-tasks", data.eventId] });
    },
  });
}
