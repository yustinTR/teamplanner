import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  NetworkOnly,
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  ExpirationPlugin,
  CacheableResponsePlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

// Custom caching for Supabase — placed before defaultCache so they take priority
const supabaseCache = [
  // Supabase Auth: never cache authentication requests
  {
    matcher: ({ url }: { url: URL }) =>
      url.hostname.endsWith(".supabase.co") && url.pathname.includes("/auth/"),
    handler: new NetworkOnly(),
  },
  // Supabase Storage: cache player photos and team logos aggressively
  {
    matcher: ({ url }: { url: URL }) =>
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.includes("/storage/"),
    handler: new CacheFirst({
      cacheName: "supabase-storage",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 128,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
  // Supabase REST API: network-first with fast fallback to cache
  // 3s timeout ensures quick response on bad networks (e.g., on the football field)
  {
    matcher: ({ url }: { url: URL }) =>
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.includes("/rest/"),
    handler: new NetworkFirst({
      cacheName: "supabase-api",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 128,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
          maxAgeFrom: "last-used",
        }),
      ],
      networkTimeoutSeconds: 3,
    }),
  },
  // Supabase Realtime: never cache WebSocket upgrade requests
  {
    matcher: ({ url }: { url: URL }) =>
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.includes("/realtime/"),
    handler: new NetworkOnly(),
  },
];

// App shell pages: cache navigations for offline access
const appShellCache = [
  {
    matcher: ({ sameOrigin, request }: { sameOrigin: boolean; request: Request }) =>
      sameOrigin && request.mode === "navigate",
    handler: new StaleWhileRevalidate({
      cacheName: "app-shell",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...supabaseCache, ...appShellCache, ...defaultCache],
});

serwist.addEventListeners();

// --- Web Push ---------------------------------------------------------
// Payload shape: see PushPayload in src/lib/push-messages.ts

interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag?: string;
}

self.addEventListener("push", (event) => {
  let payload: PushPayload | null = null;
  try {
    payload = event.data?.json() as PushPayload;
  } catch {
    payload = null;
  }
  if (!payload?.title) return;

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      tag: payload.tag,
      data: { url: payload.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url: string = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((client) => "focus" in client);
        if (existing) {
          existing.navigate(url);
          return existing.focus();
        }
        return self.clients.openWindow(url);
      })
  );
});
