---
type: topic
title: Statistics and fair playing time
created: 2026-10-23
updated: 2026-10-23
tags: [statistics, playing-time, g-voetbal, dashboard]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-02-26-coach-autopilot-roadmap]]", "[[2026-02-26-player-skills-profile-design]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Statistics and fair playing time

## Where we stand

Built in three layers:

1. **Per match** (2026-02-26): `match_stats` with goals, assists, yellow and red cards per player; minutes per player computed from the substitution plan (`lineups.substitution_plan`); attendance from availability.
2. **Per player** (2026-02-26): season statistics on the player page via `src/lib/player-stats-utils.ts`; the skills radar and derived rating/card tier ([[2026-02-26-player-skills-profile-design]]; six EA FC categories 1–99 since 2026-03-02, see the amendment on [[2026-02-26-skills-as-jsonb-without-history]]).
3. **Per team** (2026-09-16, web only — an Android gap in [[web-android-parity]]): `/team/stats` with the playing-time fairness chart (minutes per player against the team average), top scorers and assists, attendance percentages, and stat tiles; empty until the first completed match ([[2026-08-24-v2-sync-push-stats-design]]).

Fair playing time is why this exists. February: *"Specifiek voor G-voetbal is het extra belangrijk om speeltijd eerlijk te verdelen"* ([[2026-02-xx-project-documentatie-v1]]); August: the fairness chart is *"de hoofdattractie"*, colour-coding anyone far below average ([[g-voetbal]]).

## Requirements

- Minutes are never typed by hand; they derive from the substitution plan. A match without a plan has no minutes.
- Statistics appear only after completed matches, with an explicit empty state.
- Charts follow the `dataviz` skill (colour, dark mode, accessibility) — stated in the design.

## Decisions

- [[2026-02-26-training-library-before-stats-before-ai]] — why stats came after the library and before AI
- [[2026-02-26-skills-as-jsonb-without-history]]
- [[2026-10-23-statistics-per-season-august-to-july]]

## Risks and tensions

- **Minutes depend on coach discipline**: a coach who skips the substitution plan gets a fairness chart with zeros. The design does not address it.
- **Ratings visible to the team** (bronze/silver/gold cards) may cut against the fairness ethos in youth and G-teams; the `show_ratings` team toggle (2026-03-06) came from feedback: *"sommige teams het niet wilde"* ([[2026-10-23-open-questions-answered]]).
- **No season boundary yet**: statistics are all-time per team. Decided 2026-10-23: group per season, August to July ([[2026-10-23-statistics-per-season-august-to-july]]) — a web task, then an Android port.

## Open questions

- Build the season filter before August 2027, when the first second season starts for the earliest teams.
- Roadmap phase 3: evaluations and development over time need history that `skills` lacks.
