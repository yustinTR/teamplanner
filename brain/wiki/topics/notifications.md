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

**Web Push exists since 2026-10-23** — the February MVP's last must-have ([[2026-02-xx-project-documentatie-v1]]), built as the August design specified ([[2026-08-24-web-push-via-service-worker]]). Android push is still open (phase 5). The history:

| Date | Plan | State |
|---|---|---|
| 2026-02 | Web Push API + Supabase Edge Functions ([[2026-02-xx-project-documentatie-v1]]) | not built |
| 2026-03-13 | Push in the native app, phase 5 ([[2026-03-13-seo-blog-native-app-design]]); the app became [[teamplanner-android]] in Kotlin | phases 1–4 built, phase 5 not started |
| 2026-08-24 | Web Push via the Serwist service worker, Next.js routes, three triggers ([[2026-08-24-web-push-via-service-worker]]) | **built 2026-10-23** |

As built: an availability reminder at 16:00 UTC for matches within three days to members with an account and no answer; a lineup notification to every selected player (starters and substitutes, not loan players, not the coach) on save; a programme update to the whole team when the daily sync changes something; and, as an extra, a sync-failure push to the team's coach and admins plus an operator alert to the users in `SYNC_ALERT_USER_IDS`. Users turn it on in their profile; on iOS the toggle explains the home-screen requirement. The service worker is disabled in development, so the toggle shows "not supported" locally.

**Two production bugs surfaced on release day (2026-10-23)**, both older than push: the middleware redirected `/sw.js` to `/login` for visitors without a session, and — worse — production had **no service worker at all**, because Next 16 builds with Turbopack and the `@serwist/next` plugin only runs under webpack. Offline caching and PWA install had been silently broken since the Turbopack build; Web Push would have been too. Fixed by building with `next build --webpack` and excluding `sw.js` from the middleware matcher (commits `9f626c5`, `47ee95f` on `main`).

## Requirements

- Availability reminder: players with an account and no response, match within three days, daily at 18:00.
- Lineup published: selected players, on save.
- Match changed or new: whole team, from the sync.
- v1 without per-category preferences and without e-mail fallback.
- iOS: tell the user push needs the PWA on the home screen (16.4+).

## Decisions

- [[2026-08-24-web-push-via-service-worker]] (proposed)
- [[2026-10-23-push-per-client-web-first]] (accepted)
- [[2026-02-19-pwa-over-native-app]] — the reason push is harder than in a native app

## Risks and tensions

- **Only two teams have members who could receive it** ([[2026-10-23-active-team-count]]). Push rewards adoption; it does not create it.
- **iOS adoption**: many players will never install the PWA to the home screen; for them push does not exist, and the design excludes e-mail. The reminder may need a WhatsApp-shareable fallback (a "nudge" message the coach forwards) — not in any source, a synthesis.
- **Permission prompts** cost trust if asked too early; the design puts the toggle on the profile page, not in onboarding.
- **Two clients, two push paths, by choice** ([[2026-10-23-push-per-client-web-first]]). Both are built on 2026-10-23: Web Push live; the Android path (FCM data messages, `src/lib/fcm.ts` and the app's `push/` package) was verified end to end on the emulator the same day: Firebase project `myteamplanner`, service-account key in `FCM_SERVICE_ACCOUNT_JSON` (Vercel, production), a test message delivered to the notification shade. The tap-to-open deep link is written but was not verified on the emulator. Both paths go live for users with the next production deploy of `develop`. The three triggers are the shared contract. See [[web-android-parity]].

## Open questions

- First real-device check: subscribe on a phone, trigger the reminder cron by hand, confirm the notification arrives. Not yet done.
- Does the iOS limitation justify an e-mail fallback after all, or a coach-forwarded nudge?
- Deploy `develop` to production; until then no trigger runs with push code.
