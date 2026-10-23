---
type: decision
title: Growth before monetisation; the app stays free
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product call, 2026-02-26 (postponed) and 2026-03-02 (phased)
supersedes: "the Gratis / Pro / Club tiers in [[2026-02-xx-project-documentatie-v1]]"
tags: [monetisation, growth, strategy]
sources: ["[[2026-02-26-coach-autopilot-roadmap]]", "[[2026-03-02-growth-seo-viral-design]]", "[[2026-02-26-seo-feature-pages-design]]"]
---

# Growth before monetisation; the app stays free

## Decision

No paywall and no ads until the user base is large enough: growth only now, subtle banner ads at 100+ teams, a freemium tier and store listings considered at 500+ teams.

## Context

The February document planned Stripe tiers from the start — Gratis, Pro €4,99, Club €14,99 ([[2026-02-xx-project-documentatie-v1]]). With fewer than ten active teams a week after launch, the roadmap postponed the question: *"Nog niet bepaald — focus nu op gebruikersbasis opbouwen"* ([[2026-02-26-coach-autopilot-roadmap]]). The growth design then wrote down the three phases and the ad-based route ([[2026-03-02-growth-seo-viral-design]]). In between, the landing page publicly promised *"volledig gratis. Geen creditcard, geen verborgen kosten"* ([[2026-02-26-seo-feature-pages-design]]).

## Alternatives considered

- **Stripe tiers from day one** (the February plan). Nothing to gate with ten teams, and a paywall at the first impression kills the coach-converts-team loop.
- **Freemium immediately with AI as the premium feature.** The AI layer does not exist; the roadmap keeps it as the only candidate premium feature.

## Consequences

- The free promise is now on the landing page and in the FAQ; any future tier must leave the MVP features free or break a public commitment.
- The target metric is active teams, but no source records how it is measured. See [[growth-and-seo]].
- *"Architectuur wordt zo gebouwd dat het later makkelijk is om features achter een paywall te zetten"* (roadmap) — no gating code exists, so the claim is untested (unsourced).

## Where it lives in the code

- Nothing to gate: no subscription table, no Stripe, no ads. The absence is the implementation.
- The public promise: `src/components/molecules/FaqSection/` content in `src/app/page.tsx`
