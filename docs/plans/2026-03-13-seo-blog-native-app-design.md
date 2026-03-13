# SEO + Blog Content & React Native App Design

**Date:** 2026-03-13
**Status:** Approved

## Goal

Grow TeamPlanner's user base through two parallel efforts:
1. SEO improvements and new blog content to increase organic traffic
2. A full React Native + Expo mobile app published to the Google Play Store

---

## Traject A: SEO + Blog Content

### New Blog Articles (6 total)

| Article | Target Keyword | Search Intent |
|---------|---------------|---------------|
| "Voetbal teamindeling maken: tips voor trainers" | voetbal teamindeling | Coach needs help organizing team |
| "Beste apps voor voetbaltrainers 2026" | app voetbaltrainer | Coach comparing tools (listicle) |
| "Hoe plan je een voetbalseizoen als trainer" | voetbalseizoen plannen | Coach starting new season |
| "Voetbal statistieken bijhouden: zo doe je dat" | voetbal statistieken bijhouden | Coach wants data-driven approach |
| "Communicatie in een voetbalteam verbeteren" | communicatie voetbalteam | Coach frustrated with WhatsApp chaos |
| "Spelers beoordelen en ontwikkelen als jeugdtrainer" | spelers beoordelen jeugd | Youth coach needs evaluation system |

### Technical SEO Improvements

- Internal links between all blog articles and feature pages
- Article JSON-LD structured data on all blog posts
- Breadcrumbs component for blog and feature pages
- Sitemap auto-extended with new articles

### Result

12 blog articles total, better internal linking, more long-tail keywords covered.

---

## Traject B: React Native + Expo App

### Setup

- **Separate repository:** `teamplanner-app`
- **Framework:** Expo SDK 53 + Expo Router (file-based routing)
- **Shared backend:** Same Supabase database, RLS policies, and auth
- **Shared code:** TypeScript types, constants, business logic utilities (copied)

### Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | Expo SDK 53 + Expo Router |
| Styling | NativeWind (Tailwind for RN) |
| State management | Zustand |
| Server state | TanStack React Query |
| Backend | Supabase JS client |
| Auth | Supabase Auth + expo-secure-store |
| Animations | React Native Reanimated |
| Drag & drop | react-native-gesture-handler + Reanimated |
| Charts | react-native-svg + victory-native |
| Push notifications | Expo Notifications + Supabase Edge Function |
| Image sharing | react-native-view-shot |
| Icons | Lucide React Native |

### Screen Structure

```
app/
├── (auth)/
│   ├── login
│   ├── register
│   ├── forgot-password
│   └── reset-password
├── (tabs)/
│   ├── dashboard
│   ├── matches/
│   │   ├── index
│   │   └── [id]/
│   │       ├── index
│   │       └── lineup
│   ├── events/
│   │   ├── index
│   │   └── [id]
│   ├── team/
│   │   ├── index
│   │   ├── players/[id]
│   │   └── settings
│   └── training/
│       ├── index
│       ├── exercises
│       └── plans/[id]
├── profile
├── create-team
└── join/[code]
```

### Native-Specific Features (beyond web)

- Push notifications for availability reminders
- Secure auth token storage (expo-secure-store)
- Haptic feedback on drag-and-drop and toggles
- Native share sheet for lineup images

### Not Included (web-only)

- Landing page, blog, feature pages, legal pages
- SEO features (JSON-LD, meta tags, OG images)
- Server-side rendering

---

## Phasing

### Traject A: SEO + Blog (1-2 sessions)

1. Write 6 new blog articles + internal links
2. Article JSON-LD structured data on all blog posts
3. Breadcrumbs component for blog + feature pages
4. Extend sitemap

### Traject B: React Native App (multiple sessions)

**Phase 1 — Foundation**
- Expo project setup with Router, NativeWind, Zustand, React Query
- Supabase client with expo-secure-store auth
- Auth flow (login, register, forgot password)
- Tab navigation with bottom bar

**Phase 2 — Core screens (read-only)**
- Dashboard with season highlights
- Match list + match detail
- Player list + player detail with skills radar
- Event list + event detail
- Training plans + exercise library

**Phase 3 — Interaction**
- Availability submission (with haptic feedback)
- Event attendance
- Score editing + match stats
- Profile editing

**Phase 4 — Complex features**
- Lineup editor with drag-and-drop
- Substitution planner
- Lineup image sharing
- Team management (add/edit players, admin toggle)
- Team creation + invite links
- Team settings + voetbal.nl import

**Phase 5 — Native extras + Play Store**
- Push notifications (Expo Notifications + Edge Function)
- App icons, splash screen, store screenshots
- Play Store listing + review
- Publish

### Execution Order

Traject A first (quick win, immediate SEO impact), then Traject B phase by phase.
