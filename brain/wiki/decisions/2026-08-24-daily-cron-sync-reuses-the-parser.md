---
type: decision
title: Daily Vercel Cron sync that reuses the voetbal.nl parser
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, technical call, 2026-08-24
supersedes: ""
tags: [sync, voetbal-nl, cron, vercel, supabase]
sources: ["[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Daily Vercel Cron sync that reuses the voetbal.nl parser

## Decision

A Vercel Cron hits a Next.js route once a day; the route uses a service-role Supabase client and the same `match-sync` logic as the manual import to upsert fixtures and fill in results for every team with a linked [[voetbal-nl]] source, never overwriting a manually entered score.

## Context

Imported fixtures went stale: KNVB time changes, new rounds and results only arrived when the coach re-imported ([[2026-08-24-v2-sync-push-stats-design]]). The parser already ran server-side in Next.js, so a separate Supabase Edge Function would have duplicated it: *"géén aparte Deno edge function nodig"*. Cron has no user session, hence the service-role client and a shared secret on the route.

## Alternatives considered

- **Supabase Edge Function on pg_cron.** Closer to the data, but a second runtime (Deno) and a second copy of the parser.
- **Sync on page load.** No infrastructure, but hammers the upstream API per visit and never updates teams nobody opens.
- **Keep manual re-import only.** The status quo the design rejects.

## Consequences

- Two secrets, server-only: the service-role key and the cron secret (names in the design; values in Vercel). The brain never records values.
- Manual and automatic import must stay one code path (`src/lib/match-sync.ts`); a divergence is a bug.
- One upstream call per club per day, sequential — polite to an API the project does not own and has no agreement with. See [[voetbal-nl-integration]].
- `sync_log` was designed as the trigger source for push; without push ([[2026-08-24-web-push-via-service-worker]]) it feeds only the settings screen (visible since 2026-09-16).

## Where it lives in the code

- `vercel.json` (schedule `0 5 * * *`), `src/app/api/cron/sync-matches/route.ts`
- `src/lib/match-sync.ts`, `src/lib/voetbal-nl-parser.ts`, `src/lib/supabase/admin.ts`
- `supabase/migrations/20260824100000_add_auto_sync.sql` (`auto_sync_enabled`, `last_synced_at`, `sync_log`)
