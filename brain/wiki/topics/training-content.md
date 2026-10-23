---
type: topic
title: Training content
created: 2026-10-23
updated: 2026-10-23
tags: [training, exercises, content, ai]
sources: ["[[2026-02-26-coach-autopilot-roadmap]]"]
---

# Training content

## Where we stand

The exercise library and training plans exist since 2026-02-26 (`src/app/(main)/trainingen/`, tables `exercises` and `exercise_categories`, seeds in `supabase/migrations/20260226100001_seed_exercises.sql` and `20260226113221_add_more_exercises.sql`). Filters by level (from `team_type`), theme, player count and duration; plans combine exercises and attach to events, as the roadmap designed ([[2026-02-26-coach-autopilot-roadmap]]). The feature page `/features/trainingen` sells it publicly ([[2026-02-26-seo-feature-pages-design]]).

The content strategy in the roadmap: *"AI-gegenereerd"* initial set, curated with *"voetbaltrainer.nl, KNVB materiaal, YouTube"*, *"Alle oefeningen worden gereviewd voordat ze live gaan"*, and G-team content *"fundamenteel anders"* from senior content.

## Requirements

- A coach has a complete training in two minutes.
- Level-appropriate content, especially for [[g-voetbal]].
- Later: exercises linked to player weak points (roadmap phase 3) and AI-composed plans (phase 4).

## Decisions

- [[2026-02-26-training-library-before-stats-before-ai]]

## Risks and tensions

- **Review of the seed content is not recorded.** The strategy promised a review before going live; the seeds shipped the same day as the design. Whether a coach checked them is unsourced.
- **Provenance**: curated from KNVB and voetbaltrainer.nl material raises a licensing question nobody has written down ([[knvb-rinus]]).
- **Static library**: no source mentions adding, editing or user-contributed exercises after the seeds; content may be the first thing a returning coach finds exhausted.

## Open questions

- Who reviewed the exercises, and when does the library grow?
- Can coaches add their own exercises? (Not in any design.)
