# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TeamPlanner is a mobile-first PWA for amateur football team management, replacing WhatsApp-based coordination. Coaches manage teams, matches, and lineups; players submit availability. Built for simplicity — amateur football, not enterprise software.

**Current status: Phase 0 — Setup & Design System.** Next.js project not yet initialized. See PROJECT_CONTEXT.md and CONVENTIONS.md for full specs.

## Commands

Not yet configured (Phase 0). Once initialized, expected commands:

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
npm run test             # Vitest + React Testing Library
npx vitest run <path>    # Run a single test file

# Supabase
supabase start           # Local Supabase
supabase migration new <name>  # Create migration (never edit existing ones)
supabase gen types typescript  # Regenerate database types → src/lib/supabase/types.ts

# shadcn/ui
npx shadcn-ui add <component>  # Add shadcn component
```

## Tech Stack

Next.js 14+ (App Router) · TypeScript (strict) · Tailwind CSS (mobile-first) · shadcn/ui · Zustand (client state) + TanStack React Query (server state) · Supabase (Auth, PostgreSQL, Realtime, Storage, Edge Functions) · dnd-kit (drag & drop) · Serwist (PWA/service worker) · Vitest · Lucide React · Deployed on Vercel

## Architecture

### Atomic Design (`src/components/`)

All UI components follow Atomic Design with strict rules per level:

- **atoms/** — Pure presentation, no business logic, no API calls (Button, Avatar, Badge, Input, Card, Spinner, etc.)
- **molecules/** — Combine atoms, may have local UI state, no API calls (PlayerChip, AvailabilityToggle, MatchScore, FormField, etc.)
- **organisms/** — Own state, hooks, and API calls allowed (PlayerList, MatchCard, AvailabilityGrid, LineupField, NavigationBar, etc.)
- **templates/** — Layout/structure only, receive children/slots, no data fetching
- **pages/** — Fetch data via hooks, pass to templates/organisms, connected to `app/` routes

Each component lives in its own PascalCase folder with `Component.tsx`, `Component.test.tsx`, and `index.ts` (barrel export).

### Data Fetching Pattern

1. **Server Components** (default) — Initial data via `createServerClient()` from `@/lib/supabase/server`
2. **Client Components** — React Query for interactive/realtime data via `supabase` from `@/lib/supabase/client`
3. **Realtime** — Supabase channel subscriptions for live updates (e.g., availability grid); invalidate React Query cache on change

### Routing (`app/`)

```
app/(auth)/login, register     — Auth pages
app/(main)/                    — Main layout with bottom nav
  page.tsx                     — Dashboard
  matches/, matches/[id]/      — Match list & detail
  matches/[id]/lineup/         — Lineup editor
  team/, team/players/[id]/    — Team & player management
  team/settings/               — Team settings
  profile/                     — User profile
app/join/[code]/               — Invite link handler
```

### Database (Supabase PostgreSQL)

Tables: `teams`, `players`, `matches`, `availability` (status: available/unavailable/maybe), `lineups` (positions as JSONB: `[{player_id, x, y, position_label}]`).

Roles: Coach (`created_by`) has full CRUD. Player (`user_id` in players) can update own availability. Unregistered players (`user_id = NULL`) are managed by coach.

## Key Conventions

### Language Split

- **Code** (variables, functions, comments): English
- **UI text** (labels, placeholders, error messages): Dutch (Nederlands)
- **Commit messages**: English (Conventional Commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`)

### Naming

| What | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `player-chip.tsx` |
| Component folders | PascalCase | `PlayerChip/` |
| Components | PascalCase | `export function PlayerChip` |
| Hooks | camelCase with `use` prefix | `useMatches` |
| Types/Interfaces | PascalCase | `Player`, `MatchDetail` |
| DB tables & columns | snake_case | `match_date`, `player_id` |

### Styling

- Always mobile-first (start at 375px, add `sm:`, `md:`, `lg:` breakpoints)
- Use Tailwind classes mapped to design tokens — no hardcoded colors/spacing values
- Tokens defined in `tailwind.config.ts` → `theme.extend` (extend only, never override defaults)
- Use `class-variance-authority` (cva) for component variants
- Touch targets minimum 44x44px

### TypeScript

- Strict mode, no `any` (use `unknown`)
- Props as `interface`, not `type`
- Shared types in `src/types/`
- DB types generated via `supabase gen types typescript`

### Git

- Branches: `main` (prod), `develop`, `feature/[name]`, `fix/[name]`
- Conventional Commits format

## What NOT to Build

- No features outside MVP scope without explicit request
- No custom auth — use Supabase Auth exclusively
- No GraphQL — Supabase client is sufficient
- No desktop-first — always mobile-first
- No over-engineering — keep it simple for amateur football