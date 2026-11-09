---
type: note
title: November reading — the index caught up, usage did not move
created: 2026-11-09
updated: 2026-11-09
question: Two weeks after the indexing fixes of 2026-10-25, what changed in search and in use?
tags: [growth, seo, metrics, active-teams]
sources: ["[[2026-10-26-roadmap-extension-winter-2026-27]]", "[[2026-10-25-active-team-recount]]", "[[growth-and-seo]]"]
---

# November reading — the index caught up, usage did not move

The "measure" row of [[2026-10-26-roadmap-extension-winter-2026-27]], read one day early. Sources: Search Console and Vercel Web Analytics (both through Yustin's browser / the Vercel MCP), a Supabase query. Window: 2026-10-26 to 2026-11-08 unless stated.

## Answer

**Search works now; usage is flat.** Google indexes 21 pages (3 on 2026-10-25) and sends daily traffic to the blog. Real active teams: 9, one fewer than the October figure once the two emulator test teams are taken out. No real team has switched on the follow link.

### Search Console

| Measure | 3 months to 2026-10-25 | 2026-10-26 – 11-08 (14 days) |
|---|---|---|
| Clicks | 33 | 25 |
| Impressions | 528 | 1,130 |
| CTR | 6% | 2.2% |
| Average position | 12 | 12.6 |
| Indexed pages | 3 | 21 |
| Discovered – not indexed | 20 (all blog) | 5 (three feature pages, privacy, terms) |

Clicks per page: `wisselschema-jeugdvoetbal` 10 (356 impressions), `opstelling-maken-voetbal` 3, `opstelling-7-tegen-7-voetbal` 3, `spelers-beoordelen-jeugdtrainer` 3, `voetbal-training-oefeningen` 2 (199 impressions), four more with 1. Top queries by impressions, none with a visible click: *aanwezigheid app*, *voetbal opstelling*, *voetbal oefeningen voor thuis*, *voetbal training oefeningen jeugd*, *hoe maak je een wisselschema*, *voetbaltrainer app*, *voetbal coach app*, *teamplanner*. The three "crawled – not indexed" entries are two font files and the favicon (harmless); three "page with redirect" are the non-`www` variants.

New finding: `/features/opstellingen`, `/features/trainingen` and `/features/wedstrijden` were **never indexed** — discovered, not crawled. Indexing requested for all three on 2026-11-09. All fifteen blog articles are out of the not-indexed lists, so the remaining indexing requests from October are no longer needed.

### Vercel Web Analytics (production)

| Referrer | 28 days to 2026-10-25 | 14 days since 2026-10-26 |
|---|---|---|
| Direct | ~86 | 87 |
| Google (web + app) | 13 | 25 |
| Bing | 10 | 6 |
| DuckDuckGo / Yahoo | 4 | 2 |

Google traffic per day roughly quadrupled. Funnel events (`save_lineup`, `share_*`, `export_pdf`) are not readable here: Vercel custom events need a Pro plan, and the events go to GTM — that half of the measure row is still open.

### Supabase (2026-11-09, emulator test teams excluded)

| Measure | Count |
|---|---|
| Teams | 25 (+3 real since 2026-10-26) |
| Active (match/event ±60 days or lineup edit 60 days) | 9 |
| … with two or more linked members | 2 |
| Lineup edited in the last 60 days | 5 |
| Teams with five or more players | 13 |
| Follow links on | 0 (both existing tokens are the emulator teams) |
| Users / new since 2026-10-26 / signed in last 14 days | 44 / 3 / 4 |

## Reasoning

- **The October diagnosis was right.** Missing crawl demand and missing internal links kept the blog out of the index; after the manual requests and `RelatedArticles`, every article got in within two weeks and impressions doubled in a fortnight against the previous quarter. CTR halved because the new impressions sit on page two (position ~12).
- **One topic carries search.** The substitution-schedule article earns 40% of clicks. Its reader has exactly the problem the substitution-plan share card solves.
- **Search is not yet converting.** Three new real teams in two weeks against 25 search visitors is plausible as a link, but nothing ties them together; with GTM unread there is no evidence either way.
- **Correction to October.** The recount of 2026-10-25 ([[2026-10-25-active-team-recount]]) counted 11 active of 23 including "Emulator testteam"; the real figure then was 10. Today it is 9. Counts from now on exclude teams named `Emulator%`.
- **Follow link trigger not met.** The ICS feed waits for three real teams with the link on; there are none.

## Next reading

2026-11-25 for the active-team count, as planned; Search Console again in early December, when the feature pages should be in. Before that, read the GTM funnel once.
