---
type: entity
title: Vercel
created: 2026-10-23
updated: 2026-10-23
tags: [hosting, deployment, cron]
sources: ["[[2026-02-xx-project-documentatie-v1]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Vercel

## What it is

Hosting for the Next.js app: deploys from GitHub, preview per pull request, cron jobs, analytics.

## Role in this project

Production and preview hosting, the daily sync cron (`vercel.json`), and the planned reminder cron for push. Chosen in February for *"Gratis, instant deploys, edge functions"* ([[2026-02-xx-project-documentatie-v1]]).

## Key facts

- Hobby tier; the February budget expects €20/month on growth.
- Secrets for the cron and the service-role client live in Vercel environment variables (names in [[2026-08-24-daily-cron-sync-reuses-the-parser]]).
- CI is GitHub Actions (`.github/workflows/ci.yml`, `e2e.yml`), not Vercel checks; Sentry and Lighthouse CI from the February plan were never set up.
- Vercel Analytics is the only product analytics; the growth design judged it *"sufficient for now"* ([[2026-03-02-growth-seo-viral-design]]). Google Tag Manager was added on 2026-03-09 (git history).

## Relationships

- [[supabase]], [[myteamplanner-nl]]

## Open questions

- None.
