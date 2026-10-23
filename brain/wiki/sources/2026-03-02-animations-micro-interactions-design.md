---
type: source
title: Animations and micro-interactions — Framer Motion polish pack (design)
created: 2026-10-23
updated: 2026-10-23
tags: [design, motion, ux, performance]
source_file: docs/plans/2026-03-02-animations-micro-interactions-design.md (implementation plan: docs/plans/2026-03-02-animations-implementation.md)
source_date: 2026-03-02
language: nl
sources: []
---

# Animations and micro-interactions — Framer Motion polish pack (design)

## Summary

Marked *"Status: Goedgekeurd"*. The app *"voelt functioneel maar 'webby'"* — hard page cuts, instant state changes, spinners. The reference is the EA FC/FIFA companion app, and the FUT-style player cards just added are the starting point for *"animatie-'juice'"*. Framer Motion becomes the one animation library, with three spring presets, shared transition presets, a stagger helper, reduced-motion support, and a seven-step implementation order in which *"Elke stap levert een werkende staat op."*

## Key points

- Springs: `snappy` (buttons), `smooth` (pages, lists), `bouncy` (card reveals, drops).
- Player cards: reveal with scale, gold-card shimmer, rating counter, 3D flip after a skills save, glow on tier change.
- Lists stagger in (30 ms per item); skeletons replace spinners; sliding pill on the bottom tabs; spring physics on sheets.
- Micro-interactions on the availability toggle, score counters, form success and error, drag-and-drop targets.
- Performance: `will-change` hints, `layout` animations only where needed, `useReducedMotion`, lazy-load features not needed on first render.

## Requirements raised

- Native-app feel on a phone; respect `prefers-reduced-motion`.

## Decisions made

- [[2026-03-02-framer-motion-for-all-animation]]

## What was built

Built: `src/lib/animations.ts`, atoms `AnimatedList`, `Skeleton`, `NumberCounter`; the implementation plan's 13 tasks cover lists, navigation, availability toggle, drag-and-drop and page-level skeletons. The design's `AnimatedPage` and `ShimmerCard` atoms do not appear in the atom list in `CLAUDE.md` (12 atoms, neither named), so page transitions and the shimmer may have been folded elsewhere or dropped — unverified against the code on 2026-10-23.

## Open questions

- Were page transitions (`AnimatedPage`) and the gold shimmer shipped? → [[design-and-motion]]
