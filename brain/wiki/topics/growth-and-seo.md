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
- **Store presence**: none yet. The Kotlin Android app exists but phase 5 (Play Store listing) is not started ([[native-app]]).

## Requirements

- Every core feature has its own crawlable page with the keyword in H1 and body.
- Everything shared out of the app carries the brand.
- No ads, no paywall, no App Store until the thresholds (growth design's "What NOT to Build").

## Decisions

- [[2026-03-02-growth-before-monetisation]]
- [[2026-03-02-share-images-from-hidden-components]]
- [[2026-03-04-landing-page-shows-the-app]]
- [[2026-03-13-android-app-in-kotlin-as-one-to-one-port]]

## Risks and tensions

- **The key metric is not measured in any source.** "Active teams" drives every threshold; the landing page counts `teams` rows (any team, ever), GTM events exist, but no page records a number after 2026-03-02.
- **Content versus product time.** Fifteen articles in six weeks, then nothing since April; whether they rank is unknown here.
- **Marketing honesty**: fictional quotes were removed the day they shipped; the counter is live. Any future social proof must be real.

## Open questions

- How many active teams now? Where is it measured? (Vercel Analytics, GTM, a Supabase query?)
- Which keywords rank, and did the blog bring registrations? Search Console data is outside the brain; a `raw/` export would answer it.
