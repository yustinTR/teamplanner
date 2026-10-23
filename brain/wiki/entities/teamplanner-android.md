---
type: entity
title: teamplanner-android (the Kotlin app)
created: 2026-10-23
updated: 2026-10-23
tags: [android, client, kotlin, parity]
sources: ["[[2026-03-13-android-phase2-core-screens-design]]", "[[2026-03-13-android-phase3-interaction-design]]", "[[2026-03-13-android-phase4-complex-features-design]]"]
---

# teamplanner-android (the Kotlin app)

## What it is

The native Android client of [[myteamplanner-nl]]: Kotlin, Jetpack Compose, Material 3, Hilt, Supabase Kotlin SDK 3.x, minSdk 26, targetSdk 35. Repository `../teamplanner-android` next to this one, on GitHub as `yustinTR/teamplanner-android` (renamed to that on 2026-10-23; the Gradle project is still `TeamPlannerAndroid`). Its own `CLAUDE.md` defines it as *"a 1-to-1 port of the web app's functionality"* with the web repository as *"the source of truth on features, data models, business logic, and UI patterns"*.

## Role in this project

The second client on the one Supabase backend. Same project id, tables, RLS and auth: a user logs in from either. Its purpose is store presence and a native feel on Android; its rule is to be identical to the web app in behaviour, Dutch copy and data, with differences only where the platform forces them ([[2026-10-23-web-is-the-source-of-truth-for-both-clients]]).

## Key facts

- Scaffolded 2026-03-13, the same day the Expo plan was approved — built in Kotlin instead ([[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]).
- Phases 1–4 (foundation, read-only screens, coach writes, lineup/substitutions/sharing/team settings) built between 2026-03-13 and 2026-03-15; 37 commits. Phase 5 (push, icons, Play Store) not started. Its `CLAUDE.md` still says *"Phase 1 complete"* — stale.
- Has its own `docs/plans/` written by the same `brainstorming` and `writing-plans` skills; the brain ingests from there too (`brain/CLAUDE.md`).
- Born on the v2 EAFC skills model; never knew the ten-skill model.
- Secrets in `local.properties`, not committed.
- No tests are mentioned in any design; `./gradlew test` exists in `CLAUDE.md`. Unverified whether any test exists.

## Relationships

- [[web-android-parity]] — the ledger of what matches and what does not
- [[native-app]], [[notifications]], [[supabase]]

## Open questions

- Who keeps the two `Constants.kt` / `constants.ts` files in step? Nothing automated. → [[web-android-parity]]
- Play Store listing and app signing: no source. → [[native-app]]
