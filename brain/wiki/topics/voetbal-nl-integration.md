---
type: topic
title: voetbal.nl integration — import and sync
created: 2026-10-23
updated: 2026-10-23
tags: [integration, voetbal-nl, sync, import]
sources: ["[[2026-08-24-v2-sync-push-stats-design]]"]
---

# voetbal.nl integration — import and sync

## Where we stand

Two stages. **Import** (from 2026-02-20, `import_source` on teams; `src/app/api/import-voetbal-nl/`): a coach picks club and team once, the app pulls players and fixtures from [[voetbal-nl]] data via the VoetbalAssist API and iCal feeds, with a confirm step. **Sync** (2026-08-24, [[2026-08-24-daily-cron-sync-reuses-the-parser]]): a daily Vercel Cron refreshes fixtures, times and results for every team with `auto_sync_enabled`, logs changes to `sync_log`, and shows them in team settings (2026-09-16). Gathering time and travel time were added on 2026-02-25 (`supabase/migrations/20260225091541_*`, `src/app/api/travel-time/`).

Rules the sync keeps: dedupe on opponent and day, never overwrite a manually entered score, one call per club per day, per-team failures do not stop the run.

## Requirements

- An imported team must stay correct without the coach touching it.
- Manual edits win over upstream data.
- A failed daily run raises an alert — built 2026-10-23 (commit `c6f2e25`): the team's coach and admins get a push naming the team and the first error; operators listed in the `SYNC_ALERT_USER_IDS` environment variable (not yet set) get a run summary.

## Decisions

- [[2026-08-24-daily-cron-sync-reuses-the-parser]]

## Risks and tensions

- **No agreement, and probably no licence, with the data owner.** Yustin believes VoetbalAssist's API sits behind a paywall he has not paid for ([[2026-10-23-open-questions-answered]]). The KNVB or VoetbalAssist can change the format or block access; every linked team breaks at once and only `sync_log` would show it. No alert exists.
- **Dedupe on opponent + day** fails for a double-header or a rescheduled match on the same day against the same opponent; a rare case the design accepted.
- **`sync_log` without push** ([[notifications]]) means changes are detected but not announced; the coach must open settings to see them.

## Open questions

- A VoetbalAssist licence: needed, available, affordable? The feature that makes onboarding easy rests on it.
- Set `SYNC_ALERT_USER_IDS` in Vercel to Yustin's auth user id so the operator alert reaches him on a device where push is on.
