---
type: decision
title: Storybook is the design system; the Figma file is dropped
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, design call, 2026-10-23
supersedes: "the Figma structure in [[2026-02-xx-project-documentatie-v1]], section 6"
tags: [design, design-system, storybook, figma]
sources: ["[[2026-10-23-open-questions-answered]]", "[[2026-02-xx-project-documentatie-v1]]"]
---

# Storybook is the design system; the Figma file is dropped

## Decision

The component-based design lives in Storybook; `design/Teamplanner.fig` is historical and no longer maintained.

## Context

February planned a Figma file mirroring the Atomic Design levels one-to-one ([[2026-02-xx-project-documentatie-v1]]). In practice every component got a story and Storybook became the record ([[design-and-motion]]). Yustin: *"figma mag geschrapt worden het volledige design mag component based in storybook"*.

## Alternatives considered

- **Keep Figma as the design source and sync by hand.** Two sources of truth for a solo developer; already abandoned in practice.

## Consequences

- Storybook (83 stories) is the design reference for both clients; the Android app has no equivalent, so Android screens are checked against the web's stories ([[web-android-parity]]).
- `design/Teamplanner.fig` can be removed from the repository or left as an archive; either way it is not consulted.

## Where it lives in the code

- `src/components/**/*.stories.tsx`, `.storybook/`
