---
type: topic
title: Product vision and roadmap
created: 2026-10-23
updated: 2026-10-23
tags: [vision, roadmap, scope]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-02-26-coach-autopilot-roadmap]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Product vision and roadmap

## Where we stand

Two statements of vision exist and they stack rather than conflict. February: *"De simpelste manier om je voetbalteam te managen"* — a coordination tool replacing [[whatsapp]] ([[2026-02-xx-project-documentatie-v1]]). One week later: a *"digitale assistent-coach"* whose promise is automation and insight, *"WhatsApp kan alleen berichten sturen — TeamPlanner denkt mee"* ([[2026-02-26-coach-autopilot-roadmap]]). The August V2 design executes that second vision: the app keeps itself current (sync), pulls people back (push), and shows what was in the coach's head (dashboard) ([[2026-08-24-v2-sync-push-stats-design]]).

Built by 2026-10-23, in order: MVP (2026-02-19), training library and skills (2026-02-26), multi-team, sharing, animations, growth SEO (2026-03-02), landing page (2026-03-04), admin rights and hardening (2026-03-12), blog growth (2026-03-13, 2026-04-10), 3-4-3 formation (2026-04-23), automatic sync (2026-08-24), season dashboard and sync visibility (2026-09-16). See `PROJECT_CONTEXT.md` for the feature list.

Roadmap status against [[2026-02-26-training-library-before-stats-before-ai]]:

| Phase | State |
|---|---|
| 1 Training library | Built 2026-02-26 |
| 2 Player statistics | Built: stats 2026-02-26, dashboard 2026-09-16 |
| 3 Player development | Not designed; skills radar is a partial answer without history |
| 4 AI layer | Not started; depends on 1–3 and half a season of data |

Planned and not built: push notifications ([[notifications]]); the parent/carer view, carpool and PDF export are **deferred, not dropped** (*"uitgesteld"*, [[2026-10-23-open-questions-answered]]). The Android app exists with phases 1–4 and lags the web since 2026-03-15 ([[native-app]], [[web-android-parity]]).

### Autumn 2026 plan

Set on 2026-10-25 ([[2026-10-25-roadmap-coach-first-autumn-2026]]), after the recount showed the single coach as the dominant user:

| When | What | Why |
|---|---|---|
| now – mid Nov | "Gemaakt met MyTeamPlanner" strip on share images (both clients), share the substitution plan, share from the match list | the shared picture is the working acquisition channel |
| parallel | funnel events in GTM; crash visibility via Play vitals and Vercel | stop reading the key metric by hand |
| November | Android: verify and close the five unverified ledger rows; closed-test release 5 | parity debt, first content release after launch |
| late Nov – Dec | PDF export; read-only parent/carer view by link | coach-alone conveniences; low-friction answer to "do they want members?" |
| mid Nov review | Search Console re-read, tester count, funnel numbers | decide on content and on the invite flow with data |
| not now | phases 3–4, carpool, new articles, chasing Play production | need a crowd or a measurement first |

## Requirements

- Coach creates a match in 30 seconds; player answers availability in 5 seconds; load under 2 seconds; offline basics (`PROJECT_CONTEXT.md` design principles).
- Everything mobile-first at 375 px; G-voetbal usable ([[g-voetbal]]).
- *"Geen features buiten MVP scope zonder expliciete vraag"* (`CLAUDE.md`) — the roadmap is the explicit ask.

## Decisions

- [[2026-02-19-pwa-over-native-app]], [[2026-02-19-supabase-as-the-backend]]
- [[2026-10-23-push-per-client-web-first]], [[2026-10-23-statistics-per-season-august-to-july]], [[2026-10-23-storybook-is-the-design-system-figma-dropped]]
- [[2026-02-26-training-library-before-stats-before-ai]], [[2026-10-25-roadmap-coach-first-autumn-2026]], [[2026-10-25-made-with-strip-on-share-images]]
- [[2026-03-02-growth-before-monetisation]]
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]], [[2026-10-23-web-is-the-source-of-truth-for-both-clients]]
- [[2026-08-24-daily-cron-sync-reuses-the-parser]], [[2026-08-24-web-push-via-service-worker]] (proposed)

## Risks and tensions

- **The vision outruns the data.** Phases 3 and 4 need accumulated statistics from real teams; with few active teams the AI layer has nothing to learn from. Growth comes first for product reasons, not only commercial ones.
- **Push is the missing half of "assistent-coach".** Sync detects changes nobody is told about. The three-part V2 is two-thirds built.
- **Scope creep guard versus roadmap.** `CLAUDE.md` says no features beyond MVP without an explicit request; this brain is where the explicit requests are recorded.

## Open questions

- Phase 3 design: what does "development over time" need from the data model? ([[2026-02-26-skills-as-jsonb-without-history]])
- When does the deferred parent/carer view get a design? Deferred on 2026-10-23 without a date.
