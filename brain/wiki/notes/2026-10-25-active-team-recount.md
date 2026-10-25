---
type: note
title: Active-team recount — 11 of 23, nine coach-only
created: 2026-10-25
updated: 2026-10-25
question: How many teams are active once activity is measured as coach use rather than linked members?
tags: [growth, metrics, active-teams]
sources: ["[[2026-10-25-active-team-means-coach-use]]", "[[2026-10-23-active-team-count]]"]
---

# Active-team recount — 11 of 23, nine coach-only

## Answer

| Measure (2026-10-25, Supabase query) | Count |
|---|---|
| Teams in `teams` | 23 |
| Active: match or event within ±60 days, or a lineup edited in the last 60 days | 11 |
| … of which with two or more linked members | 2 |
| … of which coach-only | 9 |
| Edited a lineup in the last 60 days | 5 |
| Teams with five or more players entered | 13 |

## Reasoning

Half the teams are in use. Nine of the eleven are run by the coach alone, which Yustin considers a normal mode, not a stalled onboarding ([[2026-10-25-active-team-means-coach-use]]). Five teams touched a lineup recently; that is the strongest signal that the core promise (opstelling maken en delen) is being used. The earlier conclusion that "adoption is the bottleneck" ([[2026-10-23-active-team-count]]) is withdrawn; the open question is now whether the nine coach-only teams would benefit from members or are served well as they are.

## Query

The same CTE query as on 2026-10-23, with `lineups.updated_at` added as an activity source and the member condition moved into a separate column. Repeat monthly; August is the natural reading point.
