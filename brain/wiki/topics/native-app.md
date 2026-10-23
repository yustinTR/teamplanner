---
type: topic
title: Native app
created: 2026-10-23
updated: 2026-10-23
tags: [native-app, android, play-store, distribution]
sources: ["[[2026-03-02-growth-seo-viral-design]]", "[[2026-03-13-seo-blog-native-app-design]]", "[[2026-03-13-android-phase4-complex-features-design]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Native app

## Where we stand

**An Android app exists and is at parity with the web except for push**: [[teamplanner-android]], Kotlin + Jetpack Compose, phases 1–4 built in March, every later web feature ported on 2026-10-23 (compiled, not yet run on a device). Phase 5 is complete on the build side as of 2026-10-23: push (FCM, verified on the emulator) and a signed, R8-minified release build that was smoke-tested on the emulator. Yustin has a Play Console developer account; what remains is the upload itself and the store questionnaires. Listing copy, feature graphic, screenshots and the checklist are in `teamplanner-android/docs/play-store/`; the upload key lives in `~/.android/keystores/` on Yustin's machine, never in the repository ([[web-android-parity]]).

How it got here:

1. February: PWA only ([[2026-02-19-pwa-over-native-app]]) — still true for iOS.
2. 2026-03-02: Play Store via a TWA wrapper, *"when budget allows"* ([[2026-03-02-growth-seo-viral-design]]).
3. 2026-03-13: a full Expo app approved ([[2026-03-13-native-app-as-separate-expo-repo]], superseded) — and the same day scaffolded in Kotlin instead ([[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]).
4. 2026-08-24: push designed for the PWA ([[2026-08-24-web-push-via-service-worker]]), independent of the Android app.

What the Android app is for, now that push is designed on the web too: Play Store discoverability and trust, a native feel, haptics, the system share sheet, and — once phase 5 happens — push without the PWA's home-screen caveat on Android. iOS has no native client: *"ooit komt er ook een ios client maar ios licentie vind ik nog te duur dus voorlopig blijft bij pwa en android"* ([[2026-10-23-open-questions-answered]]) — deferred on cost, not rejected.

## Requirements

- Identical behaviour, copy and data to the web, differences only where the platform forces them ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]]).
- Same Supabase project, RLS and auth; a user logs in from either.
- Phase 5 before a public listing: push, icons, splash, store screenshots.

## Decisions

- [[2026-02-19-pwa-over-native-app]] (accepted; still governs iOS)
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]] (accepted)
- [[2026-03-13-native-app-as-separate-expo-repo]] (superseded)
- [[2026-10-23-web-is-the-source-of-truth-for-both-clients]] (accepted)
- [[2026-10-23-push-per-client-web-first]] (accepted)
- [[2026-10-23-android-share-image-matches-the-web-card]] (accepted)

## Risks and tensions

- **Two codebases, one developer.** Every web feature since March is an unpaid port. The ledger makes the debt visible; it does not pay it.
- **Phase 5 is the whole distribution value.** Without a Play Store listing the app reaches nobody the PWA does not; without push it offers nothing the PWA cannot. Push works; the listing is in the Play Console (2026-10-23) but a *personal* developer account must run a closed test with 12 testers for 14 days before production is unlocked — the store launch is weeks away at best, and the bottleneck is finding twelve testers, not code.
- **Push in two places, by choice.** Separate paths per client so the two can evolve apart, web first ([[2026-10-23-push-per-client-web-first]]); the three triggers stay the shared contract.

## Open questions

- Play Console state (2026-10-23): internal-test release 3 (1.1.0, targetSdk 36 — Play refused 35) is live for one tester; privacy policy, ads, advertising ID, government, finance, health, content rating (PEGI 3), category Sport, contact details and the full store listing are saved. Still open, in dependency order: *sign-in details* (needs a reviewer account with a known password — the test account's password is not stored anywhere and the SQL reset was left to Yustin), then *target audience*, then *data safety* (saved as draft, complete), then submit from the publishing overview.
- Closed test: twelve opted-in testers for fourteen days, then a production-access application with questions about the test. Where do twelve testers come from — the own club's two active teams?
- Android push is a separate path, after the web's ([[2026-10-23-push-per-client-web-first]]); the mechanism is undesigned.
- When does the Apple developer licence become worth it? Tied to user numbers, no threshold named.
