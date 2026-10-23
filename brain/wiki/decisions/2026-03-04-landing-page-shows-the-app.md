---
type: decision
title: The landing page sells by showing the app, with only real social proof
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product call, 2026-03-04 ("Goedgekeurd"), corrected the same day
supersedes: ""
tags: [landing-page, conversion, marketing]
sources: ["[[2026-03-04-landing-page-conversion-design]]"]
---

# The landing page sells by showing the app, with only real social proof

## Decision

The hero is an animated demo of the three-step flow in a phone frame, the social-proof band shows a live team count, and fictional quotes are not used.

## Context

Fewer than ten teams, no ad budget, and a landing page with *"geen productbeeld, geen social proof, geen urgentie"* ([[2026-03-04-landing-page-conversion-design]]). The design approved three fictional coach quotes *"Initieel fictief maar realistisch"*. Git history of the same day shows the developer reversing that part: *"remove fake reviews"* and *"replace real team name with fictional one"* — made-up reviews out, and a real club's name out of the demo content.

## Alternatives considered

- **Static screenshots instead of the animated demo.** Cheaper, but the whole point was that visitors *"de app zien en voelen"*. The static image survives only as the reduced-motion fallback.
- **Fictional quotes until real ones exist.** Approved, then dropped within hours. The brain records the drop as the decision; the reasoning (honesty, or legal exposure) is not written down (unsourced).

## Consequences

- Social proof rests on the live counter and whatever real quotes are added later; the component still accepts quotes.
- The hero demo's hardcoded names are fictional by rule; real team names do not appear in marketing content.
- The same-day Lighthouse work (git history) means the demo must stay cheap on first paint.

## Where it lives in the code

- `src/app/page.tsx`
- `src/components/molecules/HeroDemo/`, `SocialProof/`, `StickyCta/`
