---
type: source
title: Roadmap — "De Autopilot voor Amateurvoetbalcoaches"
created: 2026-10-23
updated: 2026-10-23
tags: [vision, roadmap, training, statistics, ai, monetisation]
source_file: docs/plans/2026-02-26-coach-autopilot-roadmap-design.md
source_date: 2026-02-26
language: nl
sources: []
---

# Roadmap — "De Autopilot voor Amateurvoetbalcoaches"

## Summary

One week after the MVP, this roadmap reframes TeamPlanner from an organisation tool into a *"digitale assistent-coach"*: automation that saves coaches time and makes them smarter, where *"WhatsApp kan alleen berichten sturen — TeamPlanner denkt mee."* It orders four phases — a training-exercise library, player statistics, player development, and an AI layer — and argues the order from data dependencies. Monetisation is explicitly postponed. The competitive framing is against both [[whatsapp]] (no features) and [[knvb-rinus]] (no team management).

## Key points

- **Growth model**: *"Coach overtuigen → team volgt automatisch."* The coach is the buyer; players and parents arrive through the invite link.
- **Fase 1 — training library**: coaches lose time inventing trainings; Rinus *"is overweldigend en niet geïntegreerd met teammanagement"*. Filters by team level (derived from `team_type`), theme, player count, duration; exercises combine into a plan linked to a calendar event. Content strategy: *"AI-gegenereerd"* initial set, curated with existing sources, reviewed before going live; G-team exercises are *"fundamenteel anders"* (fun and motor skills, not tactics).
- **Fase 2 — player statistics**: goals, assists, minutes (from the substitution plan), attendance (from availability). Why after phase 1: statistics are *"het fundament voor alles wat later komt"* — fair lineups, AI training plans, measurable development.
- **Fase 3 — player development**: strengths and weak points per player, linked to exercises; evaluations per period.
- **Fase 4 — AI layer**, *"toekomst, potentieel premium"*: suggestions from statistics + weak points + library. Needs a filled library, at least half a season of data, and phase 3 context.
- **Monetisation**: *"Nog niet bepaald — focus nu op gebruikersbasis opbouwen."* Architecture should allow a paywall later. Candidates: freemium, feature tiering, club licence.

## Requirements raised

- Exercise library with level/theme/count/duration filters and plans attached to events.
- Match stats entry after a match; minutes derived automatically from the substitution plan.
- Per-player development notes and evaluations (phase 3, unbuilt).

## Decisions made

- [[2026-02-26-training-library-before-stats-before-ai]]
- [[2026-03-02-growth-before-monetisation]] (this document first states the postponement; the 2026-03-02 growth design makes it concrete)

## What was built

- Phase 1 was built the same day: `supabase/migrations/20260226100000_create_exercises_tables.sql` and seed migrations, `src/app/(main)/trainingen/`. The level filter uses `team_type` as designed. Whether the seed exercises were reviewed before going live is not recorded (unsourced).
- Phase 2 was built in two steps: `match_stats` on 2026-02-26 and the team season dashboard on 2026-09-16 ([[2026-08-24-v2-sync-push-stats-design]]).
- Phases 3 and 4 are not built. The 10-skill profile of [[2026-02-26-player-skills-profile-design]] is a partial, structured answer to phase 3's "strengths and weak points", without the link to exercises or the history.

## Open questions

- Phase 3 (development history, evaluations) has no design and no date. → [[product-vision-and-roadmap]]
- The AI layer's "potentially premium" is the only place a paid feature is named after the Stripe tiers were dropped. → [[monetisation]]
