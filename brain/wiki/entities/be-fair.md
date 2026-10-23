---
type: entity
title: Be Fair (club, beta team)
created: 2026-10-23
updated: 2026-10-23
tags: [club, beta, g-voetbal]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-03-02-multi-team-support-design]]", "[[2026-03-04-landing-page-conversion-design]]"]
---

# Be Fair (club, beta team)

## What it is

The amateur football club where [[yustin-troost]] coaches a G-team and plays in a senior side. The February plan names *"Befair G-voetbal"* as the beta-test team ([[2026-02-xx-project-documentatie-v1]]); the multi-team design cites *"G2"* and *"5de"* as the two teams ([[2026-03-02-multi-team-support-design]]).

## Role in this project

The first real user and the source of most product intuition in the design documents: fair playing time, large touch targets, notes for individual needs, 7v7 formations. The invite-flow example *"Coach Willem nodigt je uit voor Be Fair 5"* uses the club name ([[2026-03-02-growth-seo-viral-design]]); on 2026-03-04 the real team name was removed from the landing page demo in favour of a fictional one (git history, [[2026-03-04-landing-page-shows-the-app]]).

## Key facts

- The G-team plays 8v8 (`team_type` `g_team`, `fieldPlayers: 8` in `src/lib/constants.ts`); the team types and the 8v8 and 7v7 formations were reworked on 2026-02-20 (`supabase/migrations/20260220121202_update_team_types_for_7v7.sql`, commit `b2e63a3`).
- No player, parent or coach of the club other than the developer is named anywhere in this brain, by rule (`brain/CLAUDE.md`).
- Feedback from teams has shaped at least one feature — the `show_ratings` toggle, because some teams did not want ratings shown ([[2026-10-23-open-questions-answered]]) — but none of it is written down yet.

## Relationships

- [[g-voetbal]] — the segment the beta team belongs to
- [[yustin-troost]]

## Open questions

- No feedback is written down yet (*"nee nog niet"*, [[2026-10-23-open-questions-answered]]). When it is, it goes in `raw/` as a dated folder. → [[open-questions]]
