---
type: topic
title: Monetisation
created: 2026-10-23
updated: 2026-10-23
tags: [monetisation, strategy, commercials]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-02-26-coach-autopilot-roadmap]]", "[[2026-03-02-growth-seo-viral-design]]"]
---

# Monetisation

## Where we stand

The app is free, says so publicly, and has no billing code. The plan is phased by user base ([[2026-03-02-growth-before-monetisation]]): nothing now, subtle banner ads at 100+ teams, a freemium tier and store listings considered at 500+.

> [!warning] Contradiction
> [[2026-02-xx-project-documentatie-v1]] specifies three Stripe tiers — Gratis (1 team, 25 players), Pro €4,99/month (unlimited players, playing-time tracker, statistics, season export), Club €14,99/month (all teams of a club, admin dashboard, parent view, branding) — with RLS gating paid features.
> [[2026-02-26-coach-autopilot-roadmap]] says *"Nog niet bepaald"*, and [[2026-03-02-growth-seo-viral-design]] replaces the tiers with the ad-first phasing.
> The later documents win; the tiers were never built. Note that two of the Pro features (playing-time tracker, statistics) have since shipped free, and the FAQ promises *"volledig gratis … geen verborgen kosten"* ([[2026-02-26-seo-feature-pages-design]]).

## Requirements

- Keep the MVP free; the public promise constrains any later tier.
- *"Architectuur wordt zo gebouwd dat het later makkelijk is om features achter een paywall te zetten"* (roadmap) — an intention, not a built mechanism.

## Decisions

- [[2026-03-02-growth-before-monetisation]]

## Risks and tensions

- **What is left to charge for?** Statistics and playing time, the February Pro features, are free now. The only named premium candidate is the AI layer (roadmap phase 4), which does not exist. A Club licence (many teams, branding, parent view) is the most plausible paid product that is not yet promised free.
- **Ads on a youth and G-voetbal app** carry a reputational question nobody has written down (unsourced).
- **Ads are further away than the 100-team phase suggests.** Yustin on 2026-10-23: *"ads komen pas als alles 100% up en running is en het veel meer gebruikers heeft"* ([[2026-10-23-open-questions-answered]]) — completeness (push, Android parity) is a precondition, not only the team count. With 25 active teams the question is not near.
- **Costs are near zero** (Vercel Hobby, Supabase Free; [[2026-02-xx-project-documentatie-v1]] section 14), so there is no pressure to decide. The pressure arrives with the tier limits.

## Open questions

- At what team count do Supabase and Vercel free tiers run out, and is that the real monetisation trigger?
- What does "100% up and running" include before ads are considered?
- Ads or no ads for an audience that includes children and G-players?
