---
type: source
title: Growth strategy — SEO, viral loop, content marketing (design)
created: 2026-10-23
updated: 2026-10-23
tags: [growth, seo, viral, monetisation, marketing]
source_file: docs/plans/2026-03-02-growth-seo-viral-design.md (implementation plan: docs/plans/2026-03-02-growth-seo-implementation.md)
source_date: 2026-03-02
language: en
sources: []
---

# Growth strategy — SEO, viral loop, content marketing (design)

## Summary

The one-page growth strategy. Starting point: *"TeamPlanner has <10 active teams."* Goal: *"grow to 100+ teams to enable ad-based monetization (banner ads via Google AdSense)."* Three sections — SEO quick wins, a viral loop through shared content and the invite link, and content marketing later — ranked in a table by effort and impact. It also fixes the monetisation roadmap in three phases and lists what *not* to build: no ads infrastructure, no freemium paywall, no App Store, no complex analytics.

## Key points

- **Monetisation roadmap**: Phase 1 (now) growth only; Phase 2 (100+ teams) subtle banner ads on non-critical pages; Phase 3 (500+ teams) Play Store listing, *"consider freemium tier, evaluate App Store"*.
- **Viral loop**: every shared image carries a visible *"myteamplanner.nl"* watermark; the `/join/[code]` page gets OG tags with the team name because WhatsApp *"is the #1 viral channel for amateur football"*; the join screen shows *"Coach Willem nodigt je uit voor Be Fair 5"* instead of a generic form.
- **Play Store via PWABuilder/TWA** ($25 one-time) deferred until budget allows; App Store waits for revenue to cover $99/year.
- **Blog** with 5–10 articles on long-tail Dutch keywords, each linking to a feature page and a registration CTA.
- Google Search Console setup needs an account, outside the codebase.

## Requirements raised

- Shared images and invite previews must sell the app to people who have never seen it.

## Decisions made

- [[2026-03-02-growth-before-monetisation]]

## What was built

The "Now" items shipped on 2026-03-02 (FAQ schema, performance hints, internal links, OG invite preview, redesigned invite flow). The blog followed the same day with 6 articles and grew to 15 by 2026-04-10 ([[2026-03-13-seo-blog-native-app-design]]). Google Tag Manager and Search Console fixes landed on 2026-03-09 (git history). The Play Store route was later replaced by a plan for a full native app ([[2026-03-13-native-app-as-separate-expo-repo]]). No ads exist as of 2026-10-23, consistent with the plan.

## Open questions

- How many active teams are there now, and has the 100-team threshold for phase 2 been reached? The landing page counts `teams` rows live (`SocialProof`), but active teams are not measured anywhere in the brain. → [[growth-and-seo]]
- The contradiction with the February Stripe tiers is recorded in [[monetisation]].
