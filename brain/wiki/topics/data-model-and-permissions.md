---
type: topic
title: Data model and permissions
created: 2026-10-23
updated: 2026-10-23
tags: [data-model, permissions, rls, supabase]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-02-26-player-skills-profile-design]]", "[[2026-03-02-multi-team-support-design]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Data model and permissions

## Where we stand

The schema is in `PROJECT_CONTEXT.md` and `supabase/migrations/` (20 files on 2026-10-23); this page records the reasoning, not the columns.

- **Membership is the `players` table.** A user's teams are the ones they created plus the ones where a `players` row has their `user_id` ([[2026-03-02-players-table-as-team-membership]]). Unregistered players (`user_id = NULL`) share the table and are managed by the coach.
- **Coach = creator or admin.** `is_team_admin()` checks `teams.created_by` or an active `players.is_admin` ([[2026-03-12-admins-share-coach-rights]]). `PROJECT_CONTEXT.md`'s roles section predates this and still says creator only.
- **Authorisation is RLS** with `SECURITY DEFINER` helpers, after recursive-policy trouble on day one ([[2026-02-19-supabase-as-the-backend]]).
- **JSONB where the shape is the feature's own**: `players.skills` ([[2026-02-26-skills-as-jsonb-without-history]]), `lineups.positions` and `lineups.substitution_plan`, `sync_log.changes`. Trade-off accepted each time: no history, no cross-row queries, no migration per field.
- **Derived, not stored**: overall rating and card tier (`src/lib/player-rating.ts`), minutes per player (from the substitution plan), season statistics (`src/lib/player-stats-utils.ts`). The dashboard aggregates on read ([[2026-08-24-v2-sync-push-stats-design]]).
- **Service role only for cron**, never in client bundles ([[2026-08-24-daily-cron-sync-reuses-the-parser]]). `sync_log` is written only by the cron.
- **Team types drive behaviour**: `team_type` is one of `senioren`, `jo19_jo17`, `jo15_jo13`, `jo11_jo9`, `g_team` since 2026-02-20 (`ACTIVE_TEAM_TYPES`, `TEAM_TYPE_CONFIG` in `src/lib/constants.ts`) and selects 11v11, 8v8 (G-team) or 7v7 formations, half length and the training level. `PROJECT_CONTEXT.md` still lists the older `senior` / `junior_11` / `g_team_7` values — stale.
- **Two clients, one schema.** [[teamplanner-android]] deserialises the same tables and JSONB with Kotlin models; a schema or JSONB change is not finished until the Kotlin side matches ([[web-android-parity]]).

## Requirements

- Coaches full CRUD; players update their own availability and attendance; everyone in a team reads everything (`CLAUDE.md`, `PROJECT_CONTEXT.md`).
- Manually entered scores are never overwritten by sync.

## Decisions

- [[2026-02-19-supabase-as-the-backend]]
- [[2026-02-26-skills-as-jsonb-without-history]]
- [[2026-03-02-players-table-as-team-membership]]
- [[2026-03-12-admins-share-coach-rights]]
- [[2026-08-24-daily-cron-sync-reuses-the-parser]]

## Risks and tensions

- **History is absent by design** in skills and lineups; roadmap phase 3 (development over time) and any "who played where last season" question will need it.
- **Two documents describe roles**, `CLAUDE.md` and `PROJECT_CONTEXT.md`, and both lag the admin flag; `PROJECT_CONTEXT.md` also lags the team-type values and the EA FC skills shape. The brain is not the place to fix that; the code docs are.
- **Personal data of minors** sits in `players` (names, photos, notes with *"bijzonderheden"*). The privacy page exists (`/privacy`); no source discusses retention or deletion.

## Open questions

- Which Android models already lag the schema (anything after 2026-03-15)? → [[web-android-parity]]
- Data retention for players who leave, and for teams that go inactive.
