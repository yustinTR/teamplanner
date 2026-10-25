---
type: note
title: First active-team count — 2 of 22
created: 2026-10-23
updated: 2026-10-23
question: How many teams are active by the 2026-10-23 definition, and how does that compare with the row count?
tags: [growth, metrics, active-teams]
sources: ["[[2026-10-23-active-team-definition]]", "[[2026-10-23-open-questions-answered]]"]
---

# First active-team count — 2 of 22

## Answer

**Two teams are active** by the definition in [[2026-10-23-active-team-definition]] (a match or event dated in the last 60 days, and at least two players with a linked account). The database holds 22 teams, not the 25 reported from memory on 2026-10-23. Twenty teams are *set up, not adopted*: fewer than two members ever linked an account.

| Measure (2026-10-23, Supabase query) | Count |
|---|---|
| Teams in `teams` | 22 |
| Active: activity in last 60 days **and** ≥ 2 linked players | 2 |
| Same, also counting matches or events in the next 60 days | 2 |
| Teams with any match or event within ±60 days, regardless of members | 10 |
| Set up, not adopted (< 2 linked players) | 20 |
| Matches in total | 98 |
| Players with an account, all teams | 27 |

## Reasoning

> Re-read on 2026-10-25: the "adoption, not acquisition" conclusion below rested on the two-member rule, which Yustin rejected. See [[2026-10-25-active-team-recount]] (11 of 23 active).

The gap is adoption, not acquisition: ten teams have a live schedule (most of them through the voetbal.nl import and daily sync), but on all but two of them nobody besides the coach has an account. The invite step of the funnel ([[onboarding-and-conversion]]) is where teams stall. Push notifications ([[notifications]]) cannot help a team whose players never registered; the invite link and the join flow can.

This reading is the baseline for the growth thresholds in [[2026-03-02-growth-before-monetisation]]: 2 of the first 100, not 25.

## How to repeat

Run monthly and append a row here:

```sql
with linked as (
  select team_id, count(*) as linked_players
  from players where user_id is not null and is_active group by team_id
), recent as (
  select team_id from matches where match_date between now() - interval '60 days' and now()
  union select team_id from events where event_date between now() - interval '60 days' and now()
)
select
  (select count(*) from teams) as teams_total,
  (select count(*) from teams t join linked l on l.team_id = t.id
     where l.linked_players >= 2 and t.id in (select team_id from recent)) as active,
  (select count(*) from teams t left join linked l on l.team_id = t.id
     where coalesce(l.linked_players, 0) < 2) as set_up_not_adopted;
```

## Series

| Date | Teams | Active | Set up, not adopted |
|---|---|---|---|
| 2026-10-23 | 22 | 2 | 20 |
