---
type: overview
title: teamplanner — project overview
created: 2026-10-23
updated: 2026-10-23
tags: [teamplanner, pwa, football, overview]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-02-26-coach-autopilot-roadmap]]", "[[2026-03-02-growth-seo-viral-design]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# teamplanner — project overview

## What we're building

**[[myteamplanner-nl]]**: a free, mobile-first PWA for coaches of amateur football teams — senior, youth and [[g-voetbal]] — that takes availability, lineups, match information, events and training planning out of the [[whatsapp]] group. Built and owned by [[yustin-troost]] as a side project, first used by his own teams at [[be-fair]].

The founding diagnosis ([[2026-02-xx-project-documentatie-v1]]): coaches *"op vrijdagavond nog niet weten wie er zaterdag kan spelen"*, lineups on beer mats, no overview of playing time, parents missing information. The ambition grew one week later into a *"digitale assistent-coach"* — automation and insight, not just coordination ([[2026-02-26-coach-autopilot-roadmap]]).

## Current phase

**MVP complete, growth features complete, V2 two-thirds built, Android app at phase 4 of 5.** First commit 2026-02-19; the MVP, library, skills, multi-team, sharing, animations, SEO content and landing page all landed by 2026-03-13; admin rights and hardening on 2026-03-12; automatic voetbal.nl sync on 2026-08-24; the season dashboard on 2026-09-16. Last web commit 2026-09-16. A Kotlin Android client, [[teamplanner-android]], was built in three days (2026-03-13 to 2026-03-15) as a one-to-one port and has not moved since; it lacks everything the web gained after that ([[web-android-parity]]). As of 2026-10-23 neither client has had user-facing work for five weeks. **25 teams in the database** on 2026-10-23 (a row count, not an activity measure), up from fewer than 10 in March ([[2026-10-23-open-questions-answered]]).

What is settled:

- Platform and stack: PWA, Supabase, Next.js, Atomic Design with Storybook as the component record ([[2026-02-19-pwa-over-native-app]], [[2026-02-19-supabase-as-the-backend]], [[design-and-motion]]).
- Decided on 2026-10-23: push per client with web first, statistics per season (August to July), Storybook as the design system with Figma dropped, the Android share image at the web's size ([[2026-10-23-open-questions-answered]]).
- Two clients, one brain: the web app is the source of truth, the Android app follows, the parity ledger records every gap and every allowed difference ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]]).
- Roadmap order: library → statistics → development → AI ([[2026-02-26-training-library-before-stats-before-ai]]); the first two are built.
- Growth first, free app, no ads or paywall until 100+ / 500+ teams ([[2026-03-02-growth-before-monetisation]]).
- Fair playing time as the G-voetbal differentiator, now visible on the team dashboard ([[statistics-and-fair-playing-time]]).

What is open:

- **Push notifications** — the one MVP must-have never built, designed in August ([[notifications]]).
- **Android phase 5 and parity** — push, Play Store, and the ported features the ledger lists ([[native-app]], [[web-android-parity]]).
- **The growth metric** — 25 team rows by a hand query; "active" is now defined ([[2026-10-23-active-team-definition]]) but not yet counted or tracked ([[growth-and-seo]]).
- **Roadmap phases 3 and 4**, the parent view, and the full list in [[open-questions]].

## Biggest risks

1. **Silence.** Without push the app depends on players remembering to open it; WhatsApp *"pusht"* ([[2026-08-24-v2-sync-push-stats-design]]).
2. **Growth read by hand.** From fewer than 10 to 25 team rows in seven months; the active count has a definition and no reading yet.
3. **Upstream dependency.** The daily sync reads voetbal.nl data with no agreement and no alerting ([[voetbal-nl-integration]]).
4. **Drift between two clients.** Every web feature is a second implementation in Kotlin; seven months of one-sided change already sit in [[web-android-parity]].
5. **Solo bus factor.** Every decision, and this brain, rests on one person; the brain exists so that the reasoning survives a long pause.

## How to read this brain

Start at `index.md`. Topic pages give one picture per area; decision pages give the why; source pages say what each document asked for and what was actually built. `wiki/notes/` is empty until the first question is filed.
