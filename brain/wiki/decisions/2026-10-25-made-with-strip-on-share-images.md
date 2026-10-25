---
type: decision
title: Share images carry a "Gemaakt met MyTeamPlanner" strip
created: 2026-10-25
updated: 2026-10-25
status: accepted
decided_by: Yustin Troost, 2026-10-25 ("gemaakt met myteamplanner strook"), choosing between a subtle URL footer and a full strip
supersedes: ""
tags: [growth, sharing, design, parity]
sources: ["[[2026-03-02-share-images-from-hidden-components]]", "[[2026-10-25-roadmap-coach-first-autumn-2026]]"]
---

# Share images carry a "Gemaakt met MyTeamPlanner" strip

## Decision

The lineup card and the match report, on web and Android alike, end in a full-width green strip (primary `#16A34A`, white text): the app icon, **Gemaakt met MyTeamPlanner** and `myteamplanner.nl · gratis voor je team`. It replaces the faint `myteamplanner.nl` footer that was barely visible on the dark card. Same layout, text and colours on both clients; Android draws it on the canvas, web renders it in the hidden component ([[2026-03-02-share-images-from-hidden-components]]).

## Context

Nine of eleven active teams are coach-only; the shared image is how the product reaches a team's WhatsApp group, i.e. the only acquisition channel that already works ([[2026-10-25-active-team-recount]]). The old footer was 11 px at 25 % opacity: the picture travelled, the name did not.

## Alternatives considered

- **Subtle footer with the URL only** — offered; Yustin chose the strip.
- **Watermark across the pitch** — hurts the picture the coach is proud of.
- **Strip only on web** — would break the parity rule ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]]).

## Consequences

- Web: `ShareLineupCard`, `ShareMatchReport`; Android: `ShareLineupImage.kt`, `ShareMatchReport.kt` (card height grows by the strip).
- Ledger row updated in [[web-android-parity]].
