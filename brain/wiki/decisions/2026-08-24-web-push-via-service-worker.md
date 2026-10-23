---
type: decision
title: Web Push through the existing service worker, three triggers, no preferences
created: 2026-10-23
updated: 2026-10-23
status: proposed
decided_by: Yustin Troost, product and technical call, 2026-08-24 (designed; not built)
supersedes: "the native-app push of [[2026-03-13-native-app-as-separate-expo-repo]] as the first push channel"
tags: [notifications, pwa, service-worker]
sources: ["[[2026-08-24-v2-sync-push-stats-design]]", "[[2026-02-xx-project-documentatie-v1]]"]
---

# Web Push through the existing service worker, three triggers, no preferences

## Decision

Push notifications are Web Push (VAPID) sent from Next.js routes to subscriptions stored per user, received by the Serwist service worker, with three triggers — availability reminder, lineup published, match changed — and no per-category preferences or e-mail fallback in v1.

## Context

Push was a *"Must"* in the February MVP list ([[2026-02-xx-project-documentatie-v1]]) and the one MVP item never built. The August design states why it matters: players *"moeten zelf de app openen om te zien dat er iets is … Dat is precies waarom WhatsApp nu wint: het pusht."* ([[2026-08-24-v2-sync-push-stats-design]]). The sync's `sync_log` was designed to be the third trigger's source.

## Alternatives considered

- **Push from the native app** ([[2026-03-13-native-app-as-separate-expo-repo]]). Real push on iOS, but waits for an app that was never started.
- **Supabase Edge Function sending push** (February document). Rejected implicitly by the August design's Next.js routes, consistent with [[2026-08-24-daily-cron-sync-reuses-the-parser]].
- **E-mail reminders.** Explicitly excluded from v1: *"Geen e-mail fallback. Simpel houden."*

## Consequences

- Not built on 2026-10-23: no `push_subscriptions` migration, no `web-push` dependency, no routes. The recommended order 1 → 3 → 2 was followed and stopped before 2.
- On iOS, push only works with the PWA on the home screen (iOS 16.4+); the design plans an in-app hint. This is the price of [[2026-02-19-pwa-over-native-app]].
- A second cron (availability reminders) and a VAPID key pair are needed; keys live in Vercel, never here.
- Status moves to `accepted` when built. See [[notifications]].

## Where it lives in the code

- Nowhere yet. Planned: `src/app/sw.ts` handlers, `src/lib/push.ts`, `src/app/api/push/*`, `src/app/api/cron/availability-reminders/`, `PushNotificationSettings` molecule.
