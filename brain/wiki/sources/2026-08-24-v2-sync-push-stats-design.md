---
type: source
title: V2 — automatic sync, push notifications, season dashboard (design)
created: 2026-10-23
updated: 2026-10-23
tags: [sync, voetbal-nl, notifications, statistics, cron, v2]
source_file: docs/plans/2026-08-24-v2-sync-push-stats-design.md
source_date: 2026-08-24
language: nl
sources: ["[[2026-02-26-coach-autopilot-roadmap]]"]
---

# V2 — automatic sync, push notifications, season dashboard (design)

## Summary

The V2 core, explicitly tied to the roadmap's phase 2 and automation vision ([[2026-02-26-coach-autopilot-roadmap]]). Three features that reinforce each other: a daily Vercel Cron that refreshes schedule, times and results for every team with a linked import source; Web Push through the existing Serwist service worker with three triggers; and a team-wide season dashboard whose headline is a playing-time fairness chart. *"Samenhang: sync detecteert wijzigingen → push meldt ze → dashboard maakt de verzamelde data zichtbaar."* Recommended order 1 → 3 → 2, because the dashboard is visible result without infrastructure and push has *"de meeste bewegende delen"*.

## Key points

- **Sync**: reuse the server-side parser `src/lib/voetbal-nl-parser.ts` — *"géén aparte Deno edge function nodig"*; a service-role client because cron has no user session; shared upsert logic extracted to `src/lib/match-sync.ts` so the manual confirm route and the cron run the same code; dedupe on opponent + day; results only fill empty scores, *"handmatig ingevoerde scores niet overschrijven"*; one API call per club; failures logged per team, the run continues; `sync_log` table; a per-team toggle and "Laatste sync".
- **Push**: `push_subscriptions` table with RLS, VAPID keys, `web-push`, service-worker `push` and `notificationclick` handlers, `sendPushToUsers` that prunes `410 Gone`; triggers: availability reminder (daily 18:00, match within 3 days, no response), lineup published, match changed/new from sync. *"Geen per-categorie voorkeuren in v1. Geen e-mail fallback. Simpel houden."* iOS hint: push only works with the PWA on the home screen (iOS 16.4+).
- **Dashboard** at `/team/stats`: fairness bar chart with team-average line, top scorers and assists, attendance percentages, stat tiles (played, W/D/L, goals for/against); empty state until the first completed match; *"eerst de `dataviz` skill laden"*.
- Problem statement for push, verbatim: *"Dat is precies waarom WhatsApp nu wint: het pusht."*

## Requirements raised

- The app keeps itself current without the coach re-importing.
- Players are pulled back into the app actively.
- Fair playing time is visible at a glance, *"cruciaal bij G-voetbal"*.

## Decisions made

- [[2026-08-24-daily-cron-sync-reuses-the-parser]] (accepted, built)
- [[2026-08-24-web-push-via-service-worker]] (proposed, not built)

## What was built

- **Sync**: built on 2026-08-24 as designed — `supabase/migrations/20260824100000_add_auto_sync.sql`, `src/app/api/cron/sync-matches/route.ts`, `vercel.json` cron at `0 5 * * *`, the toggle in team settings; on 2026-09-16 the recent sync changes became visible in team settings (git history).
- **Dashboard**: built on 2026-09-16 (*"team season stats dashboard"*, `src/app/(main)/team/stats/`).
- **Push**: **not built** on 2026-10-23 — no `web-push` dependency, no `push_subscriptions` migration, no push routes. The order 1 → 3 → 2 was followed; step 2 is still open.

## Open questions

- When is push built, and does the iOS home-screen limitation change the plan? → [[notifications]]
- `sync_log` was meant as *"bron voor notificaties"*; without push it serves only the settings screen. → [[voetbal-nl-integration]]
