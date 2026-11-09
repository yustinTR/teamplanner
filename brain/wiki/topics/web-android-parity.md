---
type: topic
title: Web ↔ Android parity ledger
created: 2026-10-23
updated: 2026-10-25
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
| Multi-team switcher ([[2026-03-02-multi-team-support-design]]) | yes | yes (2026-10-25): `TeamStore` remembers the choice, `getMyTeams()` mirrors the web membership rule, dashboard header menu, tabs rebuild on switch | parity — smoke-tested with one team on the emulator; the menu itself needs an account with two teams |
| Match list tabs, detail, CRUD, cancel, score dialog | yes | yes (phases 2–3) | parity |
| Match stats grid | yes | yes; rows follow the substitution plan, else the lineup, else the squad (2026-10-25, unit-tested) | parity |
| Loan players (leen-spelers, `match_players`) | yes (2026-02-20) | yes (2026-03-13) | parity |
| Availability toggle and grid; coach sets it for players without accounts | yes (coach-set: 2026-04-10) | yes (coach-set: 2026-03-13) | parity — Android led |
| Availability grid live via Realtime | yes — but never worked until 2026-10-26: the `supabase_realtime` publication had no tables | subscribes to `availability` changes; connected only since the OkHttp Ktor engine (2026-10-26, seen live on the emulator: count changed after a database write) | parity, verified |
| Player list, detail, CRUD, photo upload, deactivate | yes | yes | parity |
| Skills radar and EAFC rating / card tier (v2 since 2026-03-02) | yes | yes, 6 axes 1–99, `hasEafcSkills` | parity |
| Skills editor (coach rates players) | yes | bottom-sheet editor, slider per EAFC attribute, overall on top (2026-10-25, emulator-tested) | parity |
| `show_ratings` team setting | yes (2026-03-06) | yes | parity |
| Events list, detail, CRUD, attendance, tasks; coach-set attendance | yes | yes | parity |
| Training plans and exercise library | yes (drag to reorder) | coaches create plans, add/remove exercises, and move them up/down (2026-10-26, emulator-tested) | parity — reorder is buttons on Android, drag on web: allowed, same result |
| Lineup editor, formation selector, auto-lineup | yes | yes (phase 4) | parity |
| Formation 3-4-3 for 11v11 (web 2026-04-23) | yes | yes (2026-10-23 port) | parity |
| Substitution planner, minutes bars, auto-generation | yes | yes | parity |
| Lineup image sharing | 540 CSS px card rendered at scale 2 ([[2026-03-02-share-images-from-hidden-components]]) | same card, 540×810 at scale 2 (2026-10-23) | parity ([[2026-10-23-android-share-image-matches-the-web-card]]) |
| Match report sharing (text and image) | yes | yes (2026-10-23 port; text via share sheet) | parity |
| Substitution plan as a share image | `ShareSubstitutionPlan` card: moments, playing-time bars, strip (2026-10-26) | same card on the canvas, shared from the lineup top bar (2026-10-26, emulator-checked via print preview) | parity |
| Share from the match list | icon on each upcoming (lineup) and played (report) card; data loaded on first tap; no lineup sends the coach to the editor (2026-10-26) | same, `MatchCard` action slot + on-demand load in the list view model (2026-10-26, emulator-tested) | parity |
| PDF export: lineup sheet and match programme (A4, white) | `useExportPdf` (html2canvas + jsPDF, dynamic import), buttons in lineup view/editor and match list (2026-10-26) | `PdfDocument` pages drawn on a canvas, same sections; PDF icon in the lineup bar, "Programma als PDF" above the match list (2026-10-26, print-preview checked) | parity |
| Follow link for parents ([[2026-10-26-follow-link-for-parents]]) | switch + link in team settings; public page `/volg/<token>` (2026-10-26) | same switch, link, copy and share in team settings (2026-10-26, emulator-tested: off clears the token, on writes a new one) | parity for the setting; the page is web-only by nature (allowed) |
| Team settings (name, club, type, gathering, address, ratings toggle), invite link | yes | yes | parity |
| voetbal.nl import ([[voetbal-nl-integration]]) | yes | yes (2026-10-23 port, through the web API with a Bearer token) | parity; one scraper on the server |
| Automatic sync toggle, recent changes, refresh now ([[2026-08-24-daily-cron-sync-reuses-the-parser]]) | yes | yes (2026-10-23 port) | parity |
| Team season stats dashboard ([[statistics-and-fair-playing-time]]) | yes | yes (2026-10-23 port, plain Compose bars) | parity |
| Admin flag honoured in `isCoach` ([[2026-03-12-admins-share-coach-rights]]) | yes | yes (`currentPlayer.isAdmin`) | parity |
| Profile editing | yes | yes | parity |
| Push notifications ([[notifications]]) | **yes (2026-10-23)**, Web Push | **yes (2026-10-23)**, FCM: token registered as an `android` row, messaging service, deep links, profile toggle; verified end to end on the emulator with the server's service account | parity ([[2026-10-23-push-per-client-web-first]]); Android push goes live with the next production deploy |
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
| Share images end in a "Gemaakt met MyTeamPlanner" strip ([[2026-10-25-made-with-strip-on-share-images]]) | yes (2026-10-25) | yes (2026-10-25, canvas) | parity |
| Account deletion | `/account-verwijderen` page (e-mail request), linked from privacy policy | links to the same page from the profile screen (2026-10-25) | parity; no in-app delete on either side |
| Store/install pages | `/android` install page, dashboard hint, landing block | n/a — the app *is* the install | allowed difference: web-only marketing |
| Legal pages | `/privacy`, `/voorwaarden` | profile links open the web pages | allowed difference: single source for legal text |
| Push mechanism | Web Push (VAPID) | FCM data messages | by choice; both built and configured | by choice, so the clients can evolve apart; triggers shared ([[2026-10-23-push-per-client-web-first]]) |

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

- **Column and JSON drift was real.** The first emulator run ([[2026-10-23-android-emulator-test-setup]]) found that Android read `detailed_position` / `shirt_number` / `photo_path` (schema: `primary_position`, `jersey_number`, `photo_url`), `instructions` (`setup_instructions`), a `minutes_played` that does not exist, and decoded the substitution plan with snake_case keys while the web writes camelCase. All fixed on 2026-10-23; the shared-fixture test is still missing.
- **Copied constants and algorithms** are the drift engine. A shared test fixture (same lineup input, same expected output on both sides) would catch it; none exists (synthesis).
- **Every gap is real.** Yustin decided on 2026-10-23 that onboarding, match-report sharing and the voetbal.nl import all belong on Android too; nothing in the feature ledger is web-only except marketing, SEO and PWA install.
- **Two `docs/plans/` folders, one skill set**: a design on one side does not prompt the other. The ledger is the prompt.

## Open questions

- Verified 2026-10-25 in code: all five were gaps; all five closed the same day and shipped as closed-test release 5 (1.2.0). Still owed: exercise reordering in a plan; a two-team account to exercise the switcher; a live Realtime check on a device.
- 2026-10-26: roadmap step 1 finished on both clients (plan image, list sharing); Android release 1.3.0 (versionCode 6) carries it to the closed test. Owed list unchanged.
- 2026-10-26, later: exercise reordering and the follow-link switch landed on Android. Reordering exposed a shared bug: `(plan_id, sort_order)` is unique, so updating rows one by one (or in parallel, as the web did) collides when two rows swap — both clients now park rows on negative placeholders first. PDF export followed the same afternoon (release 1.4.0, versionCode 7). Both remaining checks done the same day: a second team on the test account shows the switcher, switches data and survives a restart; Realtime was seen live after two fixes (publication tables, OkHttp engine; release 1.4.1). Nothing is owed on Android as of 2026-10-26.
- Still unverified on a device: the import flow end to end, image sharing through the share sheet, push.
- Write the shared fixture test: one lineup JSON, decoded by both `src/types/lineup.ts` and `Lineup.kt`, so key drift fails a build instead of a device run.
