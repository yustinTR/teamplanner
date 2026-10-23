---
type: decision
title: Supabase as the whole backend
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, technical call, February 2026
supersedes: ""
tags: [backend, supabase, auth, database]
sources: ["[[2026-02-xx-project-documentatie-v1]]"]
---

# Supabase as the whole backend

## Decision

Auth, database, realtime and storage come from [[supabase]]; there is no custom backend, no custom auth and no GraphQL.

## Context

A solo side project needs the backend to be free, hosted and done. The February document's motivation column reads *"Auth, Realtime, RLS, gratis tier"* ([[2026-02-xx-project-documentatie-v1]]); `PROJECT_CONTEXT.md` adds *"Gratis tier is ruim."* Authorisation is expressed as Row Level Security so the client can talk to the database directly, and the availability grid updates live through Realtime — the *"killer feature"* flow in `PROJECT_CONTEXT.md`.

## Alternatives considered

- **Custom Node/Postgres backend.** Full control, but auth, realtime and hosting would each be work and cost. Lost on effort.
- **Firebase.** Comparable managed stack, but a document store makes the relational model (teams, players, matches, availability, lineups) and RLS-style rules harder. Not discussed in any source (unsourced); listed here because it is the obvious rival.

## Consequences

- Authorisation logic lives in SQL policies and `SECURITY DEFINER` helpers, which bit early: two migrations on 2026-02-19 fix recursive RLS policies (`supabase/migrations/20260219175136_*`, `20260219175225_*`).
- Server-side jobs without a user session need the service-role key, kept server-only ([[2026-08-24-daily-cron-sync-reuses-the-parser]]).
- Remote-only project; migrations are applied through the Supabase MCP tool, never a local instance (`CLAUDE.md`).
- The membership model ended up *being* the `players` table ([[2026-03-02-players-table-as-team-membership]]).

## Where it lives in the code

- `src/lib/supabase/` (server, client, admin clients, generated types)
- `supabase/migrations/`
- Rules in `CLAUDE.md` ("No custom auth", "No GraphQL")
