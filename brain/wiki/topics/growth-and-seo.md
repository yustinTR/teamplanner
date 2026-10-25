---
type: topic
title: Growth and SEO
created: 2026-10-23
updated: 2026-10-23
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
- **Content versus product time.** Fifteen articles in six weeks, then nothing since April; as of 2026-10-25 they do not rank because they were never indexed. Two causes fixed that day: no internal links from the feature pages to the blog (now a `RelatedArticles` block per feature), and no crawl demand — indexing was requested by hand for the hub and nine articles via URL inspection (quota ~10/day; the remaining ones follow). Measure again in two weeks before writing anything new.
- **Marketing honesty**: fictional quotes were removed the day they shipped; the counter is live. Any future social proof must be real.

## Open questions

- Log the count monthly in [[2026-10-23-active-team-count]]; the first reading says the invite step, not acquisition, is the bottleneck.
- Which keywords rank, and did the blog bring registrations? Search Console data is outside the brain; a `raw/` export would answer it.
