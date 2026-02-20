"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { EventInsert, EventUpdate } from "@/types";

export function useEvents(teamId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["events", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("team_id", teamId!)
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });
}

export function useEvent(eventId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useCreateEvent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Omit<EventInsert, "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");

      const { data, error } = await supabase
        .from("events")
        .insert({ ...event, created_by: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events", data.team_id] });
    },
  });
}

export function useUpdateEvent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: EventUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("events")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events", data.team_id] });
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });
    },
  });
}

export function useDeleteEvent() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, teamId }: { id: string; teamId: string }) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      return { teamId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events", data.teamId] });
    },
  });
}
