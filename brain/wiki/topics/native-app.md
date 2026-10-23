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

**An Android app exists and is in development**: [[teamplanner-android]], Kotlin + Jetpack Compose, phases 1–4 of its plan built between 2026-03-13 and 2026-03-15, phase 5 (push notifications, icons, splash, Play Store listing) not started, no commits between 2026-03-15 and the rename on 2026-10-23. It is a one-to-one port of the web app on the same backend; what it lacks is listed in [[web-android-parity]].

How it got here:

1. February: PWA only ([[2026-02-19-pwa-over-native-app]]) — still true for iOS.
2. 2026-03-02: Play Store via a TWA wrapper, *"when budget allows"* ([[2026-03-02-growth-seo-viral-design]]).
3. 2026-03-13: a full Expo app approved ([[2026-03-13-native-app-as-separate-expo-repo]], superseded) — and the same day scaffolded in Kotlin instead ([[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]).
4. 2026-08-24: push designed for the PWA ([[2026-08-24-web-push-via-service-worker]]), independent of the Android app.

What the Android app is for, now that push is designed on the web too: Play Store discoverability and trust, a native feel, haptics, the system share sheet, and — once phase 5 happens — push without the PWA's home-screen caveat on Android. iOS has no native client and none is planned; iOS users get the PWA.

## Requirements

- Identical behaviour, copy and data to the web, differences only where the platform forces them ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]]).
- Same Supabase project, RLS and auth; a user logs in from either.
- Phase 5 before a public listing: push, icons, splash, store screenshots.

## Decisions

- [[2026-02-19-pwa-over-native-app]] (accepted; still governs iOS)
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]] (accepted)
- [[2026-03-13-native-app-as-separate-expo-repo]] (superseded)
- [[2026-10-23-web-is-the-source-of-truth-for-both-clients]] (accepted)

## Risks and tensions

- **Two codebases, one developer.** Every web feature since March is an unpaid port. The ledger makes the debt visible; it does not pay it.
- **Phase 5 is the whole distribution value.** Without a Play Store listing the app reaches nobody the PWA does not; without push it offers nothing the PWA cannot.
- **Push in two places.** Web Push for the PWA and FCM for Android would be two sending paths for the same three triggers; a single server-side `sendPushToUsers` that fans out to both subscription types is the obvious shape (synthesis, not in any source).

## Open questions

- Phase 5 timing, signing and the Play Store listing.
- Will Android push be FCM through the same Next.js routes as Web Push, or a separate path?
- Should iOS ever get a client, or does the PWA stay the iOS answer? No source since February.
