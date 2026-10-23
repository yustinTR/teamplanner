---
type: source
title: TeamPlanner project documentatie v1.0 (February 2026)
created: 2026-10-23
updated: 2026-10-23
tags: [vision, scope, stack, monetisation, design-system, planning]
source_file: docs/teamplanner-project-documentatie.docx
source_date: 2026-02
language: nl
sources: []
---

# TeamPlanner project documentatie v1.0 (February 2026)

## Summary

The founding document, written by [[yustin-troost]] in February 2026 before the first commit (2026-02-19). Fourteen sections: vision, audience, MVP and V2 feature lists, stack, Atomic Design system, a Figma structure that maps one-to-one to code, a component library, database schema, routes, design tokens, a six-week phasing, a Claude Code working method, a three-tier monetisation strategy and hosting costs. It is the baseline against which every later decision is measured: much of it was built as written, some of it (push notifications, Stripe tiers, Figma as design source, Sentry, Lighthouse CI) never was, and some of it was reversed within weeks.

## Key points

- **Tagline**: *"De simpelste manier om je voetbalteam te managen"*. Type: mobile-first PWA, because *"95% van de gebruikers (spelers, ouders, coaches) de app op hun telefoon zullen gebruiken — op het veld, in de kleedkamer, of onderweg"*.
- **The problem**: amateur clubs run teams through *"WhatsApp-groepen, Excel-lijsten, en papieren opstellingen"*, so coaches *"op vrijdagavond nog niet weten wie er zaterdag kan spelen"*. For [[g-voetbal]] fair playing time and individual needs make a central tool *"extra belangrijk"*.
- **Audience**: coaches and trainers of senior, youth and G-teams; team managers; players; parents and carers of youth and G-players.
- **MVP, all "Must"**: team management with invite links, player profiles, match schedule, availability (ja/nee/misschien), availability grid, drag-and-drop lineup maker, **push notifications**, PWA install.
- **V2**: match reports, playing-time tracker, statistics, season overview, parent/carer view, carpool coordination, multi-team support, PDF export.
- **Stack with motivation**: Next.js 14+ App Router, TypeScript, Tailwind (*"+ NativeWind"*), shadcn/ui, Zustand + React Query, Supabase (*"Auth, Realtime, RLS, gratis tier"*), dnd-kit (*"Toegankelijk, performant, touch support"*), next-pwa/Serwist, Vercel, Web Push API + Supabase.
- **Atomic Design** after Brad Frost, with a Figma file whose pages mirror the levels (`atom/button`, `molecule/player-chip`…) and a strict naming convention *"om sync met code te garanderen"*.
- **Monetisation**: Gratis (1 team, 25 players) · Pro €4,99/month (unlimited players, playing-time tracker, statistics, season export) · Club €14,99/month (all teams of a club, admin dashboard, parent view, branding). Stripe Checkout as a Next.js route, RLS checking the subscription. *"€5 per maand is minder dan een biertje na de training."*
- **Phasing**: six weeks, Fase 0 (setup, design system) to Fase 4 (PWA, push, offline, Lighthouse 90+, *"Beta test met eigen team (Befair G-voetbal)"*, launch).
- **Hosting**: Vercel Hobby, Supabase Free, Stripe pay-as-you-go, domain `teamplanner.nl` (~€10/year). Monitoring: Vercel Analytics, Supabase dashboard, Sentry free tier, Lighthouse CI.
- **Working method**: keep `CONVENTIONS.md` and `PROJECT_CONTEXT.md` in the repo so Claude Code stays consistent; build per Atomic level, small to large.

## Requirements raised

- Availability in one tap, a coach-side grid, realtime updates.
- Lineup maker with formation templates, touch-optimised drag and drop.
- Push reminders for availability and matches (**unbuilt**, see [[notifications]]).
- Offline basics and homescreen install.
- Fair playing-time overview for G-teams (now the fairness chart, see [[statistics-and-fair-playing-time]]).
- A read-only parent/carer view (V2, **unbuilt**, see [[open-questions]]).

## Decisions made

- [[2026-02-19-pwa-over-native-app]]
- [[2026-02-19-supabase-as-the-backend]]
- Monetisation tiers — **superseded** by [[2026-03-02-growth-before-monetisation]].

## What was built

Checked against the repository on 2026-10-23:

- The MVP list was built except **push notifications**. Playing time, statistics, season overview and multi-team from the V2 list were also built by 2026-09-16. Parent view, carpool and PDF export were not.
- The domain became **myteamplanner.nl**, not `teamplanner.nl` (see [[myteamplanner-nl]]); the reason is not recorded (unsourced).
- NativeWind never entered the web stack; it reappears in the native-app plan ([[2026-03-13-seo-blog-native-app-design]]).
- Figma: the file `design/Teamplanner.fig` exists in the repository, but no later source refers to it, and Storybook (83 stories by 2026-09) became the de-facto component documentation instead. See [[design-and-motion]].
- Sentry and Lighthouse CI were not set up; CI runs lint, build, unit, hook and coverage jobs (`.github/workflows/ci.yml`) and e2e on `main` (`e2e.yml`).
- Stripe and the tiers were never built; see [[monetisation]].
- The six-week plan held roughly: first commit 2026-02-19, *"complete MVP with all phases, test suite, and CI"* committed the same day per git history, growth features through March.

## Open questions

- Was the parent/carer view dropped or merely deferred? No later source mentions it. → [[open-questions]]
- The docx says Supabase Edge Functions for push; the August 2026 design moves push to Next.js routes. Neither exists. → [[notifications]]
