---
type: decision
title: PWA over a native app
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product and technical call, February 2026
supersedes: ""
tags: [platform, pwa, distribution]
sources: ["[[2026-02-xx-project-documentatie-v1]]"]
---

# PWA over a native app

## Decision

TeamPlanner is a mobile-first progressive web app, installed from a link, not an app-store app.

## Context

The audience is on a phone *"op het veld, in de kleedkamer, of onderweg"* ([[2026-02-xx-project-documentatie-v1]]), and the growth model is a coach sharing a link in a [[whatsapp]] group so the team follows ([[2026-02-26-coach-autopilot-roadmap]]). `PROJECT_CONTEXT.md` states the reasons in one line: *"PWA over native — Geen App Store gedoe, direct deelbaar via link, lagere drempel."* A solo developer with no budget cannot carry two native codebases plus store reviews.

## Alternatives considered

- **Native iOS and Android apps.** Store presence and real push, at the cost of two more codebases, $99/year for Apple, review cycles, and a download step between the WhatsApp link and the first availability tap. Lost on friction and cost.
- **Native app later, as a second client on the same backend.** Happened on 2026-03-13 for Android ([[2026-03-13-android-app-in-kotlin-as-one-to-one-port]], [[teamplanner-android]]). It adds a client; the PWA remains the product and the only iOS client until an Apple licence is judged worth it ([[2026-10-23-open-questions-answered]]).

## Consequences

- Push notifications depend on Web Push, which on iOS only works once the PWA is on the home screen ([[2026-08-24-v2-sync-push-stats-design]]). This is the single biggest cost of the decision and is still unpaid: push is not built. See [[notifications]].
- No store discoverability; growth is SEO and the viral invite link ([[growth-and-seo]]).
- Offline basics via a service worker (Serwist), install prompts and OG previews matter more than they would for a native app. Note: from the Next 16 upgrade until 2026-10-23 production shipped no service worker (Turbopack build, webpack-only Serwist plugin); the PWA promise was broken without anyone noticing until push needed the worker ([[notifications]]).

## Where it lives in the code

- Service worker and manifest: `src/app/sw.ts`, `public/` (manifest, icons), Serwist in `next.config.ts`
- Invite link as the distribution channel: `src/app/join/[code]/`
