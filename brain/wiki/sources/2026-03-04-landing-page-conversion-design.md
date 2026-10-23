---
type: source
title: Landing page conversion optimisation (design)
created: 2026-10-23
updated: 2026-10-23
tags: [landing-page, conversion, growth, marketing]
source_file: docs/plans/2026-03-04-landing-page-conversion-design.md (implementation plan: docs/plans/2026-03-04-landing-page-conversion-implementation.md)
source_date: 2026-03-04
language: nl
sources: []
---

# Landing page conversion optimisation (design)

## Summary

Marked *"Status: Goedgekeurd"*. With fewer than ten active teams and a functionally complete app, *"de landing page converteert niet: geen productbeeld, geen social proof, geen urgentie"*, and since growth is *"Puur organisch (geen ads-budget)"*, every visitor must convert. The design rewrites the hero around an animated phone demo of the three-step flow (availability → lineup → share), adds a social-proof band with a live team counter and three coach quotes, gives feature cards mini-screenshots, and adds a sticky mobile CTA that appears when the hero button scrolls away.

## Key points

- H1: *"Nooit meer 'wie kan er zaterdag?' in de groepsapp"*. Trust strip: *"Gratis · Geen creditcard · Klaar in 30 seconden"*.
- Hero demo: pure visual component with hardcoded Dutch names, 5.5-second loop, static image under `prefers-reduced-motion`.
- Team counter reads the live `teams` count; below five teams it shows a generic line instead.
- Quotes: *"Initieel fictief maar realistisch. Later vervangen door echte quotes."* The three fictional quotes name a coach, a trainer and a G-team.

## Requirements raised

- Visitors must see the app working before registering.

## Decisions made

- [[2026-03-04-landing-page-shows-the-app]]

## What was built

Built as designed (`HeroDemo`, `SocialProof`, `StickyCta`, all wired in `src/app/page.tsx`), followed the same day by two corrections visible in git history: *"remove fake reviews, slow down animation, match app UI"* and *"replace real team name with fictional one in landing page"*. So the fictional-quotes compromise of the design was reversed within hours: `SocialProof` still accepts quotes, and whether the live page passes any is not verified here. The team counter is live.

## Open questions

- Are there real coach quotes now, and does the page show them? → [[onboarding-and-conversion]]
- Lighthouse work followed the same day (*"optimize landing page for Lighthouse scores"*, git history); no numbers are recorded.
