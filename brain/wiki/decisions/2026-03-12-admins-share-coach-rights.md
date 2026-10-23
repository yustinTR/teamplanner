---
type: decision
title: Admin players share the coach's rights
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product and technical call, 2026-03-12 (reason confirmed 2026-10-23; no design document)
supersedes: ""
tags: [permissions, data-model, teams]
sources: ["[[2026-10-23-open-questions-answered]]"]
---

# Admin players share the coach's rights

## Decision

A coach can flag a player as admin; an active admin player gets the same permissions as the team creator, through one SQL helper `is_team_admin(team_id)`.

## Context

The need came from Yustin's own team: things had to be changed *"zonder dat iedereen erbij kon"* — a second person with edit rights, without giving every player them ([[2026-10-23-open-questions-answered]]). The migration's own comment matches: *"Allows coaches to grant admin/coach rights to players (e.g. captains, assistants)."* (`supabase/migrations/20260312132332_add_player_admin_flag.sql`). Amateur teams routinely have an assistant or a team manager, and the one-coach model of the MVP (`teams.created_by`) could not express that. It shipped in the 2026-03-12 commit together with security hardening and indexes (git history).

## Alternatives considered

- **A `role` column on `teams` membership.** There is no membership table ([[2026-03-02-players-table-as-team-membership]]); a boolean on `players` was the smallest change.
- **Multiple coaches via a `team_coaches` table.** More explicit, but a second place to check in every policy.

## Consequences

- "Coach" in the UI means creator-or-admin; `PROJECT_CONTEXT.md`'s roles section still describes the creator only, which the brain flags as stale documentation.
- An admin must also be a `players` row, so staff who never play need a player record with role `staff`.

## Where it lives in the code

- `supabase/migrations/20260312132332_add_player_admin_flag.sql` (`is_admin`, `is_team_admin()`)
- `src/stores/auth-store` (`isCoach`)
