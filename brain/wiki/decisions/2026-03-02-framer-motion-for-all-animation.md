---
type: decision
title: Framer Motion for all animation, with shared presets
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, design and technical call, 2026-03-02 ("Goedgekeurd")
supersedes: ""
tags: [design, motion, dependencies]
sources: ["[[2026-03-02-animations-micro-interactions-design]]"]
---

# Framer Motion for all animation, with shared presets

## Decision

Framer Motion is the one animation library; every animation uses the spring and transition presets in `src/lib/animations.ts`, and all of it switches off under `prefers-reduced-motion`.

## Context

The MVP felt *"webby"* — hard cuts, spinners — against the EA FC companion app the player cards were modelled on ([[2026-03-02-animations-micro-interactions-design]]). The design wanted spring physics and mount/unmount animations everywhere, which CSS transitions do not give, and a single source of timing so the app feels like one thing.

## Alternatives considered

- **CSS transitions and keyframes only.** No bundle cost, but no springs, no exit animations, no shared physics. Lost on the native-app feel the design asks for.
- **Per-component ad-hoc animation.** Rejected by the design's shared-config requirement: three named springs, four transition presets, one stagger helper.

## Consequences

- ~15 KB gzipped on every page, accepted in the design.
- The landing-page hero demo ([[2026-03-04-landing-page-shows-the-app]]) and the share cards reuse the same presets.
- Reduced motion is a stated commitment, which matters for the [[g-voetbal]] audience; the hero demo shows a static image under it.

## Where it lives in the code

- `src/lib/animations.ts`
- Atoms `AnimatedList`, `Skeleton`, `NumberCounter`; motion in `PlayerCard`, `PitchPlayer`, `NavigationBar`, `AvailabilityToggle`
