---
type: source
title: Onboarding — setup checklist and inline hints (design)
created: 2026-10-23
updated: 2026-10-23
tags: [onboarding, conversion, ux]
source_file: docs/plans/2026-02-26-onboarding-checklist-hints-design.md (implementation plan: docs/plans/2026-02-26-onboarding-implementation.md)
source_date: 2026-02-26
language: nl
sources: []
---

# Onboarding — setup checklist and inline hints (design)

## Summary

Coaches who found TeamPlanner *"weten niet goed hoe het werkt"*: after registering they land on an empty dashboard with no tour, tooltips or steps, and the complex features (lineup editor, substitution plan) have no context. The design adds two cooperating mechanisms — a four-step setup checklist on the dashboard and one-time inline hints at four complex spots — with no external library, all dismissed-state in `localStorage`, data from existing hooks, and no database change.

## Key points

- **Checklist** (coaches only, until complete or dismissed): team created (always), players added, first match planned, invite link shared (tracked by a visit to team settings). Progress text *"2 van 4 stappen voltooid"*; each step links to the right place.
- **Hints** (coaches only, max one per page, dismissed permanently with *"Begrepen"*): availability grid, lineup editor, substitution plan, match stats. The hint copy is in the source table.
- Explicitly *"Geen externe libraries"*, *"Geen database-wijzigingen"*, *"Geen nieuwe hooks"*.

## Requirements raised

- A coach must be guided from empty dashboard to a shared invite link without reading documentation.

## Decisions made

- [[2026-02-26-onboarding-state-in-localstorage]]

## What was built

Built as designed: `src/lib/onboarding.ts`, `src/components/molecules/OnboardingChecklist/`, `OnboardingHint/`. The companion implementation plan has nine tasks matching the design's file table.

## Open questions

- `localStorage` state is per device: a coach who switches phones sees the checklist again. Accepted in the design by omission; nobody has reported it (unsourced). → [[onboarding-and-conversion]]
