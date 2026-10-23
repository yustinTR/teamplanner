---
type: decision
title: The Android share image matches the web card (540 px at scale 2)
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: delegated by Yustin Troost to the assistant on 2026-10-23 ("dat is een keuze die jij beter kan maken"); recorded here so it can be overturned
supersedes: ""
tags: [android, parity, sharing]
sources: ["[[2026-10-23-open-questions-answered]]", "[[2026-03-13-android-phase4-complex-features-design]]"]
---

# The Android share image matches the web card (540 px at scale 2)

## Decision

The Android lineup image is rendered at the same size and resolution as the web card, so a shared lineup looks the same whichever client made it. Checked against the code on 2026-10-23: the web card is a 540 CSS px wide component captured at scale 2 (`src/hooks/use-share-image.ts`), not the 1080×1350 of the design document — so Android keeps its 540×810 layout and renders it at scale 2 (1080×1620). Built the same day.

## Context

Phase 4 chose 540×810 without a stated reason ([[2026-03-13-android-phase4-complex-features-design]]); the web renders 1080×1350 ([[2026-03-02-share-images-from-hidden-components]]). Yustin delegated the call. The shared image is a brand asset and the viral loop ([[2026-03-02-growth-seo-viral-design]]): one shape means one recognisable card, and WhatsApp's compression punishes a small source more than a large one.

## Alternatives considered

- **Keep 540×810 as an allowed difference.** Cheaper to render, but a visibly softer image next to the web's, and two layouts to maintain.
- **Shrink the web to 540×810.** Would degrade the client that most people use.

## Consequences

- Built 2026-10-23 (`ShareLineupImage.kt`, `SCALE = 2`); the layout should still be compared side by side on a device. Ledger row updated in [[web-android-parity]].
- Any later change to the card layout is made on the web first and ported.

## Where it lives in the code

- Web: `src/components/molecules/ShareLineupCard/`; Android: `ui/lineup/ShareLineupImage.kt`
