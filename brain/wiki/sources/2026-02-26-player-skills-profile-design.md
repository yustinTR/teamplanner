---
type: source
title: Player skills profile (design)
created: 2026-10-23
updated: 2026-10-23
tags: [players, skills, data-model, ratings]
source_file: docs/plans/2026-02-26-player-skills-profile-design.md (implementation plan: docs/plans/2026-02-26-player-skills-implementation.md)
source_date: 2026-02-26
language: nl
sources: []
---

# Player skills profile (design)

## Summary

Coaches had only a free-text `notes` field for what a player is good at. The design adds ten skills scored 1–10, stored as a JSONB column on `players`, shown as a Recharts radar on the player page, editable only by the coach through a bottom sheet with sliders. Deliberately *"Geen historie — één set scores per speler, overschrijfbaar door de coach."* Everyone can see the chart; only the coach can edit.

## Key points

- Ten skills: speed, strength, technique, passing, dribbling, heading, defending, positioning, finishing, stamina — Dutch labels in the source, constant `PLAYER_SKILLS` in `src/lib/constants.ts`.
- Storage: `ALTER TABLE players ADD COLUMN skills jsonb DEFAULT '{}'`; no new table, no new hook (`useUpdatePlayer` already accepts arbitrary columns).
- Empty state *"Nog geen vaardigheden beoordeeld"* with a *"Beoordelen"* button for the coach.

## Requirements raised

- Structured, visual record of a player's strengths and weaknesses, readable by the player.

## Decisions made

- [[2026-02-26-skills-as-jsonb-without-history]]

## What was built

Built as designed (`supabase/migrations/20260226161850_add_player_skills.sql`, `SkillsRadar`, `SkillsEditor`). Two things grew out of it that the design does not mention: an overall rating and bronze/silver/gold card tier derived from the skills (`src/lib/player-rating.ts`, `PlayerCard`), and a `show_ratings` team setting (commit of 2026-03-06) to hide the cards in the lineup. The schema also carries `skills_version` (`PROJECT_CONTEXT.md`), which the design did not foresee; what it versions is not recorded (unsourced).

## Open questions

- Is a rating visible to the whole team a motivator or a problem for youth and G-players? The `show_ratings` toggle suggests the question came up; the reasoning is not recorded. → [[open-questions]]
- The roadmap's phase 3 wants development *over time*; the no-history choice blocks that. → [[2026-02-26-skills-as-jsonb-without-history]]
