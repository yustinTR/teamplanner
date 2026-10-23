---
type: source
title: SEO — landing page improvements and feature pages (design)
created: 2026-10-23
updated: 2026-10-23
tags: [seo, growth, marketing, landing-page]
source_file: docs/plans/2026-02-26-seo-feature-pages-design.md
source_date: 2026-02-26
language: nl
sources: []
---

# SEO — landing page improvements and feature pages (design)

## Summary

The technical SEO basis was solid (metadata, structured data, OG images) but the sitemap held five pages and no content answered the searches coaches actually make — *"voetbal beschikbaarheid app"*, *"opstelling maker voetbal"*. The design adds a six-question FAQ with `FAQPage` schema and sharper H2s to the landing page, and four static feature pages under `/features/` that each target a keyword cluster. All server components, no database, no hooks.

## Key points

- FAQ answers double as positioning: *"Is MyTeamPlanner echt gratis? Ja, volledig gratis. Geen creditcard, geen verborgen kosten."* and *"Werkt het ook voor jeugdteams en G-teams? Ja, met aangepaste formaties (7v7), grote touch targets en oefeningen per niveau."*
- Feature pages: beschikbaarheid, opstellingen, wedstrijden, trainingen; same six-part structure (hero, "Herkenbaar?", solution, three steps, CTA, footer); sitemap priority 0.8.
- H2 rewrites put the keyword in the heading: *"De complete teamplanner voor amateurvoetbal"*.

## Requirements raised

- Every core feature has a crawlable page of its own with the keyword in H1 and body.

## Decisions made

None of its own; this is the first step of the strategy later written down in [[2026-03-02-growth-seo-viral-design]].

## What was built

Built as designed: `src/app/features/*`, `src/components/molecules/FaqSection/`, sitemap entries. The "free, no credit card" promise is now a public commitment the app is held to — see [[monetisation]].

## Open questions

- None recorded. Search-performance follow-up lives in [[growth-and-seo]].
