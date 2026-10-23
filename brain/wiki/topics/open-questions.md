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

- **Android phase 5** — push, icons, Play Store listing; the app itself exists with phases 1–4. → [[native-app]]
- **Android ports now owed** — onboarding, match-report sharing, share-image size, 3-4-3, sync settings, voetbal.nl import, season dashboard. → [[web-android-parity]]
- **`SYNC_ALERT_USER_IDS`** — set it in Vercel so the operator alert reaches Yustin. → [[voetbal-nl-integration]]
- **Real-device push check** — subscribe on a phone and trigger the reminder cron by hand. → [[notifications]]
- **Android push** on its own path, now that Web Push is live. → [[2026-10-23-push-per-client-web-first]]
- **Parent/carer read-only view, carpool, PDF export** — deferred on 2026-10-23, no date. → [[product-vision-and-roadmap]]
- **Roadmap phases 3 and 4** (player development, AI layer). → [[product-vision-and-roadmap]]
- **Sentry, Lighthouse CI** from the February monitoring plan. → [[vercel]]

## Undecided choices

- Android push mechanism. → [[notifications]]
- What could ever be paid for, given the public "volledig gratis" promise. → [[monetisation]]
- E-mail fallback for players who never install the PWA on iOS. → [[notifications]]
- iOS client: deferred until the Apple licence is worth it; no threshold. → [[native-app]]

## Missing information

- **Monthly active-team series** — first point taken ([[2026-10-23-active-team-count]]); no funnel numbers yet.
- **Why 20 teams never got a second member** — the adoption question the first count raised. → [[onboarding-and-conversion]] → [[growth-and-seo]], [[onboarding-and-conversion]]
- **User feedback.** Confirmed 2026-10-23: nothing written down yet, although feedback already shaped `show_ratings`. `raw/` is empty. → [[be-fair]]
- **Search performance** of the 15 articles and 4 feature pages. → [[growth-and-seo]]
- **VoetbalAssist licence** — probably behind a paywall the project has not paid for. → [[voetbal-nl-integration]]
- **Full delete of a player's data** — must be possible; whether it exists beyond `is_active = false` is unverified. → [[data-model-and-permissions]]

## Unsourced claims

All seven reasons that were only visible in git history were answered by Yustin on 2026-10-23 and are now sourced from [[2026-10-23-open-questions-answered]]: the domain, `html2canvas-pro` (not a deliberate choice), the removed fictional quotes, Expo → Kotlin, `show_ratings`, the EA FC skills, and the admin role. Nothing is left in this group.
