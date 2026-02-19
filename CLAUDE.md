# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TeamPlanner is a mobile-first PWA for amateur football team management, replacing WhatsApp-based coordination. Coaches manage teams, matches, and lineups; players submit availability. Built for simplicity — amateur football, not enterprise software.

**Current status: Phase 0 — Setup & Design System complete.** See PROJECT_CONTEXT.md and CONVENTIONS.md for full specs.

## Commands

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
npm run storybook        # Start Storybook dev server (port 6006)
npx vitest               # Run all tests (Storybook stories via Playwright browser)

# Supabase
npx supabase start       # Local Supabase
npx supabase migration new <name>  # Create migration (never edit existing ones)
npx supabase gen types typescript --local > src/lib/supabase/types.ts  # Regenerate DB types

# shadcn/ui
npx shadcn@latest add <component>  # Add shadcn component
```

## Tech Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 (mobile-first) · shadcn/ui · Zustand (client state) + TanStack React Query (server state) · Supabase (Auth, PostgreSQL, Realtime, Storage, Edge Functions) · Storybook 10 (component testing) · Vitest + Playwright (browser tests) · dnd-kit (drag & drop) · Serwist (PWA/service worker) · Lucide React · Deployed on Vercel

## Architecture

### Atomic Design (`src/components/`)

All UI components follow Atomic Design with strict rules per level:

- **atoms/** — Pure presentation, no business logic, no API calls (Button, Avatar, Badge, Input, Card, Spinner, etc.)
- **molecules/** — Combine atoms, may have local UI state, no API calls (PlayerChip, AvailabilityToggle, MatchScore, FormField, etc.)
- **organisms/** — Own state, hooks, and API calls allowed (PlayerList, MatchCard, AvailabilityGrid, LineupField, NavigationBar, etc.)
- **templates/** — Layout/structure only, receive children/slots, no data fetching
- **pages/** — Fetch data via hooks, pass to templates/organisms, connected to `app/` routes

Each component lives in its own PascalCase folder with `Component.tsx`, `Component.stories.tsx`, and `index.ts` (barrel export).

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

### Storybook & Testing

**Every component MUST have a Storybook story file (`Component.stories.tsx`).** No exceptions. This is the primary way components are documented and tested.

**Component folder structure:**
```
src/components/atoms/Button/
├── Button.tsx              → Component
├── Button.stories.tsx      → Storybook stories (REQUIRED)
├── index.ts                → Barrel export
```

**Story requirements:**
- Every component variant must have its own story
- Use `args` for interactive controls
- Test all sizes, states (disabled, loading), and edge cases
- Stories serve as living documentation — write them as if they're examples for other developers

**Testing workflow (Vitest + Playwright browser):**
- Stories are automatically run as tests via `@storybook/addon-vitest` with Playwright browser
- Run `npx vitest` to execute all story-based tests headlessly
- The `a11y` addon checks accessibility violations on every story

**Pre-commit checklist — before every commit, verify:**
1. `npm run build` — Production build succeeds without errors
2. `npm run lint` — No ESLint errors
3. `npx vitest run` — All Storybook tests pass (runs stories in Playwright headless browser)
4. Visually verify new/changed components in Storybook (`npm run storybook`)

**Do NOT commit code that:**
- Introduces components without stories
- Breaks existing Storybook stories
- Fails `npx vitest run`
- Has TypeScript or lint errors

### Git

- Branches: `main` (prod), `develop`, `feature/[name]`, `fix/[name]`
- Conventional Commits format

## What NOT to Build

- No features outside MVP scope without explicit request
- No custom auth — use Supabase Auth exclusively
- No GraphQL — Supabase client is sufficient
- No desktop-first — always mobile-first
- No over-engineering — keep it simple for amateur football