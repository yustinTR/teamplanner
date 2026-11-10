---
type: topic
title: Growth and SEO
created: 2026-10-23
updated: 2026-11-09
tags: [growth, seo, viral, marketing, blog]
sources: ["[[2026-02-26-seo-feature-pages-design]]", "[[2026-03-02-growth-seo-viral-design]]", "[[2026-03-04-landing-page-conversion-design]]", "[[2026-03-13-seo-blog-native-app-design]]"]
---

# Growth and SEO

## Where we stand

Growth is purely organic — *"geen ads-budget"* ([[2026-03-04-landing-page-conversion-design]]) — on two engines: Dutch long-tail SEO and a viral loop through [[whatsapp]]. The strategy is in [[2026-03-02-growth-seo-viral-design]]; its starting point was *"<10 active teams"* on 2026-03-02, with 100+ as the threshold for ads and 500+ for a freemium tier ([[2026-03-02-growth-before-monetisation]]).

What exists on 2026-10-23:

- **SEO content**: four feature pages ([[2026-02-26-seo-feature-pages-design]]), 15 blog articles (`src/lib/blog.ts`; 6 on 2026-03-02, 6 more on 2026-03-13, 3 on 2026-04-10), FAQ with `FAQPage` schema, Article JSON-LD, breadcrumbs, internal links, sitemap, `www` redirect and structured data (2026-04-10), Search Console fixes and Google Tag Manager with dataLayer events (2026-03-09), and *"SEO improvements for indexing and discoverability"* plus a sitemap cleanup (2026-09-16) — all git history.
- **Viral loop**: watermarked share images ([[2026-03-02-share-images-from-hidden-components]]), WhatsApp-optimised OG preview on `/join/[code]`, invite screen with team and coach name.
- **Conversion**: the 2026-03-04 landing page ([[2026-03-04-landing-page-shows-the-app]]), see [[onboarding-and-conversion]].
- **Store presence**: Android app in Google Play as a closed test since 2026-10-23; install path `/android` on the site, dismissible hint on the dashboard ([[native-app]]).
- **Search reality check (2026-10-25, Search Console + Vercel Analytics, last 3 months)**: 33 clicks, 528 impressions, average position 12, CTR 6%. Only **3 pages indexed, 20 "discovered – currently not indexed"** — the whole blog, including the hub, had never been crawled. Traffic in the last 28 days: ~86 direct visitors, 13 from Google, 10 Bing, 9 ChatGPT, 4 DuckDuckGo. The fifteen articles were written for an index that never picked them up.
- **Two weeks later (2026-11-09, [[2026-11-09-search-and-usage-reading]])**: 21 pages indexed, every blog article among them; 25 clicks and 1,130 impressions in 14 days (position 12.6, CTR 2.2%); Google referrals in Vercel up from 13 per 28 days to 25 per 14 days. `wisselschema-jeugdvoetbal` takes 10 of the 25 clicks. The three feature pages `opstellingen`, `trainingen`, `wedstrijden` had never been crawled; indexing requested that day. Usage did not move with it: 9 real active teams, no real follow link.
- **Same day, growth work (2026-11-09)**: in-article CTAs with the real share card on the top articles (live), tester recruitment in the app (live), and, after the KNVB migration was approved the same day, two free tools without an account — `/tools/wisselschema` and `/tools/opstelling` — plus `/maak`, the landing page now printed on every share image, and query tuning ("aanwezigheid app", "voetbaltrainer app") — all live by the evening. The `tool_*` events were added to the GTM trigger the same day (container version 4; import file `docs/analytics/gtm-app-events.json`). GTM had only forwarded `create_team`, `share_lineup` and `sign_up` to GA4 since March: the October funnel events never arrived. Fixed with one regex-triggered GA4 tag (container version 3).

## Requirements

- Every core feature has its own crawlable page with the keyword in H1 and body.
- Everything shared out of the app carries the brand.
- No ads, no paywall, no App Store until the thresholds (growth design's "What NOT to Build").

## Decisions

- [[2026-03-02-growth-before-monetisation]]
- [[2026-03-02-share-images-from-hidden-components]]
- [[2026-03-04-landing-page-shows-the-app]]
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]
- [[2026-10-23-active-team-definition]]

## Risks and tensions

- **The key metric is read by hand.** On 2026-10-23 there are **25 teams in the database** — *"25 database entries met verschillende teams"* ([[2026-10-23-open-questions-answered]]) — up from fewer than 10 on 2026-03-02. That is a row count, not an activity measure: it includes any test or abandoned team. The growth plan's thresholds speak of *active* teams, now defined — a match or event in the last 60 days and two or more linked players ([[2026-10-23-active-team-definition]]) — and counted: **11 active teams of 23** on 2026-10-25 under the corrected definition (coach use, not members; [[2026-10-25-active-team-means-coach-use]], [[2026-10-25-active-team-recount]]).
- **Content versus product time.** Fifteen articles in six weeks, then nothing since April; as of 2026-10-25 they do not rank because they were never indexed. Two causes fixed that day: no internal links from the feature pages to the blog (now a `RelatedArticles` block per feature), and no crawl demand — indexing was requested by hand for the hub and nine articles via URL inspection (quota ~10/day; the remaining ones follow). Measure again in two weeks before writing anything new. Measured on 2026-11-09: the fix worked, the blog is indexed and gets clicks, mostly from page two of the results ([[2026-11-09-search-and-usage-reading]]). New content is no longer blocked by indexing; the substitution-schedule topic is the one that pulls.
- **Format landing pages (2026-11-09)**: eight static pages, one per tool and KNVB format (`/tools/wisselschema/8-tegen-8`, `/tools/opstelling/6-tegen-6`, …) with the tool preset, KNVB facts and a FAQ, plus the article `speelvormen-jeugdvoetbal-knvb` linking them. The bet: format-specific queries ("wisselschema 8 tegen 8", "opstelling 6 tegen 6") are poorly served and every youth coach needs them. Content lives in `src/lib/format-pages.ts`. Read their impressions in the December Search Console reading.
- **Spread levers inside the product (2026-11-09)**: after a coach shares a lineup the app offers the parents' follow link (one tap, then share it), aimed at the zero real follow links; and a club-site widget (`/embed/<token>`, programme and results without player names) with a plain-HTML credit link next to the iframe, so a club site gives a real backlink. Both web live, the offer also on Android `main`.
- **Public exercise pages (2026-11-09)**: the 79 published exercises, until then behind the login, each got an indexable page (`/voetbaloefeningen/<slug>`), plus a hub and six age-group pages (`/voetbaloefeningen/leeftijd/jo8-jo9` … `senioren`) that follow the KNVB formats ([[2026-11-09-knvb-youth-match-formats]]). No migration was needed: the RLS policy on `exercises` already let the anon role read published rows. Each page ends in a sign-up prompt that returns the coach to the same exercise in the app (`exercise_cta_click`). The bet: "voetbaloefeningen", "oefeningen JO10" and named drills ("rondo 4 tegen 2") are weekly searches for every trainer. Read them in the December Search Console reading next to the format pages.
- **GTM container version 5 (2026-11-09)**: the import file with every event so far (tools, season card, text share, tool handoff, embed code, exercise CTA) and the `source` parameter is live; from this date GA4 receives the whole funnel.
- **Calendar subscription on the follow link (2026-11-10)**: the follow page offers "Zet de wedstrijden in je agenda" (Apple via `webcal://`, Google, or copy the link) for an `.ics` feed at `/volg/<token>/agenda.ics`. Events run from gathering time to the end of the match, with location and a link back to the follow page; no player names. The feed reuses `get_public_team_view`, so it covers matches from 14 days back onward (older ones drop out of subscribed calendars) and stops when the coach turns the link off. Matches only; trainings and events are not in the RPC. Measured as `calendar_subscribe` (GTM import file updated, not yet imported). The bet: a parent who subscribes sees MyTeamPlanner every match week without anyone sharing anything.
- **Reminder for players who have not answered (2026-11-10)**: under the availability grid of an upcoming match the coach gets "Herinner wie nog niet reageerde (n)", which shares one ready-made message for the team chat naming who has not answered, with a link to the match. It replaces the coach typing the names by hand in WhatsApp, the habit the product is meant to take over. Measured as `availability_reminder` (GTM import file updated, not yet imported). The bet: every reminder puts a MyTeamPlanner link in front of the whole team, including players and parents without an account.
- **Search does not yet show up in usage.** Three real teams were created in the same two weeks, but whether search brought them is unknown until the GTM funnel is read.
- **Marketing honesty**: fictional quotes were removed the day they shipped; the counter is live. Any future social proof must be real.

## Open questions

- Log the count monthly in [[2026-10-23-active-team-count]]; the first reading says the invite step, not acquisition, is the bottleneck.
- Which keywords rank, and did the blog bring registrations? Search Console data is outside the brain; a `raw/` export would answer it.
