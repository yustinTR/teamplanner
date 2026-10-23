---
type: note
title: Running the Android app on an emulator from this machine
created: 2026-10-23
updated: 2026-10-23
question: How do I build and exercise the Android app without Android Studio, and with what account?
tags: [android, testing, emulator, tooling]
sources: []
---

# Running the Android app on an emulator from this machine

## Answer

The toolchain was installed on 2026-10-23 without Android Studio, and a dedicated test account and test team exist so nobody's real team is touched.

| What | Where |
|---|---|
| JDK | OpenJDK 21 via Homebrew: `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home` (set `JAVA_HOME`) |
| Android SDK | `/opt/homebrew/share/android-commandlinetools` (set `ANDROID_HOME`); platform 35, build-tools 35 and 34, platform-tools, emulator, system image `android-35;google_apis;arm64-v8a` |
| Gradle | 8.11.1, downloaded to a session scratchpad; the repository has no `gradlew`. Any Gradle 8.11 works: `gradle assembleDebug testDebugUnitTest --no-daemon` in `teamplanner-android/` |
| `local.properties` | `sdk.dir`, `supabase.url`, `supabase.anonKey`; after Firebase: `firebase.projectId`, `firebase.appId`, `firebase.apiKey`, `firebase.senderId`. Gitignored. |
| AVD | `teamplanner` (Pixel 6, API 35). Boot headless: `emulator -avd teamplanner -no-window -no-audio -gpu swiftshader_indirect` |
| Test account | `android-emulator-test@myteamplanner.nl`, auth user `794df57b-2b36-40fc-9e5b-b82c180879db`, confirmed by SQL. Password was generated at random and is not stored in the brain; reset it from the login screen if lost. |
| Test team | `Emulator testteam` (`0cbefa18-acb2-4f9d-8afb-9a9bba84b19a`, G-team, the test user as admin staff member), 8 players, 2 upcoming and 1 completed match with stats and a lineup, 1 event. Has only one linked member, so it never counts as active ([[2026-10-23-active-team-definition]]). |

Driving the UI without a window: `adb shell uiautomator dump` plus `adb shell input tap/text`, and `adb exec-out screencap -p` for screenshots. Tab labels are exact strings ("Gespeeld (1)").

## What was verified on 2026-10-23

Login, dashboard with checklist and season highlights, team list, statistics screen with minutes (after the substitution-plan key fix), team settings with the import button, completed match with hints and the report section, lineup with hint, profile with the notifications card. Not verified: the import flow end to end (needs a real VoetbalAssist club URL), push (needs Firebase), image sharing (share sheet).

## Reasoning

A device run found two bugs that compilation could not: the `Player` model read columns that do not exist, and the substitution plan was decoded with snake_case keys while the web writes camelCase — so Android could not read any plan the web saved. Both are the kind of drift the parity ledger warns about ([[web-android-parity]]); a shared JSON fixture test would catch the second kind before a device does.
