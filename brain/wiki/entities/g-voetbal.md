---
type: entity
title: G-voetbal (football for players with a disability)
created: 2026-10-23
updated: 2026-10-23
tags: [audience, accessibility, g-voetbal]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-02-26-coach-autopilot-roadmap]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# G-voetbal (football for players with a disability)

## What it is

The KNVB's football category for players with a physical or mental disability, usually 7v7 on a half pitch. One of three audience segments (senior, youth, G) and the one the developer coaches ([[be-fair]]).

## Role in this project

The segment that makes TeamPlanner different from a generic team app. The February document: *"Specifiek voor G-voetbal is het extra belangrijk om speeltijd eerlijk te verdelen en rekening te houden met individuele behoeften van spelers"* ([[2026-02-xx-project-documentatie-v1]]). It explains four product traits:

- **Fair playing time** as a first-class concern: the substitution plan computes minutes per player, and the season dashboard's headline chart is minutes fairness, *"cruciaal bij G-voetbal"* ([[2026-08-24-v2-sync-push-stats-design]]). See [[statistics-and-fair-playing-time]].
- **Accessibility** as design principle 3 in `PROJECT_CONTEXT.md`: *"G-voetbal spelers en hun begeleiders moeten het kunnen gebruiken. Grote touch targets, duidelijke labels."* Reduced-motion support in [[2026-03-02-framer-motion-for-all-animation]] serves the same group.
- **Notes per player** for *"G-voetbal bijzonderheden"* (`PROJECT_CONTEXT.md`).
- **Training content that differs by level**: G-team exercises focus on *"plezier en motoriek vs. tactiek en intensiteit"* ([[2026-02-26-coach-autopilot-roadmap]]). See [[training-content]].

## Key facts

- Team type `g_team` plays 8v8 with 2×30 minutes (`TEAM_TYPE_CONFIG` in `src/lib/constants.ts`); its own formation set exists on both clients ([[web-android-parity]]).
- Parents and carers of G-players are a named audience with a planned read-only view that was never built ([[2026-02-xx-project-documentatie-v1]]).
- The landing page FAQ promises G-team suitability publicly ([[2026-02-26-seo-feature-pages-design]]).

## Relationships

- [[be-fair]] — the beta G-team
- [[statistics-and-fair-playing-time]], [[training-content]], [[design-and-motion]]

## Open questions

- Is there any G-voetbal-specific accessibility testing, with real players or carers? Nothing recorded. → [[open-questions]]
