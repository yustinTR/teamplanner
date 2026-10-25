---
type: decision
title: An active team is one the coach uses; members are a separate measure
created: 2026-10-25
updated: 2026-10-25
status: accepted
decided_by: Yustin Troost, 2026-10-25, correcting the assistant's framing ("als een team aangemaakt wordt en geen tweede lid is niks ergs, want de coach kan de app ook puur voor zichzelf gebruiken en de opstelling delen vanuit de app")
supersedes: "[[2026-10-23-active-team-definition]]"
tags: [growth, metrics, definition, product-vision]
sources: ["[[2026-10-23-active-team-count]]"]
---

# An active team is one the coach uses; members are a separate measure

## Decision

A team is **active** when it shows use in the last 60 days: a match or event in the ±60-day window, or a lineup edited in that window. Whether players have linked accounts does not decide activity. **Team adoption** (two or more linked members) is tracked as a second, separate number, because it unlocks availability and push, but a coach-only team is a fully valid way to use the product: the coach plans, makes the lineup and shares it as an image from the app.

## Context

The 2026-10-23 definition required two linked players and produced "2 active of 22", read as an adoption failure ([[2026-10-23-active-team-count]]). Yustin rejected that reading: the share image ([[2026-03-02-share-images-from-hidden-components]]) exists precisely so a coach can run the team alone and push the result into WhatsApp. Counting those coaches as "not adopted" measured the wrong thing. Re-counted the same day with the new definition: 11 active teams of 23, nine of them coach-only.

## Alternatives considered

- **Keep the two-member rule** — treats the coach-only mode, a deliberate product path, as failure.
- **Logins** — not tracked per team.
- **Lineup edits only** — the sharpest signal of real use (5 teams in 60 days) but misses coaches who only track matches and availability.

## Consequences

- The growth thresholds (100, 500 active teams, [[2026-03-02-growth-before-monetisation]]) count coach use, not members.
- "Adoption" leaves the risk list of [[overview]]; the open question becomes whether coach-only teams *want* members (then the invite flow matters) or are content alone (then sharing quality matters more than inviting).
- The monthly query reports three numbers: active, active with ≥2 members, active coach-only.

## Where it lives in the code

- Nowhere; a hand-run query. Nothing in the app changes.
