---
type: source
title: SEO blog content and React Native app (design)
created: 2026-10-23
updated: 2026-10-23
tags: [seo, blog, native-app, play-store, growth]
source_file: docs/plans/2026-03-13-seo-blog-native-app-design.md (implementation plan for traject A: docs/plans/2026-03-13-seo-blog-implementation.md)
source_date: 2026-03-13
language: en
sources: []
---

# SEO blog content and React Native app (design)

## Summary

Marked *"Status: Approved"*. Two parallel tracks to grow the user base. **Traject A**: six more blog articles on named keywords, Article JSON-LD, breadcrumbs, internal links, sitemap — *"12 blog articles total"*. **Traject B**: a full React Native + Expo app in a separate repository `teamplanner-app`, sharing the Supabase backend, RLS and auth, with copied types and utilities, published to the Google Play Store. Execution order: A first as the quick win, then B phase by phase.

## Key points

- Native stack: Expo SDK 53 + Expo Router, NativeWind, Zustand, React Query, expo-secure-store, Reanimated, victory-native, Expo Notifications + a Supabase Edge Function for push, react-native-view-shot, Lucide.
- Native-only features: push notifications for availability reminders, secure token storage, haptics, native share sheet.
- Web-only, not in the app: landing page, blog, feature and legal pages, SEO, SSR.
- Five phases for B, from foundation to Play Store publication; push lands in phase 5.

## Requirements raised

- Play Store presence and push notifications, both attributed to the native app.

## Decisions made

- [[2026-03-13-native-app-as-separate-expo-repo]] (proposed)

## What was built

Traject A was built on 2026-03-13 (git history: *"add breadcrumbs, 6 new blog articles, and internal linking"*), and three more articles on 2026-04-10; `src/lib/blog.ts` holds 15 articles on 2026-10-23. **Traject B was started the same day, in Kotlin + Jetpack Compose rather than Expo**, as `../teamplanner-android` ([[teamplanner-android]], [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]). Its phases 1–4 were built by 2026-03-15; phase 5 (push, Play Store) is open. The next design (2026-08-24) plans push as Web Push inside the PWA, so push now has two candidate channels. See [[native-app]].

## Open questions

- Which push channel first, Web Push or Android? → [[notifications]]
