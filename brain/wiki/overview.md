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

**MVP complete, growth features complete, V2 two-thirds built, Android app at phase 4 of 5.** First commit 2026-02-19; the MVP, library, skills, multi-team, sharing, animations, SEO content and landing page all landed by 2026-03-13; admin rights and hardening on 2026-03-12; automatic voetbal.nl sync on 2026-08-24; the season dashboard on 2026-09-16. Last web commit 2026-09-16. The Kotlin Android client, [[teamplanner-android]], built in March, was brought to parity with the web on 2026-10-23 (everything but push; compiled, not yet run on a device) ([[web-android-parity]]). As of 2026-10-23 neither client has had user-facing work for five weeks. **22 teams in the database, 2 of them active** on 2026-10-23 ([[2026-10-23-active-team-count]]); 20 teams never got a second member with an account. Web Push, statistics per season and the sync-failure alert shipped the same day and went to production that afternoon, together with the discovery that production had shipped no service worker since the Next 16 upgrade ([[notifications]]).

What is settled:

- Platform and stack: PWA, Supabase, Next.js, Atomic Design with Storybook as the component record ([[2026-02-19-pwa-over-native-app]], [[2026-02-19-supabase-as-the-backend]], [[design-and-motion]]).
- Built on 2026-10-23: Web Push with three triggers, statistics per season with a selector, sync-failure alerts ([[2026-08-24-web-push-via-service-worker]], [[2026-10-23-statistics-per-season-august-to-july]]).
- Decided on 2026-10-23: push per client with web first, statistics per season (August to July), Storybook as the design system with Figma dropped, the Android share image at the web's size ([[2026-10-23-open-questions-answered]]).
- The Android ports of 2026-10-23 are in `teamplanner-android` with their design document; the parity ledger shows no feature gap but push.
- Two clients, one brain: the web app is the source of truth, the Android app follows, the parity ledger records every gap and every allowed difference ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]]).
- Roadmap order: library → statistics → development → AI ([[2026-02-26-training-library-before-stats-before-ai]]); the first two are built.
- Growth first, free app, no ads or paywall until 100+ / 500+ teams ([[2026-03-02-growth-before-monetisation]]).
- Fair playing time as the G-voetbal differentiator, now visible on the team dashboard ([[statistics-and-fair-playing-time]]).

What is open:

- **Adoption.** Ten teams have a live schedule; on eight of them nobody but the coach has an account. Push, now built, only reaches the two others ([[notifications]], [[onboarding-and-conversion]]).
- **Android phase 5** — push and the Play Store listing, blocked on Firebase and Play Console accounts ([[native-app]]).
- **The growth metric** — defined and counted once ([[2026-10-23-active-team-count]]); a monthly series starts now ([[growth-and-seo]]).
- **Roadmap phases 3 and 4**, the parent view, and the full list in [[open-questions]].

## Biggest risks

1. **Adoption.** Two active teams in 22. The invite step is where teams stall; everything downstream, push included, waits on it.
2. **Growth read by hand.** Twenty-two team rows, two active; the series has one point.
3. **Upstream dependency.** The daily sync reads voetbal.nl data with no agreement and no alerting ([[voetbal-nl-integration]]).
4. **Drift between two clients.** Every web feature is a second implementation in Kotlin; the ledger is level today and will drift again with the next web feature unless it is kept ([[web-android-parity]]).
5. **Solo bus factor.** Every decision, and this brain, rests on one person; the brain exists so that the reasoning survives a long pause.

## How to read this brain

Start at `index.md`. Topic pages give one picture per area; decision pages give the why; source pages say what each document asked for and what was actually built. `wiki/notes/` is empty until the first question is filed.
