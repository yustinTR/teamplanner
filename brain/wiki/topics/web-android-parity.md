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

Android ([[teamplanner-android]]) was built to the web app as it stood on 2026-03-13 to 2026-03-15 and caught up on 2026-10-23: every feature gap except push was ported the same day the web shipped push, seasons and the sync alert (Android commit in `teamplanner-android`, design `docs/plans/2026-10-23-web-parity-ports-design.md`). What remains is push on Android (phase 5) and the follow-ups below.

### Feature ledger

| Feature | Web | Android | State |
|---|---|---|---|
| Auth: e-mail login, register, forgot/reset password | yes | yes (phase 1) | parity |
| Dashboard with quick actions and season highlights | yes | yes | parity |
| Onboarding checklist and inline hints ([[2026-02-26-onboarding-checklist-hints-design]]) | yes | yes (2026-10-23 port, DataStore) | parity |
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
| Formation 3-4-3 for 11v11 (web 2026-04-23) | yes | yes (2026-10-23 port) | parity |
| Substitution planner, minutes bars, auto-generation | yes | yes | parity |
| Lineup image sharing | 540 CSS px card rendered at scale 2 ([[2026-03-02-share-images-from-hidden-components]]) | same card, 540×810 at scale 2 (2026-10-23) | parity ([[2026-10-23-android-share-image-matches-the-web-card]]) |
| Match report sharing (text and image) | yes | yes (2026-10-23 port; text via share sheet) | parity |
| Team settings (name, club, type, gathering, address, ratings toggle), invite link | yes | yes | parity |
| voetbal.nl import ([[voetbal-nl-integration]]) | yes | yes (2026-10-23 port, through the web API with a Bearer token) | parity; one scraper on the server |
| Automatic sync toggle, recent changes, refresh now ([[2026-08-24-daily-cron-sync-reuses-the-parser]]) | yes | yes (2026-10-23 port) | parity |
| Team season stats dashboard ([[statistics-and-fair-playing-time]]) | yes | yes (2026-10-23 port, plain Compose bars) | parity |
| Admin flag honoured in `isCoach` ([[2026-03-12-admins-share-coach-rights]]) | yes | yes (`currentPlayer.isAdmin`) | parity |
| Profile editing | yes | yes | parity |
| Push notifications ([[notifications]]) | **yes (2026-10-23)**, Web Push | no (phase 5) | **gap**; separate path ([[2026-10-23-push-per-client-web-first]]); the three triggers and the `push_subscriptions` table (with `platform`) are shared |
| Season filter on statistics ([[2026-10-23-statistics-per-season-august-to-july]]) | yes (2026-10-23) | yes (2026-10-23, chip row) | parity |
| Sync-failure alert to coach | yes (2026-10-23, via push) | n/a until Android push | follows push |
| PWA install, offline basics | yes | n/a | allowed — platform |
| Landing page, blog, feature pages, SEO, legal pages | yes | no, by rule | allowed — web-only marketing |

### Allowed differences

Platform-forced, written down so they stop being questions:

| Area | Web | Android | Why allowed |
|---|---|---|---|
| Forms and confirmations | shadcn Sheet / Dialog | Material 3 `ModalBottomSheet` / `AlertDialog` | platform idiom; same fields, same Dutch labels |
| Drag and drop | dnd-kit | custom `pointerInput` | no dnd-kit on Android; same swap/move semantics required |
| Radar chart | Recharts | Compose `Canvas` | no chart library; same six axes |
| Share image rendering | html2canvas-pro from a hidden DOM | Compose `Canvas` to `Bitmap`, Android share sheet | platform; same 540-px layout at scale 2 |
| Photo upload | browser file input | Android Photo Picker, resize 512 px | platform; same storage path |
| Touch targets | 44 px | 48 dp | platform guidelines |
| Theme | Tailwind v4 tokens | Material 3 scheme *"matching the web app's Tailwind tokens"* | same primary `#16A34A`; token parity unverified beyond primary |
| Animation | Framer Motion presets ([[2026-03-02-framer-motion-for-all-animation]]) | Compose animations | no shared presets; feel should match, no rule yet |
| Navigation | App Router, bottom nav | Navigation Compose, bottom tabs | same four tabs |
| Secrets | Vercel env | `local.properties` | platform |
| Push mechanism | Web Push (VAPID), built | undesigned (FCM likely) | by choice, so the clients can evolve apart; triggers shared ([[2026-10-23-push-per-client-web-first]]) |

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

- **A toolchain on the developer's machine.** The ports compile (`assembleDebug`, OpenJDK 21 via Homebrew, SDK 35, Gradle 8.11.1 outside the repo); they have not been run on a device. First device run is owed.
- **Copied constants and algorithms** are the drift engine. A shared test fixture (same lineup input, same expected output on both sides) would catch it; none exists (synthesis).
- **Every gap is real.** Yustin decided on 2026-10-23 that onboarding, match-report sharing and the voetbal.nl import all belong on Android too; nothing in the feature ledger is web-only except marketing, SEO and PWA install.
- **Two `docs/plans/` folders, one skill set**: a design on one side does not prompt the other. The ledger is the prompt.

## Open questions

- Verify the unverified rows (multi-team, Realtime, skills editor, plan creation, stats filter) in the Android code.
- Device check of the 2026-10-23 ports: stats screen, import flow, onboarding checklist, report image.
- A bug found while porting: Android's `Match` model read two columns that do not exist (`gathering_minutes`, `travel_minutes`); fixed. Worth a shared fixture test (synthesis).
