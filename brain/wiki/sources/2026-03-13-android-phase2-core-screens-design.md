---
type: source
title: Android phase 2 — core screens, read-only (design)
created: 2026-10-23
updated: 2026-10-23
tags: [android, parity, screens]
source_file: ../teamplanner-android/docs/plans/2026-03-13-phase2-core-screens-design.md (implementation plan: 2026-03-13-phase2-implementation.md, 16 tasks)
source_date: 2026-03-13
language: en
sources: []
---

# Android phase 2 — core screens, read-only (design)

## Summary

The first feature design of [[teamplanner-android]], written the day the app was scaffolded. Scope: every read-only screen of the web app *"matching the web app 1-to-1"* — dashboard, match list and detail, player list and detail with the skills radar, event list and detail, training plans and the exercise library — plus two small writes, availability and attendance. Data layer mirrors the web's tables as `@Serializable` models with repositories per domain and a single `Constants.kt` copied *"1-to-1 from web app's `constants.ts`"*. Each feature is a vertical slice: model → repository → ViewModel → screen.

## Key points

- The radar is *"6 EAFC category axes, values 1-99"* — the web's v2 skills model of 2026-03-02, not the ten 1–10 skills of [[2026-02-26-player-skills-profile-design]]. The Android app was born on the v2 model.
- Match detail includes a *"Borrowed players list"* (`match_players`, leen-spelers), which the web has had since 2026-02-20.
- Team context: *"`teamId` passed as parameter from MainViewModel, no global state"* and `TeamRepository` *"Fetch team for current user"* — singular. Multi-team ([[2026-03-02-players-table-as-team-membership]]) is not in scope.
- Decisions listed: custom Compose Canvas for the radar (no chart library); availability and attendance toggles pulled into phase 2; coach writes deferred to phase 3; lineup to phase 4.

## Requirements raised

- Every screen a player sees on the web exists on Android with the same Dutch labels and the same data.

## Decisions made

- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]

## What was built

Built on 2026-03-13 in two commits (*"constants, data models, repositories, and routes for Phase 2"*, *"all Phase 2 screens, ViewModels, and shared components"*, git history of the Android repository). Files under `ui/dashboard`, `ui/matches`, `ui/team`, `ui/events`, `ui/components/SkillsRadarChart.kt`.

## Open questions

- Is the availability grid live (Supabase Realtime) on Android as on the web? The DI module provides Realtime; use is unverified. → [[web-android-parity]]
- Multi-team: does a user with two teams see a switcher on Android? Not in this design. → [[web-android-parity]]
