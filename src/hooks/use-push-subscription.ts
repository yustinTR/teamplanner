"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export type PushStatus = "unsupported" | "denied" | "subscribed" | "unsubscribed";

const QUERY_KEY = ["push-subscription"];

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);
  const output = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    !!env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  );
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration ?? null;
}

/**
 * Web Push status for this browser plus subscribe/unsubscribe mutations.
 * The subscription row is written directly through Supabase (RLS: own rows).
 */
export function usePushSubscription(userId: string | undefined) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const status = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<PushStatus> => {
      if (!pushSupported()) return "unsupported";
      if (Notification.permission === "denied") return "denied";
      const registration = await getRegistration();
      if (!registration) return "unsupported";
      const subscription = await registration.pushManager.getSubscription();
      return subscription ? "subscribed" : "unsubscribed";
    },
    enabled: !!userId,
    staleTime: Infinity,
  });

  const subscribe = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Niet ingelogd.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Geen toestemming voor meldingen.");
      const registration = await getRegistration();
      if (!registration) throw new Error("Service worker niet beschikbaar.");

      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        }));

      const json = subscription.toJSON();
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: userId,
          platform: "web",
          endpoint: subscription.endpoint,
          p256dh: json.keys?.p256dh ?? null,
          auth: json.keys?.auth ?? null,
          user_agent: navigator.userAgent,
        },
        { onConflict: "endpoint" }
      );
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const unsubscribe = useMutation({
    mutationFn: async () => {
      const registration = await getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (!subscription) return;
      const { error } = await supabase
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", subscription.endpoint);
      if (error) throw error;
      await subscription.unsubscribe();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { status, subscribe, unsubscribe };
}
