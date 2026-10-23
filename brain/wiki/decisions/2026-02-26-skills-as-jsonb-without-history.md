---
type: decision
title: Player skills as one JSONB object, no history
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, technical call, 2026-02-26
supersedes: ""
tags: [data-model, players, skills]
sources: ["[[2026-02-26-player-skills-profile-design]]", "[[2026-02-26-coach-autopilot-roadmap]]"]
---

# Player skills as one JSONB object, no history

> [!info] Amended 2026-03-02
> Four days after this design, commit `75aaa9e` (*"feat: add EAFC26-style player rating system with FUT cards"*, git history) replaced the ten 1–10 skills with six EA FC categories scored 1–99 (`EAFC_ATTRIBUTE_CATEGORIES` in `src/lib/constants.ts`). Old objects are converted on read by `ensureEafcFormat()` in `src/lib/player-rating.ts`; no migration adds a `skills_version` column, so the `skills_version` in `PROJECT_CONTEXT.md` describes this in-code versioning, not a database field. The JSONB-without-history decision stands; the shape changed. [[teamplanner-android]] was born on the v2 shape.

## Decision

Ten skill scores live in a single `skills` JSONB column on `players`; the coach overwrites them, and no earlier values are kept.

## Context

The need was a structured, visual replacement for the free-text `notes` field ([[2026-02-26-player-skills-profile-design]]). A JSONB column needs no new table, no new hook and no join: *"Geen nieuwe database-tabellen"*, *"Geen nieuwe hooks"*. The same day's roadmap wants player *development* tracked over time (phase 3, [[2026-02-26-coach-autopilot-roadmap]]), which this choice does not serve — a conscious trade of future history for present simplicity.

## Alternatives considered

- **A `player_skills` table with one row per assessment.** Gives history and trends; costs a table, a hook, and a decision about which row is "current". Rejected for now in favour of shipping the radar in a day.
- **Ten numeric columns.** Typed and queryable, but every new skill is a migration. JSONB keeps the skill list in `src/lib/constants.ts`.

## Consequences

- The overall rating and card tier (`src/lib/player-rating.ts`) are derived on the fly from the JSONB; nothing is stored.
- The shape is versioned in code, not in the database (see the amendment above); both clients must agree on it — [[web-android-parity]].
- Roadmap phase 3 (development over time) will need a history table or a changelog; when that comes, this decision gets superseded.

## Where it lives in the code

- `supabase/migrations/20260226161850_add_player_skills.sql`
- `src/lib/constants.ts` (`PLAYER_SKILLS`), `src/lib/player-rating.ts`
- `src/components/molecules/SkillsRadar/`, `SkillsEditor/`
