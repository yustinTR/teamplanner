---
type: decision
title: Statistics are grouped per season, August to July
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product call, 2026-10-23
supersedes: ""
tags: [statistics, data-model, seasons]
sources: ["[[2026-10-23-open-questions-answered]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Statistics are grouped per season, August to July

## Decision

Season statistics are separated per season; a season runs from August to July, following the Dutch amateur calendar.

## Context

The season dashboard aggregates every completed match of a team ([[2026-08-24-v2-sync-push-stats-design]]); nothing in the data model knows what a season is, so next year's figures would merge with this year's ([[statistics-and-fair-playing-time]]). Asked, Yustin confirmed the boundary: *"een nieuw voetbalseizoen begint vaak in augustus en eindigt in juli"*.

## Alternatives considered

- **All-time statistics only.** The current state; useless for the fairness chart after one season.
- **A coach-defined season table.** More flexible, more UI; not needed when the boundary is the same for everyone.

## Consequences

- The dashboard and player statistics need a season filter derived from `match_date` (1 August to 31 July), defaulting to the current season, with earlier seasons selectable — a web task, then an Android port ([[web-android-parity]]).
- No schema change is required for the boundary; a stored season label would only be needed for exceptions, which no source mentions.

## Where it lives in the code

- To do: `src/lib/player-stats-utils.ts`, `src/hooks/use-team-season-stats`, `src/app/(main)/team/stats/`
