---
type: source
title: Working session — Yustin answers the brain's open questions
created: 2026-10-23
updated: 2026-10-23
tags: [session, decisions, parity, monetisation, roadmap]
source_file: "none — chat session of 2026-10-23, answers quoted verbatim below; not filed in raw/"
source_date: 2026-10-23
language: nl
participants: [Yustin Troost]
sources: []
---

# Working session — Yustin answers the brain's open questions

## Summary

After the initial ingest, Yustin answered the open questions in one chat message. Seven reasons that were only visible in git history are now sourced; five parity and product choices are decided; three facts about the environment are recorded. Two questions were not answered (voetbal.nl import on Android; review and provenance of the seeded exercises) and stay open. The quotes below are the record; everything else in this page is a pointer to where the answer landed.

## Key points (verbatim, with where it went)

| # | Question | Answer (verbatim) | Landed in |
|---|---|---|---|
| 1 | Domain | *"teamplanner.nl is bezet dus dit leek mij de meest logische oplossing"* | [[myteamplanner-nl]] |
| 2 | `html2canvas-pro` | *"geen idee die keuze heb ik niet nadrukkelijk gemaakt"* | [[2026-03-02-share-images-from-hidden-components]] |
| 3 | Fictional quotes removed | *"omdat ik geen nep content wil"* | [[2026-03-04-landing-page-shows-the-app]] |
| 4 | Expo → Kotlin | *"omdat de native route mij toch een beter en leuker idee leek"* | [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]] |
| 5 | `show_ratings` | *"ja de show_ratings toggle kreeg ik als feedback omdat sommige teams het niet wilde"* | [[statistics-and-fair-playing-time]], [[be-fair]] |
| 6 | EA FC skills | *"omdat we dat toen een leuker idee vonden dat het beetje leek op fifa kaartjes"* | [[2026-02-26-skills-as-jsonb-without-history]] |
| 7 | Admin role | *"dat er dus sommige dingen aangepast moesten worden zonder dat iedereen erbij kon"* | [[2026-03-12-admins-share-coach-rights]] |
| 8 | Share image size on Android | *"dat is een keuze die jij beter kan maken"* — delegated | [[2026-10-23-android-share-image-matches-the-web-card]] |
| 9 | Onboarding on Android | *"ja ook op android"* | [[web-android-parity]] |
| 10 | Match report sharing on Android | *"mag ook op android als dat kan"* | [[web-android-parity]] |
| 11 | voetbal.nl import on Android | *"voetbal.nl import ook op android, maar ook via web-app"* (second message) | [[web-android-parity]] |
| 12 | Push channel | *"liefst wel allebei apart pushen zodat sommige dingen in de ontwikkeling anders kunnen blijven en daarbij heeft web voorrang op android"* | [[2026-10-23-push-per-client-web-first]] |
| 13 | Parent/carer view | *"uitgesteld"* | [[product-vision-and-roadmap]] |
| 14 | Carpool, PDF export | *"uitgesteld"* | [[product-vision-and-roadmap]] |
| 15 | Active teams | *"nu zijn er 25 actieve teams wat blijkt uit de database"*, clarified in the second message: *"ik heb 25 database entries met verschillende teams"* — 25 team rows, not an activity measure | [[growth-and-seo]], [[overview]] |
| 16 | Written feedback | *"nee nog niet"* | [[open-questions]] |
| 17 | Ads | *"ads komen pas als alles 100% up en running is en het veel meer gebruikers heeft"* | [[monetisation]] |
| 18 | Seasons | *"ja en een nieuw voetbalseizoen begint vaak in augustus en eindigt in juli"* | [[2026-10-23-statistics-per-season-august-to-july]] |
| 19 | Figma | *"figma mag geschrapt worden het volledige design mag component based in storybook"* | [[2026-10-23-storybook-is-the-design-system-figma-dropped]] |
| 20 | Seeded exercises reviewed; KNVB material used | *"ja en ja"* (second message) | [[training-content]], [[knvb-rinus]] |
| 21 | VoetbalAssist terms | *"voetbalassist heb ik nog geen rechten voor omdat het achter een betaalmuur zit volgens mij"* | [[voetbal-nl]], [[voetbal-nl-integration]] |
| 21b | Alert when the daily sync fails | *"ja"* (second message) | [[voetbal-nl-integration]] |
| 22 | Deleting player data | *"nee maar het moet wel kunnen"* | [[data-model-and-permissions]] |
| 23 | iOS | *"ooit komt er ook een ios client maar ios licentie vind ik nog te duur dus voorlopig blijft bij pwa en android"* | [[native-app]], [[2026-02-19-pwa-over-native-app]] |

A second message the same day answered 11, 20 and the sync-alert half of 21, and clarified 15. Still unaddressed: the children-and-ads half of 17, and what "active" should mean once it is measured.

## Requirements raised

- Onboarding checklist and hints, match-report sharing, and the voetbal.nl import must exist on Android; the web keeps all of them.
- Push is built per client; web first.
- Statistics are grouped per season, August to July.
- Deleting a player's data must be possible, even without a written retention rule.
- A failed daily sync must raise an alert.

## Decisions made

- [[2026-10-23-android-share-image-matches-the-web-card]]
- [[2026-10-23-push-per-client-web-first]]
- [[2026-10-23-statistics-per-season-august-to-july]]
- [[2026-10-23-storybook-is-the-design-system-figma-dropped]]

## What was built

Nothing; this is a session, not a plan. The ledger rows and topic pages now carry the decisions.

## Open questions

- Ads and children — see [[open-questions]].
- "Active team" is still undefined: the 25 are rows in `teams`, including test and abandoned teams, if any.
