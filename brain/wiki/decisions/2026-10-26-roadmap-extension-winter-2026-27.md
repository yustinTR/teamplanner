---
title: Roadmap extension — winter 2026/27: measure, then let the follow link grow
date: 2026-10-26
status: accepted
tags: [decision, roadmap, product, growth]
---

# Roadmap extension — winter 2026/27

## Where the autumn plan stands

Set on 2026-10-25 ([[2026-10-25-roadmap-coach-first-autumn-2026]]) and finished on 2026-10-26, a month early: share strip, substitution plan image, sharing from the match list, funnel events, Android parity (five ledger rows), PDF export and the parents' follow link — all on both clients. Along the way two bugs that had been invisible for months were fixed: the Realtime publication was empty (no live updates on any client, ever) and the Android HTTP engine could not open a websocket. What remains from the autumn plan is measurement: Search Console on 2026-11-10, the active-team count on 2026-11-25, and the four remaining indexing requests.

## Decision

The winter plan adds work in this order. Each item has a trigger; nothing below the first row starts before its trigger is met.

| When | What | Trigger / why |
|---|---|---|
| 1–15 Nov | **Measure.** Read the funnel (`create_team` → `save_lineup` → `share_*` → `export_pdf` → `enable_follow_link`), Search Console after the last indexing requests, the Google Group tester count, Play vitals for 1.4.x. Write the numbers into [[2026-10-23-active-team-count]]. | the whole autumn plan was built on one hand-run query; the next decisions need the numbers |
| Nov–Dec | **Follow link grows into the parents' product**: (a) an **ICS calendar feed** per follow link so parents subscribe to the programme in their phone calendar; (b) **availability by link** — a per-player link from the follow page where a parent taps "kan spelen / kan niet" without an account. | (a) starts when three or more real teams have switched the follow link on; (b) when (a) is used. This is the first real answer to "registration is the wall" ([[onboarding-and-conversion]]) and it keeps the coach-alone mode intact |
| mid Dec – Jan (winterstop) | **Season-half review card**: matches, goals, top scorers, attendance as a share image and a PDF page, on both clients. | the data exists (stats per season, [[2026-10-23-statistics-per-season-august-to-july]]); the winter break is when coaches look back and share, and the strip rides along |
| Dec | **Lineup as text** (copy / WhatsApp) next to the image, on both clients. | small; group chats on slow phones still prefer text, and the match report already has it |
| ongoing | **Hygiene that protects what shipped**: the shared lineup fixture test (both clients decode the same JSON), a monthly check of the Realtime publication after migrations, keystore backup and Sentry account (Yustin), one real-device run of push on web and Android. | drift and silent breakage were the two failure modes seen this month |
| when 12 testers × 14 days | **Apply for Play production.** | the group's member count is the trigger; no chasing |
| not now | Phases 3–4 (player development, AI), carpool, iOS native, payments, dark mode, new blog articles before the 10 Nov reading. | need a crowd, a measurement, or money that is not there |

## Why this order

- **Measure before build.** Today every feature on the roadmap exists; the only unknown is which ones people touch. Two weeks of data cost nothing and settle the next three choices.
- **The follow link is the cheapest path to a second member.** Nine of eleven active teams are coach-only ([[2026-10-25-active-team-recount]]). An account is the wall; a link is not. Calendar first because it needs no identity; availability by link second because it does.
- **The winter break is a natural sharing moment.** A review card is the same loop as the lineup image (make → share → the strip carries the name), timed for when teams reflect.
- **Android follows web within the same week** — the ledger rule ([[web-android-parity]]) worked all month and keeps the closed test worth installing.

## Alternatives considered

- **Content push now** (more articles) — rejected until the index has had two weeks; fifteen articles already wait for impressions ([[growth-and-seo]]).
- **Magic-link accounts** — a lighter account is still an account; the per-player link tests the same hypothesis without a login flow.
- **Phase 3 now** — needs history in the skills data; with few active teams there is nothing to show.

## Measure

By 2026-12-15: follow links switched on (count), calendar subscriptions (count of ICS fetches), lineups shared and PDFs exported per active team, Search Console clicks against the October baseline (33 in three months). If the follow link stays at zero, the parents' product stops at the calendar and the winter goes to the review card and hygiene.

## Related

- [[2026-10-25-roadmap-coach-first-autumn-2026]] (completed), [[2026-10-26-follow-link-for-parents]], [[product-vision-and-roadmap]], [[open-questions]]
