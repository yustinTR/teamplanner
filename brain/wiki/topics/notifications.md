---
type: topic
title: Notifications
created: 2026-10-23
updated: 2026-10-23
tags: [notifications, push, pwa, engagement]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-03-13-seo-blog-native-app-design]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Notifications

## Where we stand

**There are none.** No push, no e-mail reminders, no in-app inbox on 2026-10-23. Push was a *"Must"* in the February MVP list ([[2026-02-xx-project-documentatie-v1]]) and is the only MVP item never built. It has been planned three times:

| Date | Plan | State |
|---|---|---|
| 2026-02 | Web Push API + Supabase Edge Functions ([[2026-02-xx-project-documentatie-v1]]) | not built |
| 2026-03-13 | Push in the native app, phase 5 ([[2026-03-13-seo-blog-native-app-design]]); the app became [[teamplanner-android]] in Kotlin | phases 1–4 built, phase 5 not started |
| 2026-08-24 | Web Push via the Serwist service worker, Next.js routes, three triggers ([[2026-08-24-web-push-via-service-worker]]) | designed, not built |

The August design is current. Its diagnosis is the sharpest statement of the gap: *"Dat is precies waarom WhatsApp nu wint: het pusht."* Everything that would feed push already exists: `sync_log` records changes, lineups have a save event, availability has a no-response state.

## Requirements

- Availability reminder: players with an account and no response, match within three days, daily at 18:00.
- Lineup published: selected players, on save.
- Match changed or new: whole team, from the sync.
- v1 without per-category preferences and without e-mail fallback.
- iOS: tell the user push needs the PWA on the home screen (16.4+).

## Decisions

- [[2026-08-24-web-push-via-service-worker]] (proposed)
- [[2026-02-19-pwa-over-native-app]] — the reason push is harder than in a native app

## Risks and tensions

- **Without push, the "assistent-coach" is silent.** Sync and dashboard are built; the part that brings players back is not. See [[product-vision-and-roadmap]].
- **iOS adoption**: many players will never install the PWA to the home screen; for them push does not exist, and the design excludes e-mail. The reminder may need a WhatsApp-shareable fallback (a "nudge" message the coach forwards) — not in any source, a synthesis.
- **Permission prompts** cost trust if asked too early; the design puts the toggle on the profile page, not in onboarding.
- **Two clients, two push channels.** Web Push for the PWA and Firebase Cloud Messaging for [[teamplanner-android]] would serve the same three triggers; nothing yet says whether one server-side sender fans out to both. See [[web-android-parity]].

## Open questions

- When is push built? It is the open item of the V2 design's 1 → 3 → 2 order.
- Does the iOS limitation justify an e-mail fallback after all, or a coach-forwarded nudge?
- Web Push first, Android FCM first, or both from one sender?
