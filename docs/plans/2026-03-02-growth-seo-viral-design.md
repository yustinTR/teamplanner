# Growth Strategy: SEO + Viral + Content Marketing

## Context

TeamPlanner has <10 active teams. Goal: grow to 100+ teams to enable ad-based monetization (banner ads via Google AdSense). Current SEO foundation is solid (metadata, OG tags, landing page, feature pages). Biggest gaps: no structured data rich snippets, no viral loop in shared content, invite flow not optimized.

## Monetization Roadmap

1. **Phase 1 (now):** Focus 100% on user growth, no ads
2. **Phase 2 (100+ teams):** Add subtle banner ads on non-critical pages
3. **Phase 3 (500+ teams):** Play Store listing, consider freemium tier, evaluate App Store

## Section 1: SEO Quick Wins

### 1a. FAQPage Schema on Homepage
Add JSON-LD `FAQPage` structured data wrapping the existing 6-question FAQ section. Enables rich snippet display in Google search results. No visual changes.

### 1b. Performance Hints
Add `dns-prefetch` and `preconnect` for Supabase domain in root layout `<head>`. Improves Core Web Vitals (LCP/FCP) which is a Google ranking factor.

### 1c. Internal Links Between Feature Pages
Each feature page (`/features/wedstrijden`, `/features/beschikbaarheid`, `/features/opstellingen`, `/features/trainingen`) should link to related feature pages with "Bekijk ook" sections. Improves crawl depth and time-on-site.

### 1d. Google Search Console
Add verification meta tag to root layout. Monitor: indexed pages, search queries, crawl errors. Requires Google account setup (outside codebase).

## Section 2: Viral Loop

### 2a. "Powered by MyTeamPlanner" in Shared Content
Ensure all shared images (lineup cards, match reports) include a subtle but visible "myteamplanner.nl" watermark. Already partially present — make consistent across all share formats.

### 2b. WhatsApp Preview for Invite Links
The `/join/[code]` page needs optimized OG tags showing the team name and a welcoming message. When shared in WhatsApp, the preview should display: team name, "Je bent uitgenodigd!", and an attractive image. This is the #1 viral channel for amateur football.

### 2c. Invite Flow with Team Name
When a player opens an invite link, show the team name and coach name prominently: "Coach Willem nodigt je uit voor Be Fair 5". Currently shows a generic join screen. Higher conversion = more players per team.

### 2d. Google Play Store (deferred)
Wrap PWA as TWA via PWABuilder. Cost: one-time $25. Provides Play Store discoverability and trust factor. Do this when budget allows.

## Section 3: Content Marketing (later)

### 3a. Blog Section
Build `/blog` with 5-10 foundational articles targeting long-tail Dutch keywords:
- "Opstelling 7 tegen 7 voetbal"
- "Wisselschema jeugdvoetbal"
- "Team managen als trainer"
- "Beschikbaarheid bijhouden voetbalteam"

Each article links to relevant feature page + registration CTA.

### 3b. How-It-Works Video (optional)
1-2 minute screencast on landing page showing team creation → availability → lineup flow.

## Priority & Implementation Order

| # | Item | Effort | Impact | When |
|---|------|--------|--------|------|
| 1 | FAQPage schema | 10 min | Medium | Now |
| 2 | Performance hints (dns-prefetch) | 5 min | Low-Medium | Now |
| 3 | Internal links feature pages | 15 min | Medium | Now |
| 4 | WhatsApp preview invite link | 30 min | High | Now |
| 5 | "Powered by" in share images | 30 min | High | Now |
| 6 | Invite flow with team name | 1 hour | High | Soon |
| 7 | Google Search Console | 10 min | Medium | Soon (needs account) |
| 8 | Play Store listing | 2 hours | High | When budget allows ($25) |
| 9 | Blog section | Days | High (long-term) | Later |

## What NOT to Build

- No ads infrastructure yet (too few users)
- No freemium paywall (focus on growth first)
- No App Store submission (wait for revenue to cover $99/yr)
- No complex analytics (Vercel Analytics is sufficient for now)
