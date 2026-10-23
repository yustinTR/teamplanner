---
type: entity
title: Supabase
created: 2026-10-23
updated: 2026-10-23
tags: [backend, hosting, auth, database]
sources: ["[[2026-02-xx-project-documentatie-v1]]"]
---

# Supabase

## What it is

Hosted Postgres with Auth, Row Level Security, Realtime, Storage and Edge Functions. The whole backend ([[2026-02-19-supabase-as-the-backend]]).

## Role in this project

Auth (e-mail + password, reset), the database with RLS as the authorisation layer, Realtime for the availability grid, Storage for player photos and team logos. Edge Functions were planned for push in February and dropped in the August design in favour of Next.js routes ([[2026-08-24-web-push-via-service-worker]]).

## Key facts

- Remote project only, no local instance; migrations through the MCP tool (`CLAUDE.md`). Project id is in `CLAUDE.md`, keys in Vercel and `.env.local`, never here.
- Free tier, *"ruim"* for now (`PROJECT_CONTEXT.md`); the February budget expects €25/month on growth ([[2026-02-xx-project-documentatie-v1]]).
- Recursive-RLS fixes on day one and `SECURITY DEFINER` helpers (`get_my_team_ids`, `is_team_admin`) are the accumulated authorisation design. See [[data-model-and-permissions]].

## Relationships

- [[vercel]], [[voetbal-nl]]

## Open questions

- Free-tier pausing of inactive projects and the 500 MB limit are not discussed anywhere; relevant once the user base grows. → [[open-questions]]
