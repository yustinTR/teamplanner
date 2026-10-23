---
type: topic
title: Design and motion
created: 2026-10-23
updated: 2026-10-23
tags: [design, design-system, motion, figma, storybook]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-03-02-animations-micro-interactions-design]]", "[[2026-03-04-landing-page-conversion-design]]"]
---

# Design and motion

## Where we stand

The rules of the design system are in the code and its docs (`CONVENTIONS.md`, `CLAUDE.md`, `src/styles/tokens.css`); this page records what they rest on.

- **Atomic Design** was chosen in February for *"consistentie, herbruikbaarheid en schaalbaarheid"* and so that a Figma file could mirror the code one-to-one with a strict naming convention ([[2026-02-xx-project-documentatie-v1]], sections 5–6). The Figma file exists (`design/Teamplanner.fig`) but no later source references it; **Storybook became the design documentation** — 83 stories, every component required to have one (`CLAUDE.md`). Whether the Figma file is maintained is unsourced.
- **Mobile-first at 375 px, 44 px touch targets, Dutch UI, English code** — `CONVENTIONS.md`.
- **shadcn/ui as a starting point, not a drop-in** (`PROJECT_CONTEXT.md`); Tailwind v4 tokens as CSS custom properties, no `tailwind.config.ts`.
- **The feel is the EA FC companion app**: FUT-style player cards with bronze/silver/gold tiers, and the Framer Motion polish pack that followed them ([[2026-03-02-framer-motion-for-all-animation]]). Reduced motion is honoured everywhere, including the hero demo ([[2026-03-04-landing-page-conversion-design]]).
- **Share cards** are a second visual surface, dark, portrait, branded ([[2026-03-02-share-images-from-hidden-components]]).

## Requirements

- Every component has a story; stories run as tests in a browser (`CLAUDE.md`).
- Accessibility for [[g-voetbal]] players and carers: large targets, clear labels, reduced motion.

## Decisions

- [[2026-03-02-framer-motion-for-all-animation]]
- [[2026-03-02-share-images-from-hidden-components]]
- [[2026-03-04-landing-page-shows-the-app]]

## Risks and tensions

- **Game aesthetics versus amateur reality.** Gold cards and ratings motivate some players and expose others; `show_ratings` (2026-03-06) is the escape hatch. See [[statistics-and-fair-playing-time]].
- **Two sources of design truth** if the Figma file is still edited; if it is not, it should be declared historical.
- The animation design's `AnimatedPage` and `ShimmerCard` atoms are not in the current atom list; unverified whether page transitions and the shimmer shipped ([[2026-03-02-animations-micro-interactions-design]]).

## Open questions

- Is `design/Teamplanner.fig` current, historical, or abandoned?
- Did page transitions and the gold shimmer ship?
