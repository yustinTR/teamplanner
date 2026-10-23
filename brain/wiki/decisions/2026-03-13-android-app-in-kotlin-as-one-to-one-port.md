---
type: decision
title: The Android app is a Kotlin + Compose one-to-one port, not an Expo app
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, technical call, 2026-03-13 (visible in the Android repository's first commit; no design document records the switch from Expo)
supersedes: "[[2026-03-13-native-app-as-separate-expo-repo]]"
tags: [android, native-app, kotlin, parity]
sources: ["[[2026-03-13-seo-blog-native-app-design]]", "[[2026-03-13-android-phase2-core-screens-design]]", "[[2026-03-13-android-phase4-complex-features-design]]"]
---

# The Android app is a Kotlin + Compose one-to-one port, not an Expo app

## Decision

The native client is a Kotlin + Jetpack Compose app in a separate repository, Android only, that reproduces the web app's screens, copy, data shapes and algorithms one-to-one on the same Supabase backend.

## Context

[[2026-03-13-seo-blog-native-app-design]] approved a React Native + Expo app for Android *and* the same code on iOS later. The repository scaffolded that day (*"feat: scaffold Android app with Kotlin + Jetpack Compose"*) went native instead, keeping the design's five phases and its *"shared backend, copied types"* idea. No document explains the switch (unsourced). Plausible reasons: Compose gives Material 3 and a native feel without a bridge; a Kotlin port cannot share TypeScript anyway, so Expo's code-sharing promise was weak for a solo developer; and iOS was never budgeted ([[2026-03-02-growth-seo-viral-design]]).

## Alternatives considered

- **Expo + React Native** (the approved plan). Cross-platform and closer to the web's TypeScript, at the cost of a JS bridge, Expo tooling and a push setup through an Edge Function.
- **TWA wrapper of the PWA** ([[2026-03-02-growth-seo-viral-design]]). Store listing for $25, no native feel, no native push.

## Consequences

- Two implementations of every feature, algorithm and Dutch string. Parity is a discipline, not a property: the web is the reference and the brain keeps the ledger ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]], [[web-android-parity]]).
- Platform-forced differences are accepted: Material 3 sheets and dialogs instead of shadcn, custom `pointerInput` drag-and-drop instead of dnd-kit, Compose `Canvas` for the radar and the share image, Android share sheet and Photo Picker, 48 dp touch targets.
- Phases 1–4 done in three days (2026-03-13 to 2026-03-15); phase 5 — push, Play Store — is open, and push now has a competing web design ([[2026-08-24-web-push-via-service-worker]]).
- iOS has no native client and none is planned.

## Where it lives in the code

- `../teamplanner-android/` — `app/src/main/java/nl/myteamplanner/app/` (`data/`, `ui/`, `navigation/`, `di/`)
- Parity anchors: `data/Constants.kt` ↔ `src/lib/constants.ts`; `data/LineupGenerator.kt` ↔ `src/lib/lineup-generator.ts`; `data/PlayerRating.kt` ↔ `src/lib/player-rating.ts`; `data/model/*.kt` ↔ `src/types/*.ts`
