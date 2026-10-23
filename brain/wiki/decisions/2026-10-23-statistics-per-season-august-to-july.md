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

- **Built on the web the same day** (commit `2931452`): `src/lib/season.ts` derives the season from `match_date`; the team dashboard has a season selector when more than one season has matches; player and dashboard statistics default to the current season and say so in their heading. Android port owed ([[web-android-parity]]).
- No schema change is required for the boundary; a stored season label would only be needed for exceptions, which no source mentions.

## Where it lives in the code

- `src/lib/season.ts` (tests in `src/lib/__tests__/season.test.ts`), `src/components/molecules/SeasonSelect/`, `src/hooks/use-team-stats.ts`, `src/hooks/use-player-stats.ts`, `src/components/organisms/TeamStatsDashboard/`
