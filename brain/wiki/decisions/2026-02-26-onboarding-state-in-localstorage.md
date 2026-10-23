---
type: decision
title: Onboarding state in localStorage, not the database
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, technical call, 2026-02-26
supersedes: ""
tags: [onboarding, data-model, ux]
sources: ["[[2026-02-26-onboarding-checklist-hints-design]]"]
---

# Onboarding state in localStorage, not the database

## Decision

Which hints a coach dismissed and whether the checklist was closed are stored in the browser's `localStorage`; the checklist's progress is computed from existing data (player count, match count).

## Context

The onboarding design was scoped to ship without a migration, a hook or a library ([[2026-02-26-onboarding-checklist-hints-design]]). Dismissed-state is low-value data: losing it means seeing a hint twice.

## Alternatives considered

- **A `user_preferences` table or JSONB on the profile.** Survives a device switch and makes the state visible server-side; costs a migration and a hook for data nobody queries.
- **An onboarding library (tours, tooltips).** Rejected as a dependency for four hints.

## Consequences

- State is per device and per browser; a coach on a new phone sees the checklist and hints again. Accepted implicitly.
- The pattern was reused for the last-selected team in the team switcher ([[2026-03-02-players-table-as-team-membership]]).

## Where it lives in the code

- `src/lib/onboarding.ts`
- `src/components/molecules/OnboardingChecklist/`, `OnboardingHint/`
