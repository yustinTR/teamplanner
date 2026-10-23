---
type: source
title: Multi-team support (design)
created: 2026-10-23
updated: 2026-10-23
tags: [data-model, permissions, teams, auth]
source_file: docs/plans/2026-03-02-multi-team-support-design.md
source_date: 2026-03-02
language: en
sources: []
---

# Multi-team support (design)

## Summary

Users could belong to one team, but *"a person may coach one team (e.g. G2) and play on another (e.g. 5de)"* — the developer's own situation. The design adds a team switcher in the header, a full refresh on switch, both roles per user, and the last team remembered in `localStorage`. It needs **no schema change**: the `players` table already is the membership table, and the RLS helper `get_my_team_ids()` already returns every team of a user. The only data change is replacing `.limit(1).single()` queries with queries that return all teams.

## Key points

- Design decisions, verbatim: *"Full refresh on switch — navigates to dashboard, reloads all data. Simple, no stale data risk."*
- Auth store gains `myTeams[]` and `switchTeam(teamId)`; the layout resolves the current team from `localStorage` with a fallback to the first team.
- Edge cases enumerated: zero teams redirects to create-team; a stale stored team id falls back; join and create flows unchanged.

## Requirements raised

- One account, many teams, as coach and/or player.

## Decisions made

- [[2026-03-02-players-table-as-team-membership]]

## What was built

Built as designed: `TeamSwitcher` molecule, `AuthHydrator`, `myTeams` in `src/stores/auth-store`. The V2 list of the February document had multi-team as *"Should"*; it arrived two weeks after the MVP.

## Open questions

- None open. The membership model later carried the admin flag as well ([[2026-03-12-admins-share-coach-rights]]).
