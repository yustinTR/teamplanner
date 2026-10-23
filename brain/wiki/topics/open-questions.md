---
type: topic
title: Open questions and gaps
created: 2026-10-23
updated: 2026-10-23
tags: [risk, gaps, actions]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Open questions and gaps

A single place for things nobody owns. Grouped by **planned but not built**, **undecided choices**, **missing information**, and **unsourced claims the brain had to make**. Everything here is linked from the topic page that cares about it.

## Planned but not built

- **Push notifications** — MVP "Must" in February, designed in August, not built. → [[notifications]]
- **Android phase 5** — push, icons, Play Store listing; the app itself exists with phases 1–4. → [[native-app]]
- **Android ports of web features since 2026-03-15** — 3-4-3, season dashboard, sync settings, and the undecided rows. → [[web-android-parity]]
- **Parent/carer read-only view** — V2 "Should" in February; silent since. → [[product-vision-and-roadmap]]
- **Carpool coordination, PDF export** — V2 "Could" in February; silent since.
- **Roadmap phases 3 and 4** (player development, AI layer). → [[product-vision-and-roadmap]]
- **Sentry, Lighthouse CI** from the February monitoring plan. → [[vercel]]

## Undecided choices

- Push: Web Push, Android FCM, or one sender for both. → [[notifications]]
- Undecided parity rows: share-image size, onboarding on Android, match-report sharing on Android, voetbal.nl import on Android. → [[web-android-parity]]
- What could ever be paid for, given the public "volledig gratis" promise. → [[monetisation]]
- Ads on an app used by children and G-players. → [[monetisation]]
- E-mail fallback for players who never install the PWA on iOS. → [[notifications]]
- Season boundaries in statistics. → [[statistics-and-fair-playing-time]]

## Missing information

- **Active team count and funnel numbers.** The thresholds in the growth plan (100, 500) are unmeasured in any source. → [[growth-and-seo]], [[onboarding-and-conversion]]
- **User feedback.** Nothing from the beta team or any other coach is written down; `raw/` is empty. → [[be-fair]]
- **Search performance** of the 15 articles and 4 feature pages. → [[growth-and-seo]]
- **Review of the seeded exercises** and their provenance. → [[training-content]]
- **Status of the Figma file.** → [[design-and-motion]]
- **Terms of use** of voetbal.nl / VoetbalAssist data; monitoring of the daily sync. → [[voetbal-nl-integration]]
- **Data retention** for players and inactive teams. → [[data-model-and-permissions]]

## Unsourced claims

Things the brain states from git history or the code because no document records the reasoning:

- Why `myteamplanner.nl` instead of `teamplanner.nl`. → [[myteamplanner-nl]]
- Why `html2canvas-pro` instead of `html2canvas`. → [[2026-03-02-share-images-from-hidden-components]]
- Why fictional quotes were removed on 2026-03-04. → [[2026-03-04-landing-page-shows-the-app]]
- Why the Expo plan became a Kotlin app the same day. → [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]
- Why `show_ratings` exists. → [[statistics-and-fair-playing-time]]
- Admin rights: recorded from the migration comment only. → [[2026-03-12-admins-share-coach-rights]]

Each of these is a one-line answer from [[yustin-troost]] away from becoming a sourced fact; file the answer as a `wiki/notes/` page.
