---
type: source
title: Android phase 3 — interaction features (design)
created: 2026-10-23
updated: 2026-10-23
tags: [android, parity, crud, permissions]
source_file: ../teamplanner-android/docs/plans/2026-03-13-phase3-interaction-design.md (implementation plan: 2026-03-13-phase3-implementation.md, 13 tasks)
source_date: 2026-03-13
language: en
sources: []
---

# Android phase 3 — interaction features (design)

## Summary

All coach-only writes: match CRUD with score dialog and a stats grid, player CRUD with photo upload through the Android Photo Picker and Supabase Storage, event CRUD with tasks, and inline profile editing — *"All matching the web app 1-to-1."* Forms are Material 3 `ModalBottomSheet`s, confirmations and score entry are `AlertDialog`s. The coach check is written out: `isCoach = team.createdBy == currentUserId || currentPlayer.isAdmin`, which already includes the admin flag of [[2026-03-12-admins-share-coach-rights]], shipped on the web the day before.

## Key points

- Field tables per form with Dutch labels (Tegenstander, Datum en tijd, Thuis / Uit, Reistijd (minuten), Rugnummer, Speler / Teammanager…) — the parity contract at field level.
- Photos resized to 512 px JPEG 85 %, stored at `player-photos/{teamId}/{playerId}.jpg`.
- Match stats grid shows all active players, to be filtered to lineup players in phase 4 (*"See memory: project_phase4_stats_filter.md"* — a Claude Code memory, not a brain page).
- Profile edit updates auth metadata and the player record.

## Requirements raised

- A coach can run a season from the phone without the web app.

## Decisions made

- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]

## What was built

Built on 2026-03-13 across a dozen commits, then extended the same day beyond the design: coach-managed availability and attendance for players without accounts, and loan-player create and delete for matches (git history). The web got *"allow coaches to set availability for all players"* on 2026-04-10 — four weeks **after** Android. Whether the phase-4 stats filter was applied is unverified.

## Open questions

- Was the match-stats grid filtered to lineup players in phase 4? → [[web-android-parity]]
