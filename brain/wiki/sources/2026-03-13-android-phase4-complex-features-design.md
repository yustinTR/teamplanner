---
type: source
title: Android phase 4 — complex features (design)
created: 2026-10-23
updated: 2026-10-23
tags: [android, parity, lineup, sharing, team-settings]
source_file: ../teamplanner-android/docs/plans/2026-03-13-phase4-complex-features-design.md (implementation plan: 2026-03-13-phase4-implementation.md, 14 tasks)
source_date: 2026-03-13
language: en
sources: []
---

# Android phase 4 — complex features (design)

## Summary

The lineup editor with drag-and-drop, formation selector and auto-lineup; the substitution planner with minutes bars and auto-generation; lineup image sharing; team settings with invite link. It reproduces the web's JSONB shapes for `lineups.positions` and `substitution_plan` as Kotlin models, the web's formation tables per team type (11v11, G-team 8v8, 7v7), and the web's auto-lineup and substitution algorithms (*"same as web app"*). Technical choices are tabulated with rationale: custom `pointerInput` drag-and-drop, Compose `Canvas` to `Bitmap` for the image, ratings *"Included from start — Full 1-to-1 parity with web app"*.

## Key points

- Player cards follow `team.showRatings`: EAFC card with tier colour, or a plain circle.
- Auto-substitution rules copied: moments `ceil(totalPlayers / benchSize) - 1` capped at 6, G-teams one moment per 8 minutes, others per 10, keeper fixed.
- Share image is **540×810 px**, dark gradient, pitch, bench, substitution timeline, *"myteamplanner.nl"* footer — half the web's 1080×1350 ([[2026-03-02-share-images-from-hidden-components]]); shared through `FileProvider` and the Android share sheet.
- Team settings: name, club, team type, gathering minutes, home address, show-ratings toggle; invite link with copy and a WhatsApp share intent.
- Not in scope, although the Expo plan had it in phase 4: voetbal.nl import ([[2026-03-13-seo-blog-native-app-design]]).

## Requirements raised

- Lineup and substitution data written by either client must be readable by the other: one JSON shape, two serialisers.

## Decisions made

- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]

## What was built

Built on 2026-03-15 in three commits (data layer; UI; navigation wiring) plus a compile fix — the last feature work in the repository before the rename on 2026-10-23. Files `ui/lineup/*`, `ui/team/TeamSettingsScreen.kt`, `data/LineupGenerator.kt`, `data/PlayerRating.kt`.

## Open questions

- The 3-4-3 formation added to the web on 2026-04-23 is absent from Android's constants. → [[web-android-parity]]
- Is 540×810 an accepted difference or a bug? → [[web-android-parity]]
