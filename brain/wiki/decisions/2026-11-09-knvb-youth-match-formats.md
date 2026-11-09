---
type: decision
title: Team types follow the KNVB youth match formats
created: 2026-11-09
updated: 2026-11-09
status: proposed
decided_by: Yustin Troost (asked for "alles", 2026-11-09); migration awaiting his approval
supersedes: ""
tags: [decision, data-model, youth, seo]
sources: ["[[2026-11-09-search-and-usage-reading]]"]
---

# Team types follow the KNVB youth match formats

## Decision

Youth team types match the KNVB formats: JO8–JO10 play 6 v 6 (JO8–JO9 2x20, JO10 2x25), JO11–JO12 play 8 v 8 (2x30), JO13 and older 11 v 11. New enum values `jo12_jo11`, `jo10`, `jo9_jo8`; `jo15_jo13` becomes 11 v 11; `jo11_jo9` stays as a legacy 7 v 7 type so existing lineups keep working.

## Context

Since 2026-02-20 (`supabase/migrations/20260220121202_update_team_types_for_7v7.sql`) the app modelled JO9–JO15 as 7 v 7. Checked on 2026-11-09 against the KNVB infographics for 6 tegen 6 and 8 tegen 8 (knvb.nl, seasons 2024/'25 and 2025/'26): no KNVB youth category plays 7 v 7. A JO11 coach could not build the lineup they actually play, and the blog claimed "JO11 and JO9 play with 7 players". Affected on 2026-11-09: 6 `jo15_jo13` teams (no lineups) and 4 `jo11_jo9` teams (one with lineups).

## Alternatives considered

- **Migrate `jo11_jo9` teams to a new type automatically** — rejected: the stored type does not say whether a team is JO9 or JO11, and the one team with lineups would see its 7 v 7 positions break. The coach picks the new type in team settings.
- **Keep 7 v 7 and only fix the blog** — rejected: the formats are the product's core promise for youth coaches, and 6 v 6 / 8 v 8 are search terms the site could not serve.

## Consequences

- Exercises tagged `jo11_jo9` are also tagged with the three new types (same migration), so exercise filters keep working.
- Android must ship the same constants; done on branch `feature/knvb-youth-formats` in both repositories ([[web-android-parity]]).
- The free tools ([[growth-and-seo]]) offer exactly these formats.

## Where it lives in the code

`supabase/migrations/20261109120000_knvb_youth_team_types.sql`, `src/lib/constants.ts` (`TEAM_TYPE_CONFIG`, `FORMATIONS_6`), `data/Constants.kt` on Android. Status `proposed` until the migration runs on production.
