# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TeamPlanner is a mobile-first PWA for amateur football team management, replacing WhatsApp-based coordination. Coaches manage teams, matches, lineups, events, and training plans; players submit availability. Built for simplicity — amateur football, not enterprise software.

**Current status: MVP complete + growth features.** Core features are built: auth, multi-team support, matches with score editing, availability, lineup editor with image sharing, events, player skills/ratings, training exercises library, onboarding, blog, SEO feature pages, voetbal.nl import, and Framer Motion animations throughout. See PROJECT_CONTEXT.md and CONVENTIONS.md for full specs.

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

# Supabase (remote — no local instance)
# Project ID: zonxfimxwqgpgycblvcg
npx supabase migration new <name>  # Create migration file (never edit existing ones)
# Apply migrations via MCP Supabase tool (apply_migration) — not via local CLI
# Regenerate types via MCP Supabase tool (generate_typescript_types) → write to src/lib/supabase/types.ts

# shadcn/ui
npx shadcn@latest add <component>  # Add shadcn component
```

## Tech Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 (mobile-first, PostCSS) · shadcn/ui · Zustand (client state) + TanStack React Query (server state) · Supabase (Auth, PostgreSQL, Realtime, Storage, Edge Functions) · Storybook 10 (component testing) · Vitest + Playwright (browser tests) · dnd-kit (drag & drop) · Framer Motion (animations) · Recharts (radar charts) · html2canvas-pro (image sharing) · Serwist (PWA/service worker) · Lucide React · Deployed on Vercel

## Architecture

### Atomic Design (`src/components/`)

All UI components follow Atomic Design with strict rules per level:

- **atoms/** — Pure presentation, no business logic, no API calls (12 components: AnimatedList, Avatar, Badge, Button, Card, EmptyState, Input, NumberCounter, PlayerCard, Skeleton, Spinner, Textarea)
- **molecules/** — Combine atoms, may have local UI state, no API calls (45 components including PlayerChip, AvailabilityToggle, MatchForm, FormationSelector, PitchPlayer, BenchPlayer, SkillsRadar, SkillsEditor, OnboardingChecklist, OnboardingHint, ShareLineupCard, ShareMatchReport, TeamSwitcher, ExerciseCard, TrainingPlanCard, FaqSection, PlayerCardDisplay, PhotoUpload, and more)
- **organisms/** — Own state, hooks, and API calls allowed (26 components including AuthHydrator, NavigationBar, PlayerList, PlayerDetail, MatchCard, MatchList, AvailabilityGrid, LineupField, LineupView, SubstitutionPlan, EventList, ExerciseList, TrainingPlanList, MatchStatsEditor, PlayerStatsSection, MarketingHeader, MarketingFooter, and more)
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
app/(main)/                                  — Main layout with bottom nav + team switcher
  dashboard/                                 — Home/dashboard with onboarding checklist
  matches/, matches/[id]/                    — Match list (tabs) & detail (score editing, sharing)
  matches/[id]/lineup/                       — Lineup editor
  events/, events/[id]/                      — Event list & detail
  team/, team/players/[id]/                  — Team & player management (skills radar)
  team/settings/, team/settings/import/      — Team settings & voetbal.nl import
  trainingen/                                — Training plans overview
  trainingen/oefeningen/, oefeningen/[id]/   — Exercise library & detail
  trainingen/plannen/[id]/                   — Training plan detail
  create-team/                               — Create new team
  profile/                                   — User profile
app/join/[code]/                             — Invite link handler (with OG metadata)
app/features/beschikbaarheid, opstellingen, wedstrijden, trainingen — SEO feature pages
app/blog/, blog/[slug]/                      — Blog with 6 SEO articles
app/privacy/, app/voorwaarden/               — Legal pages
app/auth/callback, app/auth/confirm          — Auth handlers
app/api/og/                                  — Dynamic OG image generation
app/api/import-voetbal-nl/                   — Voetbal.nl import API
app/api/travel-time/                         — Travel time calculation API
```

### Database (Supabase PostgreSQL)

Tables: `teams` (with team_type, import_source, default_gathering_minutes), `players` (with skills JSONB, role, detailed_position), `matches`, `availability` (status: available/unavailable/maybe), `match_players` (selection, position, minutes), `match_stats` (goals, assists, yellow/red cards), `lineups` (positions + substitution_plan as JSONB), `events`, `event_attendance`, `event_tasks`, `exercises` (training exercises library), `exercise_categories`.

Roles: Coach (`created_by`) has full CRUD. Player (`user_id` in players) can update own availability/attendance. Unregistered players (`user_id = NULL`) are managed by coach. Users can belong to multiple teams (multi-team support).

### Hooks (`src/hooks/`)

16 React Query hooks: `use-team`, `use-players`, `use-matches`, `use-match-players`, `use-match-stats`, `use-availability`, `use-lineup`, `use-events`, `use-event-attendance`, `use-event-tasks`, `use-exercises`, `use-training-plans`, `use-training-plan-exercises`, `use-player-stats`, `use-player-photo`, `use-share-image`.

### Utilities (`src/lib/`)

- `utils.ts` — cn(), formatters, etc.
- `constants.ts` — Formations (11v11 + 7v7), positions, labels, player skills
- `animations.ts` — Framer Motion spring presets, transition variants, stagger helpers
- `lineup-generator.ts` — Auto-generate lineups based on formation
- `voetbal-nl-parser.ts` — Parse voetbal.nl data for import
- `player-rating.ts` — Player overall rating & card tier calculation
- `player-stats-utils.ts` — Player statistics aggregation
- `onboarding.ts` — localStorage helpers for onboarding checklist & hints
- `blog.ts` — Blog article content and metadata

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
- Shared types in `src/types/` (team, player, match, availability, match-player, match-stats, lineup, event, training)
- DB types generated via `supabase gen types typescript`

### Storybook & Testing

**Every component MUST have a Storybook story file (`Component.stories.tsx`).** No exceptions. This is the primary way components are documented and tested. Currently 83 story files across 12 atoms, 45 molecules, and 26 organisms.

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
