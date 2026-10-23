---
type: decision
title: Roadmap order — training library, then statistics, then development, then AI
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product call, 2026-02-26
supersedes: ""
tags: [roadmap, training, statistics, ai]
sources: ["[[2026-02-26-coach-autopilot-roadmap]]"]
---

# Roadmap order — training library, then statistics, then development, then AI

## Decision

After the MVP, features are built in the order training-exercise library → player statistics → player development → AI suggestions, because each later phase consumes the data of the earlier ones.

## Context

The roadmap reframes the product as a *"digitale assistent-coach"* and argues that an AI layer is only worth anything once a filled library, at least half a season of statistics and per-player development context exist ([[2026-02-26-coach-autopilot-roadmap]]). The library comes first because it is the one phase that gives a coach value on day one without any accumulated data.

## Alternatives considered

- **Statistics first.** Would have fed the fairness chart sooner, but a new team has no statistics for weeks; the library is useful on the first training.
- **AI first, as the differentiator.** Nothing to reason over; rejected by the roadmap's own prerequisites.

## Consequences

- Phases 1 and 2 are built (library 2026-02-26; stats 2026-02-26 and dashboard 2026-09-16). Phase 3 has no design; phase 4 is the only feature ever called *"potentieel premium"*. See [[product-vision-and-roadmap]], [[monetisation]].
- The library's content strategy (AI-generated set, curated, reviewed) is a content-quality commitment with no recorded review. See [[training-content]].

## Where it lives in the code

- Library: `supabase/migrations/20260226100000_create_exercises_tables.sql` and seeds, `src/app/(main)/trainingen/`
- Statistics: `supabase/migrations/20260226133836_create_match_stats.sql`, `src/app/(main)/team/stats/`
