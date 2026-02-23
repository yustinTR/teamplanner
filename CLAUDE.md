# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TeamPlanner is a mobile-first PWA for amateur football team management, replacing WhatsApp-based coordination. Coaches manage teams, matches, lineups, and events; players submit availability. Built for simplicity — amateur football, not enterprise software.

**Current status: MVP largely complete.** Core features (auth, team management, matches, availability, lineup editor, events, voetbal.nl import) are built. See PROJECT_CONTEXT.md and CONVENTIONS.md for full specs.

## Commands

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
npm run storybook        # Start Storybook dev server (port 6006)
npm run test             # Run all tests (unit + storybook)
npm run test:unit        # Run unit tests only
npm run test:stories     # Run Storybook tests only (Playwright browser)
npm run test:watch       # Tests in watch mode
npm run test:e2e         # E2E tests (Playwright)

# Supabase
npx supabase start       # Local Supabase
npx supabase migration new <name>  # Create migration (never edit existing ones)
npx supabase gen types typescript --local > src/lib/supabase/types.ts  # Regenerate DB types

# shadcn/ui
npx shadcn@latest add <component>  # Add shadcn component
```

## Tech Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 (mobile-first, PostCSS) · shadcn/ui · Zustand (client state) + TanStack React Query (server state) · Supabase (Auth, PostgreSQL, Realtime, Storage, Edge Functions) · Storybook 10 (component testing) · Vitest + Playwright (browser tests) · dnd-kit (drag & drop) · Serwist (PWA/service worker) · Lucide React · Deployed on Vercel

## Architecture

### Atomic Design (`src/components/`)

All UI components follow Atomic Design with strict rules per level:

- **atoms/** — Pure presentation, no business logic, no API calls (Button, Avatar, Badge, Input, Card, Spinner, EmptyState, Textarea)
- **molecules/** — Combine atoms, may have local UI state, no API calls (PlayerChip, AvailabilityToggle, AvailabilitySummary, MatchForm, MatchScore, MatchStatusBadge, MatchPlayerForm, MatchPlayerChip, FormField, FormationSelector, PitchPlayer, BenchPlayer, PlayerAvailabilityRow, PlayerForm, PlayerMinutesBar, SubstitutionMomentCard, LoginForm, RegisterForm, TeamForm, InviteLink, EventForm, AttendanceToggle, AttendanceSummary, EventTaskItem, EventTaskForm)
- **organisms/** — Own state, hooks, and API calls allowed (AuthHydrator, NavigationBar, PlayerList, PlayerDetail, MatchCard, MatchList, AvailabilityGrid, MyAvailability, LineupField, LineupView, ImportPreview, SubstitutionPlan, EventCard, EventList, EventAttendanceGrid, EventTaskList, MyEventAttendance)
- **templates/** — Layout/structure only, receive children/slots, no data fetching
- **pages/** — Fetch data via hooks, pass to templates/organisms, connected to `app/` routes

Each component lives in its own PascalCase folder with `Component.tsx`, `Component.stories.tsx`, and `index.ts` (barrel export).

### Data Fetching Pattern

1. **Server Components** (default) — Initial data via `createServerClient()` from `@/lib/supabase/server`
2. **Client Components** — React Query for interactive/realtime data via `supabase` from `@/lib/supabase/client`
3. **Realtime** — Supabase channel subscriptions for live updates (e.g., availability grid); invalidate React Query cache on change

### Routing (`app/`)

```
app/(auth)/login, register, forgot-password  — Auth pages
app/reset-password                           — Password reset form
app/(main)/                                  — Main layout with bottom nav
  dashboard/                                 — Home/dashboard
  matches/, matches/[id]/                    — Match list & detail
  matches/[id]/lineup/                       — Lineup editor
  events/, events/[id]/                      — Event list & detail
  team/, team/players/[id]/                  — Team & player management
  team/settings/, team/settings/import/      — Team settings & voetbal.nl import
  create-team/                               — Create new team
  profile/                                   — User profile
app/join/[code]/                             — Invite link handler
app/auth/callback, app/auth/confirm          — Auth handlers
app/api/og/                                  — Dynamic OG image generation
app/api/import-voetbal-nl/                   — Voetbal.nl import API
```

### Database (Supabase PostgreSQL)

Tables: `teams` (with team_type, import_source), `players`, `matches`, `availability` (status: available/unavailable/maybe), `match_players` (selection, position, minutes), `lineups` (positions + substitution_plan as JSONB), `events`, `event_attendance`, `event_tasks`.

Roles: Coach (`created_by`) has full CRUD. Player (`user_id` in players) can update own availability/attendance. Unregistered players (`user_id = NULL`) are managed by coach.

### Hooks (`src/hooks/`)

9 React Query hooks: `use-team`, `use-players`, `use-matches`, `use-match-players`, `use-availability`, `use-lineup`, `use-events`, `use-event-attendance`, `use-event-tasks`.

### Utilities (`src/lib/`)

- `utils.ts` — cn(), formatters, etc.
- `constants.ts` — Formations (11v11 + 7v7), positions, labels
- `lineup-generator.ts` — Auto-generate lineups based on formation
- `voetbal-nl-parser.ts` — Parse voetbal.nl data for import

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
- Tailwind CSS v4: tokens defined as CSS custom properties in `src/styles/tokens.css` (no `tailwind.config.ts`)
- Use `class-variance-authority` (cva) for component variants
- Touch targets minimum 44x44px

### TypeScript

- Strict mode, no `any` (use `unknown`)
- Props as `interface`, not `type`
- Shared types in `src/types/` (team, player, match, availability, match-player, lineup, event)
- DB types generated via `supabase gen types typescript`

### Storybook & Testing

**Every component MUST have a Storybook story file (`Component.stories.tsx`).** No exceptions. This is the primary way components are documented and tested. Currently 49 story files across 8 atoms, 25 molecules, and 17 organisms.

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
- Run `npm run test:stories` to execute all story-based tests headlessly
- Run `npm run test:unit` for unit tests (utils, constants, stores)
- Run `npm run test` for all tests
- The `a11y` addon checks accessibility violations on every story

**Pre-commit checklist — before every commit, verify:**
1. `npm run build` — Production build succeeds without errors
2. `npm run lint` — No ESLint errors
3. `npm run test` — All tests pass (unit + storybook in Playwright headless browser)
4. Visually verify new/changed components in Storybook (`npm run storybook`)

**Do NOT commit code that:**
- Introduces components without stories
- Breaks existing Storybook stories
- Fails `npm run test`
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
