---
type: decision
title: An active team has recent activity and real members
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, 2026-10-23, agreeing to the assistant's proposal ("ja ik ben het eens")
supersedes: ""
tags: [growth, metrics, definition]
sources: ["[[2026-10-23-open-questions-answered]]"]
---

# An active team has recent activity and real members

## Decision

A team counts as active when it has at least one match or event dated in the last 60 days and two or more players with a linked account. The growth plan's thresholds (100, 500) are measured against this count, not against rows in `teams`.

## Context

The growth strategy sets its phases by *"active teams"* ([[2026-03-02-growth-before-monetisation]]) without defining the term. The only number recorded, 25 on 2026-10-23, turned out to be the row count of `teams` ([[2026-10-23-open-questions-answered]]), which includes test teams, abandoned teams and teams whose coach never invited anyone. The definition needed to exclude those without needing new data: matches, events and `players.user_id` already exist.

## Alternatives considered

- **Row count** — what was reported; counts dead teams.
- **Logins in the last 30 days** — needs auth analytics the project does not keep per team.
- **Any availability response in the last 30 days** — closest to real use, but a team between seasons (June, July) would drop out; the 60-day window on matches and events is more forgiving of the summer break.

## Consequences

- One SQL query, run by hand for now, logged monthly in a `wiki/notes/` page or in `raw/` as an export; the first reading is still to be taken.
- Teams with one coach and no linked players are "set up, not adopted" — a useful second number for the onboarding funnel ([[onboarding-and-conversion]]).
- The 60-day window makes August the natural reading point, when the season starts ([[2026-10-23-statistics-per-season-august-to-july]]).

## Where it lives in the code

- Nowhere yet; a query against `teams`, `matches`, `events`, `players`. Nothing in the app needs to change.
