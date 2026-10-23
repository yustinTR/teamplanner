---
type: entity
title: voetbal.nl / VoetbalAssist (fixture data source)
created: 2026-10-23
updated: 2026-10-23
tags: [integration, data-source, sync]
sources: ["[[2026-08-24-v2-sync-push-stats-design]]"]
---

# voetbal.nl / VoetbalAssist (fixture data source)

## What it is

voetbal.nl is the KNVB's public site for amateur fixtures, results and teams; VoetbalAssist is the club-website platform whose API and iCal feeds the project reads for match data. The design names *"de VoetbalAssist API"* and `getMatchesFromApi` + `getLocationsFromIcal` ([[2026-08-24-v2-sync-push-stats-design]]).

## Role in this project

The only external data integration. A coach links a team to a club abbreviation and team name once (team settings → import); the app then imports fixtures and, since 2026-08-24, refreshes them daily ([[2026-08-24-daily-cron-sync-reuses-the-parser]]).

## Key facts

- Parser: `src/lib/voetbal-nl-parser.ts`, server-side; routes under `src/app/api/import-voetbal-nl/`.
- Teams record `import_source`, `import_club_abbrev`, `import_team_name` (`PROJECT_CONTEXT.md`, design).
- There is no agreement with the KNVB or VoetbalAssist. Yustin on 2026-10-23: *"voetbalassist heb ik nog geen rechten voor omdat het achter een betaalmuur zit volgens mij"* ([[2026-10-23-open-questions-answered]]) — the integration reads data the project has no licence for, as far as he knows. The sync is deliberately polite (one call per club per day, sequential). Any change on their side breaks import silently for every linked team.

## Relationships

- [[voetbal-nl-integration]] — the topic
- [[supabase]], [[vercel]] — where the sync runs

## Open questions

- Whether a paid VoetbalAssist licence is needed or available, and at what cost; monitoring when the upstream format changes. → [[voetbal-nl-integration]]
