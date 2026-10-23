---
type: topic
title: Web ↔ Android parity ledger
created: 2026-10-23
updated: 2026-10-23
tags: [android, parity, web, process]
sources: ["[[2026-03-13-android-phase2-core-screens-design]]", "[[2026-03-13-android-phase3-interaction-design]]", "[[2026-03-13-android-phase4-complex-features-design]]"]
---

# Web ↔ Android parity ledger

The one page that connects the two clients. Rule: the web app is the reference, Android must match it, and every difference is either a **gap** (owed) or an **allowed difference** (written down here with its reason) — [[2026-10-23-web-is-the-source-of-truth-for-both-clients]]. Read this before designing a feature on either side; update it after.

State on 2026-10-23, from the three Android designs, both repositories' git history, and greps of both codebases. "Unverified" means the brain has not confirmed it in the code yet.

## Where we stand

Android ([[teamplanner-android]]) was built to the web app as it stood on 2026-03-13 to 2026-03-15. The web has moved since; Android has not. Three web features and one formation are gaps; one Android feature preceded the web by four weeks and the web caught up.

### Feature ledger

| Feature | Web | Android | State |
|---|---|---|---|
| Auth: e-mail login, register, forgot/reset password | yes | yes (phase 1) | parity |
| Dashboard with quick actions and season highlights | yes | yes | parity |
| Onboarding checklist and inline hints ([[2026-02-26-onboarding-checklist-hints-design]]) | yes | no — not in any Android design | **gap, port** (decided 2026-10-23: *"ja ook op android"*) |
| Multi-team switcher ([[2026-03-02-multi-team-support-design]]) | yes | not in phase 2 design (*"Fetch team for current user"*, singular) | **gap** (unverified in code) |
| Match list tabs, detail, CRUD, cancel, score dialog | yes | yes (phases 2–3) | parity |
| Match stats grid | yes | yes; filter to lineup players planned for phase 4 | parity, filter unverified |
| Loan players (leen-spelers, `match_players`) | yes (2026-02-20) | yes (2026-03-13) | parity |
| Availability toggle and grid; coach sets it for players without accounts | yes (coach-set: 2026-04-10) | yes (coach-set: 2026-03-13) | parity — Android led |
| Availability grid live via Realtime | yes | DI provides Realtime; use unverified | unverified |
| Player list, detail, CRUD, photo upload, deactivate | yes | yes | parity |
| Skills radar and EAFC rating / card tier (v2 since 2026-03-02) | yes | yes, 6 axes 1–99, `hasEafcSkills` | parity |
| Skills editor (coach rates players) | yes | not named in any Android design | **gap** (unverified) |
| `show_ratings` team setting | yes (2026-03-06) | yes | parity |
| Events list, detail, CRUD, attendance, tasks; coach-set attendance | yes | yes | parity |
| Training plans and exercise library | yes | yes (read-only in phase 2) | parity; plan creation on Android unverified |
| Lineup editor, formation selector, auto-lineup | yes | yes (phase 4) | parity |
| Formation 3-4-3 for 11v11 (web 2026-04-23) | yes | no (`Constants.kt` has no 3-4-3) | **gap** |
| Substitution planner, minutes bars, auto-generation | yes | yes | parity |
| Lineup image sharing | 1080×1350 hidden component ([[2026-03-02-share-images-from-hidden-components]]) | 540×810 Canvas bitmap | **gap**: Android to 1080×1350 ([[2026-10-23-android-share-image-matches-the-web-card]]) |
| Match report sharing (text and image) | yes | no | **gap, port** (decided 2026-10-23: *"mag ook op android als dat kan"*) |
| Team settings (name, club, type, gathering, address, ratings toggle), invite link | yes | yes | parity |
| voetbal.nl import ([[voetbal-nl-integration]]) | yes | no (dropped between the Expo plan and the Kotlin phase 4) | **gap, port** (decided 2026-10-23: *"ook op android, maar ook via web-app"*, [[2026-10-23-open-questions-answered]]) |
| Automatic sync toggle and recent changes ([[2026-08-24-daily-cron-sync-reuses-the-parser]]) | yes (2026-08-24, 2026-09-16) | no UI; the server-side cron serves Android users anyway | **gap** (settings UI only) |
| Team season stats dashboard ([[statistics-and-fair-playing-time]]) | yes (2026-09-16) | no | **gap**; port after the season filter ([[2026-10-23-statistics-per-season-august-to-july]]) lands on the web |
| Admin flag honoured in `isCoach` ([[2026-03-12-admins-share-coach-rights]]) | yes | yes (`currentPlayer.isAdmin`) | parity |
| Profile editing | yes | yes | parity |
| Push notifications ([[notifications]]) | no (designed) | no (phase 5) | neither; separate paths, web first ([[2026-10-23-push-per-client-web-first]]); the three triggers are shared |
| PWA install, offline basics | yes | n/a | allowed — platform |
| Landing page, blog, feature pages, SEO, legal pages | yes | no, by rule | allowed — web-only marketing |

### Allowed differences

Platform-forced, written down so they stop being questions:

| Area | Web | Android | Why allowed |
|---|---|---|---|
| Forms and confirmations | shadcn Sheet / Dialog | Material 3 `ModalBottomSheet` / `AlertDialog` | platform idiom; same fields, same Dutch labels |
| Drag and drop | dnd-kit | custom `pointerInput` | no dnd-kit on Android; same swap/move semantics required |
| Radar chart | Recharts | Compose `Canvas` | no chart library; same six axes |
| Share image rendering | html2canvas-pro from a hidden DOM | Compose `Canvas` to `Bitmap`, Android share sheet | platform; size and layout must match the web (1080×1350) |
| Photo upload | browser file input | Android Photo Picker, resize 512 px | platform; same storage path |
| Touch targets | 44 px | 48 dp | platform guidelines |
| Theme | Tailwind v4 tokens | Material 3 scheme *"matching the web app's Tailwind tokens"* | same primary `#16A34A`; token parity unverified beyond primary |
| Animation | Framer Motion presets ([[2026-03-02-framer-motion-for-all-animation]]) | Compose animations | no shared presets; feel should match, no rule yet |
| Navigation | App Router, bottom nav | Navigation Compose, bottom tabs | same four tabs |
| Secrets | Vercel env | `local.properties` | platform |
| Push mechanism | Web Push (VAPID) | undesigned (FCM likely) | by choice, so the clients can evolve apart; triggers shared ([[2026-10-23-push-per-client-web-first]]) |

### Shared contract (must never drift)

- Supabase schema, RLS and helpers (`get_my_team_ids`, `is_team_admin`) — one migration set, in the web repository.
- JSONB shapes: `players.skills` (EAFC v2), `lineups.positions`, `lineups.substitution_plan` — two serialisers, one shape.
- Constants: team types and `TEAM_TYPE_CONFIG`, formations and slot coordinates, positions, Dutch labels, skill categories — `src/lib/constants.ts` ↔ `data/Constants.kt`.
- Algorithms: auto-lineup, auto-substitutions, minutes calculation, rating and tier — `lineup-generator.ts` ↔ `LineupGenerator.kt`, `player-rating.ts` ↔ `PlayerRating.kt`.
- Dutch UI copy.

## Requirements

- A feature shipped on the web creates a ledger row with Android's state the same day; same the other way round.
- A schema or JSONB change is not done until the Kotlin models are updated — the web migration cannot know about the Android serialisers, so the ledger has to.
- An allowed difference needs a reason in the table above; "it was easier" is a gap.

## Decisions

- [[2026-10-23-web-is-the-source-of-truth-for-both-clients]]
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]
- [[2026-10-23-android-share-image-matches-the-web-card]], [[2026-10-23-push-per-client-web-first]]

## Risks and tensions

- **Seven months of one-sided change.** Everything the web gained after 2026-03-15 is an Android gap; the longer Android waits, the bigger the port.
- **Copied constants and algorithms** are the drift engine. A shared test fixture (same lineup input, same expected output on both sides) would catch it; none exists (synthesis).
- **Every gap is real.** Yustin decided on 2026-10-23 that onboarding, match-report sharing and the voetbal.nl import all belong on Android too; nothing in the feature ledger is web-only except marketing, SEO and PWA install.
- **Two `docs/plans/` folders, one skill set**: a design on one side does not prompt the other. The ledger is the prompt.

## Open questions

- Verify the unverified rows (multi-team, Realtime, skills editor, plan creation, stats filter) in the Android code.
- Order of the Android ports now owed: onboarding, match-report sharing, share-image size, 3-4-3, sync settings, voetbal.nl import, season dashboard.
