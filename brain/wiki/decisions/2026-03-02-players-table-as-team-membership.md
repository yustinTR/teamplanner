---
type: decision
title: The players table is the team membership table
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, technical call, 2026-03-02
supersedes: ""
tags: [data-model, permissions, teams, auth]
sources: ["[[2026-03-02-multi-team-support-design]]"]
---

# The players table is the team membership table

## Decision

A user's teams are the teams they created (`teams.created_by`) plus the teams where a `players` row carries their `user_id`; there is no separate membership table, and switching teams does a full refresh.

## Context

Multi-team support was needed because the developer coaches one team and plays in another ([[2026-03-02-multi-team-support-design]]). The schema already expressed membership this way, and the RLS helper `get_my_team_ids()` already returned all of a user's teams — only the application queried one. The design's reasoning for the full refresh: *"Simple, no stale data risk."*

## Alternatives considered

- **A `team_members` table with a role column.** Cleaner in theory, but it would duplicate what `players` already says, need a migration and a backfill, and change every RLS policy. Rejected as zero-benefit work.
- **Client-side team switch without refresh.** Faster, but every React Query cache key would need the team id and every page would need to handle a swap. Rejected for stale-data risk.

## Consequences

- A coach is not necessarily a `players` row; staff and admin rights are therefore modelled on `players` too, which later carried `is_admin` ([[2026-03-12-admins-share-coach-rights]]).
- Unregistered players (`user_id = NULL`) and real members share a table; the coach manages the former. See [[data-model-and-permissions]].
- Last team in `localStorage`, same pattern as [[2026-02-26-onboarding-state-in-localstorage]].

## Where it lives in the code

- `src/app/(main)/layout.tsx` (team resolution), `src/stores/auth-store`, `src/components/molecules/TeamSwitcher/`
- RLS helpers in `supabase/migrations/20260219175136_fix_recursive_rls_policies.sql` and later
