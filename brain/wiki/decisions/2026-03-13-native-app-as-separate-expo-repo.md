---
type: decision
title: A React Native app as a separate Expo repository
created: 2026-10-23
updated: 2026-10-23
status: superseded
decided_by: Yustin Troost, product call, 2026-03-13 ("Approved" in the design; superseded the same day by a Kotlin build)
supersedes: ""
tags: [native-app, play-store, notifications, distribution]
sources: ["[[2026-03-13-seo-blog-native-app-design]]", "[[2026-03-02-growth-seo-viral-design]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# A React Native app as a separate Expo repository

> [!info] Superseded
> Superseded on 2026-03-13 by [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]: the separate repository was created that day, in Kotlin + Jetpack Compose rather than Expo. The phasing and the shared-backend idea survived; the cross-platform promise did not. The reasoning below is left as written.

## Decision

Build a second client — Expo + Expo Router in a repository `teamplanner-app` — on the same Supabase backend, publish it to the Google Play Store, and give it push notifications, secure token storage, haptics and the native share sheet.

## Context

The growth design had planned Play Store presence cheaply, as a TWA wrapper of the PWA ([[2026-03-02-growth-seo-viral-design]]). The March design replaced that with a full native app, five phases long, with push as its final phase ([[2026-03-13-seo-blog-native-app-design]]). The design does not say why the TWA route was dropped (unsourced).

## Alternatives considered

- **TWA via PWABuilder** ($25 once). The earlier plan. Store listing without a second codebase; no native push, no haptics.
- **Stay PWA-only and add Web Push.** What the August design does ([[2026-08-24-web-push-via-service-worker]]).

## Consequences

- The repository was created on 2026-03-13 — as a Kotlin app ([[teamplanner-android]]). Phases 1–4 of this design's phasing were built by 2026-03-15; phase 5 (push, Play Store) is open on 2026-10-23.
- Two codebases track one schema with copied types, as this design planned; the drift that implies is tracked in [[web-android-parity]].
- The August 2026 design puts push in the PWA ([[2026-08-24-web-push-via-service-worker]]), so push now has two candidate channels. See [[native-app]].

## Where it lives in the code

- `../teamplanner-android/` — see [[teamplanner-android]]. Design: `docs/plans/2026-03-13-seo-blog-native-app-design.md`.
