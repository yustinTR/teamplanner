---
type: decision
title: Roadmap for autumn 2026 — coach-first, measure before building more
created: 2026-10-25
updated: 2026-10-25
status: completed 2026-10-26 — continued by [[2026-10-26-roadmap-extension-winter-2026-27]]
decided_by: Yustin Troost, 2026-10-25, accepting the assistant's proposal and asking it to execute autonomously ("kan je dan uit je zelf verder met alle nieuwe dingen en een aangepast roadmap opstellen")
supersedes: ""
tags: [roadmap, product-vision, growth, android]
sources: ["[[2026-10-25-active-team-recount]]", "[[2026-10-25-active-team-means-coach-use]]", "[[growth-and-seo]]"]
---

# Roadmap for autumn 2026 — coach-first, measure before building more

## Decision

For the coming weeks and months the order of work is:

1. **Sharpen the coach-alone path** (now – mid November). The share image carries a "Gemaakt met MyTeamPlanner" strip on both clients ([[2026-10-25-made-with-strip-on-share-images]]); the substitution plan can be shared as an image too; sharing is reachable from the match list — both done on web and Android on 2026-10-26. Every shared picture is the product's only advertisement in the group chats where coaches already are.
2. **See what happens** (parallel, small). Funnel events in the existing GTM dataLayer (team created, first match, lineup saved, image shared) so the monthly active-team reading stops being a hand-run query; crash visibility through Play's Android vitals and Vercel runtime errors — no Sentry account exists yet, so Sentry waits for Yustin.
3. **Android catches up in code, not on a device** (November). The five "unverified" ledger rows — multi-team switcher, skills editor, plan creation, Realtime availability, stats filter — are checked in the Kotlin source and built where missing, then shipped as the next closed-test release together with the share strip and the profile links.
4. **Coach-alone conveniences** (late November – December): PDF export of lineup and programme for the dressing-room wall (web shipped 2026-10-26, Android owed); a read-only parent/carer view by link, no account, as the low-friction answer to "do coach-only teams want members?" (web shipped 2026-10-26: [[2026-10-26-follow-link-for-parents]]).
5. **Search: measure, then decide** (mid November). Re-read Search Console two weeks after the 2026-10-25 indexing requests; only if the fifteen articles get impressions is new content worth writing. Backlinks from the club and trainer communities are Yustin's job.

Explicitly **not** now: roadmap phases 3 and 4 (player development, AI layer) — they need data from many teams; carpool; new blog articles before the measurement; Play production access chasing — the closed test is the channel until twelve real users accumulate ([[native-app]]).

## Context

On 2026-10-25 eleven of 23 teams are active and nine of them are run by the coach alone ([[2026-10-25-active-team-recount]]); the coach plans and shares the lineup into WhatsApp. The February vision ("replace the group chat") and the March vision ("assistent-coach") both assumed a whole team on the app; the data says the single coach is the dominant user today. Reach is the binding constraint: three indexed pages, 33 search clicks in three months ([[growth-and-seo]]). So the plan optimises the loop the product already has — coach makes something, shares it, the picture carries the name — and holds everything that needs a crowd.

## Alternatives considered

- **Push on with the February roadmap (phases 3–4).** Rejected: nothing to learn from yet.
- **Invest in the invite/onboarding funnel first.** Rejected as the *first* move: it presumes coach-only teams are failures, which Yustin rejected ([[2026-10-25-active-team-means-coach-use]]); it comes back as the parent view in step 4.
- **Spend the weeks on Play production access.** Rejected: twelve testers will not be recruited; the closed test already installs from the Store.

## Consequences

- Work order for the assistant until told otherwise; each step lands as its own commits with the brain updated.
- The Android app gets its first content release after the store launch (versionCode 5) from step 3.
- A review point mid November: Search Console numbers, funnel events, closed-test tester count.
