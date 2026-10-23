---
type: decision
title: The Android share image matches the web card, 1080×1350
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: delegated by Yustin Troost to the assistant on 2026-10-23 ("dat is een keuze die jij beter kan maken"); recorded here so it can be overturned
supersedes: ""
tags: [android, parity, sharing]
sources: ["[[2026-10-23-open-questions-answered]]", "[[2026-03-13-android-phase4-complex-features-design]]"]
---

# The Android share image matches the web card, 1080×1350

## Decision

The Android lineup image is rendered at the web's 1080×1350 px with the same layout, so a shared lineup looks the same whichever client made it; the 540×810 Canvas of phase 4 is a gap, not an allowed difference.

## Context

Phase 4 chose 540×810 without a stated reason ([[2026-03-13-android-phase4-complex-features-design]]); the web renders 1080×1350 ([[2026-03-02-share-images-from-hidden-components]]). Yustin delegated the call. The shared image is a brand asset and the viral loop ([[2026-03-02-growth-seo-viral-design]]): one shape means one recognisable card, and WhatsApp's compression punishes a small source more than a large one.

## Alternatives considered

- **Keep 540×810 as an allowed difference.** Cheaper to render, but a visibly softer image next to the web's, and two layouts to maintain.
- **Shrink the web to 540×810.** Would degrade the client that most people use.

## Consequences

- An Android task: scale the Canvas and verify the layout against the web card side by side. Ledger row updated in [[web-android-parity]].
- Any later change to the card layout is made on the web first and ported.

## Where it lives in the code

- Web: `src/components/molecules/ShareLineupCard/`; Android: `ui/lineup/ShareLineupImage.kt`
