# Index

Catalog of every page in the wiki for the `teamplanner` project. Read this
first when answering a question, then drill into the pages it points at.
Updated on every ingest.

**Status: initial ingest complete (2026-10-23).** All fifteen existing sources
have been read — the February 2026 project document, the eleven design
documents in `docs/plans/`, and the three Android design documents in
`../teamplanner-android/docs/plans/` (implementation plans are covered on their
design's source page), plus the 2026-10-23 working session in which Yustin
answered the open questions. `raw/` is empty. 63 pages.

Start with [[overview]]. The fastest route to what is still unresolved is
[[open-questions]]; the fastest route to what was planned versus what exists
in the repository is the `## What was built` section of each source page; the
fastest route to what the Android app lacks is [[web-android-parity]].

## Overview

- [[overview]] — project state of play: what the app is, what is settled, what is open, the biggest risks

## Decisions

_newest first, status shown_

- [[2026-10-25-active-team-means-coach-use]] — Active = coach use in the last 60 days (match, event or lineup edit); linked members are a separate adoption number, coach-only is a valid mode. · **accepted**
- [[2026-10-23-active-team-definition]] — Active = activity in 60 days and two or more linked players. · **superseded**
- [[2026-10-23-storybook-is-the-design-system-figma-dropped]] — Storybook is the design system; `design/Teamplanner.fig` is historical. · **accepted**
- [[2026-10-23-statistics-per-season-august-to-july]] — Statistics grouped per season, August to July; a season filter on the dashboard, web first. · **accepted**
- [[2026-10-23-push-per-client-web-first]] — Web Push and Android push on separate paths so the clients can evolve apart; web first; the three triggers are shared. · **accepted**
- [[2026-10-23-android-share-image-matches-the-web-card]] — Android renders the lineup image at the web's 1080×1350; the 540×810 Canvas is a gap. · **accepted** (delegated)
- [[2026-10-23-web-is-the-source-of-truth-for-both-clients]] — One brain for both repositories; the web app defines behaviour, copy and data, Android follows; every allowed difference is written down. · **accepted**
- [[2026-08-24-web-push-via-service-worker]] — Web Push through the Serwist service worker, three triggers, no preferences or e-mail fallback; built 2026-10-23. · **accepted**
- [[2026-08-24-daily-cron-sync-reuses-the-parser]] — Daily Vercel Cron with a service-role client reuses the voetbal.nl parser and the manual import's upsert logic; manual scores are never overwritten. · **accepted**
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]] — The native client is a Kotlin + Compose one-to-one port of the web app on the same backend, Android only. · **accepted**
- [[2026-03-13-native-app-as-separate-expo-repo]] — A React Native + Expo app in a separate repository; superseded the same day by the Kotlin build. · **superseded**
- [[2026-03-12-admins-share-coach-rights]] — A coach can flag players as admin; admins get the creator's permissions through `is_team_admin()`. · **accepted**
- [[2026-03-04-landing-page-shows-the-app]] — Animated hero demo, live team counter, no fictional quotes. · **accepted**
- [[2026-03-02-share-images-from-hidden-components]] — Lineup and report PNGs rendered from hidden fixed-size components, Web Share API, `myteamplanner.nl` footer. · **accepted**
- [[2026-03-02-players-table-as-team-membership]] — No membership table: creator plus `players.user_id`; full refresh on team switch. · **accepted**
- [[2026-03-02-growth-before-monetisation]] — Free app, no ads or paywall until 100+ / 500+ teams; supersedes the February Stripe tiers. · **accepted**
- [[2026-03-02-framer-motion-for-all-animation]] — One animation library with shared spring presets and reduced-motion support. · **accepted**
- [[2026-02-26-onboarding-state-in-localstorage]] — Dismissed hints and checklist in `localStorage`, progress from existing data, no migration. · **accepted**
- [[2026-02-26-skills-as-jsonb-without-history]] — Ten skill scores in one JSONB column, overwritten by the coach, no history. · **accepted**
- [[2026-02-26-training-library-before-stats-before-ai]] — Roadmap order driven by data dependencies: library, statistics, development, AI. · **accepted**
- [[2026-02-19-supabase-as-the-backend]] — Auth, database, realtime and storage from Supabase; no custom backend, auth or GraphQL. · **accepted**
- [[2026-02-19-pwa-over-native-app]] — Mobile-first PWA installed from a link, not an app-store app. · **accepted**

## Topics

- [[data-model-and-permissions]] — why membership is `players`, coach means creator-or-admin, JSONB where it is, derived statistics, service role for cron
- [[design-and-motion]] — Atomic Design with Storybook as the record, EA FC feel, Framer Motion, share cards, the Figma question
- [[growth-and-seo]] — organic-only growth: 15 articles, feature pages, viral invite and share loop; the unmeasured active-team count
- [[monetisation]] — free and publicly promised so; February's Stripe tiers superseded by ad-then-freemium phasing; what is left to charge for
- [[native-app]] — the Kotlin Android app: phases 1–4 built in March, phase 5 (push, Play Store) open; iOS stays PWA
- [[notifications]] — Web Push live since 2026-10-23 with three triggers and a sync-failure alert; Android push open
- [[onboarding-and-conversion]] — landing page, coach checklist and hints, WhatsApp invite flow; no funnel numbers recorded
- [[open-questions]] — planned-not-built, undecided choices, missing information; the unsourced-claims group is now empty
- [[product-vision-and-roadmap]] — coordination tool → assistant coach; roadmap phases and their state
- [[statistics-and-fair-playing-time]] — match stats, derived minutes, season dashboard; fairness for G-voetbal
- [[training-content]] — exercise library and plans; AI-generated seeds, review and provenance unrecorded
- [[voetbal-nl-integration]] — one-time import plus daily sync; rules, upstream risk, no alerting
- [[web-android-parity]] — the ledger connecting both clients: feature state on web and Android, gaps owed, allowed differences and why

## Entities

- [[be-fair]] — the developer's club and beta team (G-team 7v7 and a senior side)
- [[g-voetbal]] — football for players with a disability; the segment behind fair playing time and accessibility
- [[knvb-rinus]] — the KNVB training platform the exercise library positions against
- [[myteamplanner-nl]] — the public name and domain; brand footer on every share image
- [[supabase]] — the whole backend; RLS as authorisation
- [[teamplanner-android]] — the Kotlin + Compose client in `../teamplanner-android` (GitHub `yustinTR/teamplanner-android`), one-to-one port, phase 4 of 5
- [[vercel]] — hosting, previews, the daily cron; no Sentry or Lighthouse CI
- [[voetbal-nl]] — fixture and results data via the VoetbalAssist API; no agreement
- [[whatsapp]] — the incumbent, the viral channel, and the thing that pushes
- [[yustin-troost]] — owner, developer, first user

## Sources

- [[2026-02-xx-project-documentatie-v1]] — the February 2026 founding document: vision, MVP and V2, stack, Figma plan, Stripe tiers, phasing, hosting
- [[2026-02-26-coach-autopilot-roadmap]] — "autopilot for amateur coaches": library, statistics, development, AI; monetisation postponed
- [[2026-02-26-onboarding-checklist-hints-design]] — four-step dashboard checklist and four inline hints, localStorage only
- [[2026-02-26-player-skills-profile-design]] — ten skills in JSONB, radar chart, coach-only editor, no history
- [[2026-02-26-seo-feature-pages-design]] — FAQ with schema, sharper H2s, four feature pages; the "volledig gratis" promise
- [[2026-03-02-animations-micro-interactions-design]] — Framer Motion polish pack with presets and a seven-step order
- [[2026-03-02-growth-seo-viral-design]] — the growth strategy: <10 teams, SEO quick wins, viral loop, ads at 100+, freemium at 500+
- [[2026-03-02-multi-team-support-design]] — team switcher, full refresh, no schema change
- [[2026-03-02-share-and-match-improvements-design]] — match tabs, score editing, lineup and report images
- [[2026-03-04-landing-page-conversion-design]] — hero demo, social proof, sticky CTA; fictional quotes approved then removed
- [[2026-03-13-android-phase2-core-screens-design]] — Android read-only screens plus availability and attendance; radar on the EA FC model; single-team context
- [[2026-03-13-android-phase3-interaction-design]] — Android coach writes: match, player, event CRUD, photos, stats grid, admin-aware `isCoach`
- [[2026-03-13-android-phase4-complex-features-design]] — Android lineup editor, substitutions, 540×810 share image, team settings; no voetbal.nl import
- [[2026-03-13-seo-blog-native-app-design]] — six more articles (built) and the Expo app (built as Kotlin instead)
- [[2026-08-24-v2-sync-push-stats-design]] — V2: daily sync (built), Web Push (not built), season dashboard (built)
- [[2026-10-23-open-questions-answered]] — working session: Yustin's verbatim answers to all 23 open questions in two messages; seven reasons sourced, four decisions, 25 team rows

## Notes

- [[2026-10-25-active-team-recount]] — 11 active teams of 23 under the corrected definition, nine coach-only, five with recent lineup edits
- [[2026-10-23-active-team-count]] — first reading under the superseded definition: 2 of 22; its adoption conclusion is withdrawn
- [[2026-10-23-android-emulator-test-setup]] — toolchain, AVD, test account and test team for running the Android app from this machine; what the first run found
