# TeamPlanner

Mobile-first PWA voor het managen van amateurvoetbalteams. Vervangt WhatsApp-groepen voor beschikbaarheid, opstellingen en wedstrijdinfo.

## Waarom TeamPlanner?

Amateurclubs (senioren, jeugd, G-voetbal) regelen alles via WhatsApp. Dat leidt tot:

- Coaches die vrijdagavond niet weten wie er zaterdag kan spelen
- Opstellingen op bierviltjes die verloren gaan
- Geen overzicht van speeltijdverdeling
- Ouders en verzorgers die belangrijke info missen

TeamPlanner biedt een centrale plek voor het hele team.

## Features

### Teambeheer
- **Auth** — E-mail login + wachtwoord reset via Supabase Auth
- **Multi-team** — Beheer meerdere teams, team switcher in de header
- **Teambeheer** — Team aanmaken (senioren, junioren, G-team, 7v7), spelers toevoegen, uitnodigingslink delen
- **Spelerprofielen** — Naam, positie, rugnummer, foto, notities, vaardigheden-radar (10 skills)
- **Spelerskaarten** — FUT-stijl kaarten (brons/zilver/goud) met overall rating
- **Voetbal.nl import** — Team- en spelergegevens importeren vanuit voetbal.nl

### Wedstrijden
- **Wedstrijdprogramma** — Wedstrijden plannen met tabs (aankomend/gespeeld), score editing
- **Beschikbaarheid** — Spelers geven ja/nee/misschien, coach ziet realtime overzichtsgrid
- **Opstelling maker** — Visueel drag & drop voetbalveld met formatie-keuze (4-3-3, 4-4-2, 3-5-2, 4-2-3-1, + 7v7 formaties)
- **Wisselschema** — Wisselmomenten plannen met speeltijdverdeling per speler
- **Match stats** — Doelpunten, assists en kaarten per speler bijhouden
- **Delen** — Opstelling en wedstrijdverslag delen als afbeelding via Web Share API

### Trainingen & evenementen
- **Oefeningen-bibliotheek** — Kant-en-klare oefeningen met filters (niveau, thema, spelersaantal)
- **Trainingsplannen** — Oefeningen combineren tot trainingsplannen
- **Evenementen** — Trainingen, toernooien en andere teamactiviteiten met aanwezigheid en taken

### Overig
- **Onboarding** — Setup-checklist op dashboard + inline hints bij complexe features
- **Animaties** — Framer Motion door de hele app: staggered lists, skeleton loaders, spring physics
- **Blog** — 6 SEO-artikelen over voetbal teammanagement
- **PWA** — Installeerbaar op homescreen, offline basis, portrait-optimized

## Tech Stack

| Categorie | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router) |
| Taal | TypeScript (strict) |
| Styling | Tailwind CSS v4 (mobile-first, PostCSS) |
| UI Components | shadcn/ui + class-variance-authority |
| Client State | Zustand |
| Server State | TanStack React Query |
| Backend | Supabase (Auth, PostgreSQL, Realtime) |
| Drag & Drop | dnd-kit |
| Animaties | Framer Motion |
| Charts | Recharts (radar charts) |
| Image sharing | html2canvas-pro + Web Share API |
| PWA | Serwist (service worker) |
| Icons | Lucide React |
| Testing | Vitest + Storybook 10 + Playwright |
| CI | GitHub Actions |
| Hosting | Vercel |

## Aan de slag

### Vereisten

- Node.js 22+
- npm

### Installatie

```bash
# Clone de repo
git clone git@github.com:yustinTR/teamplanner.git
cd teamplanner

# Installeer dependencies
npm install
```

### Environment variabelen

Maak een `.env.local` bestand aan:

```env
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

### Supabase

Het project gebruikt een remote Supabase instance (project ID: `zonxfimxwqgpgycblvcg`). Migraties worden toegepast via de MCP Supabase tool, niet via lokale CLI. Types worden gegenereerd via de MCP tool en geschreven naar `src/lib/supabase/types.ts`.

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) voor de component library.

## Scripts

| Script | Beschrijving |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run test` | Draai alle tests (unit + storybook) |
| `npm run test:unit` | Alleen unit tests |
| `npm run test:stories` | Alleen Storybook tests (Playwright browser) |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:e2e` | E2E tests (Playwright) |
| `npm run storybook` | Storybook dev server (poort 6006) |
| `npm run build-storybook` | Production Storybook build |

## Projectstructuur

```
teamplanner/
├── .github/workflows/       CI pipeline (lint, build, tests)
├── .storybook/              Storybook configuratie
├── docs/                    Project documentatie & design archief
├── e2e/                     E2E tests (Playwright)
├── public/                  Static assets, PWA manifest, icons
├── supabase/migrations/     Database migraties (17 SQL bestanden)
├── src/
│   ├── app/                 Next.js App Router
│   │   ├── (auth)/          Login, registratie & wachtwoord reset
│   │   ├── (main)/          Hoofdlayout met bottom navigation + team switcher
│   │   │   ├── dashboard/   Home/dashboard met onboarding
│   │   │   ├── matches/     Wedstrijden (tabs, score editing, sharing)
│   │   │   ├── events/      Evenementen & detail
│   │   │   ├── team/        Teamoverzicht, spelerdetail (skills) & instellingen
│   │   │   ├── trainingen/  Oefeningen-bibliotheek & trainingsplannen
│   │   │   ├── create-team/ Team aanmaken
│   │   │   └── profile/     Gebruikersprofiel
│   │   ├── api/             API routes (OG image, voetbal.nl import, travel time)
│   │   ├── auth/            OAuth callback & email confirm
│   │   ├── blog/            Blog (6 SEO artikelen)
│   │   ├── features/        4 SEO feature pagina's
│   │   ├── join/[code]/     Uitnodigingslink handler (met OG metadata)
│   │   └── reset-password/  Wachtwoord reset formulier
│   ├── components/          Atomic Design componenten (83 stories)
│   │   ├── atoms/           12 componenten (Button, PlayerCard, Skeleton, AnimatedList, etc.)
│   │   ├── molecules/       45 componenten (SkillsRadar, ShareLineupCard, TeamSwitcher, etc.)
│   │   ├── organisms/       26 componenten (ExerciseList, TrainingPlanList, MatchStatsEditor, etc.)
│   │   └── ui/              13 shadcn/ui primitives
│   ├── hooks/               16 React Query hooks
│   ├── lib/
│   │   ├── supabase/        Supabase clients (browser, server, middleware, types)
│   │   ├── test/            Mock data factories & test utilities
│   │   ├── utils.ts         Utility functies (cn, formatMatchDate, etc.)
│   │   ├── constants.ts     Formaties, labels, posities, player skills
│   │   ├── animations.ts   Framer Motion presets
│   │   ├── player-rating.ts Overall rating & card tier
│   │   ├── onboarding.ts   Onboarding localStorage helpers
│   │   ├── blog.ts         Blog content
│   │   └── ...             lineup-generator, voetbal-nl-parser, player-stats-utils
│   ├── stores/              Zustand stores (auth-store met multi-team, ui-store)
│   └── types/               TypeScript types (9 types + barrel export)
├── CLAUDE.md                AI-assistent instructies
├── CONVENTIONS.md           Code conventies
└── PROJECT_CONTEXT.md       Projectcontext & beslissingen
```

## Architectuur

### Atomic Design

Alle UI-componenten volgen het Atomic Design patroon:

- **Atoms** — Pure presentatie, geen business logica of API calls (12 componenten)
- **Molecules** — Combineren atoms, mogen lokale UI-state hebben (45 componenten)
- **Organisms** — Eigen state, hooks en API calls. Dit zijn de "slimme" componenten (26 componenten)
- **UI** — shadcn/ui basis-componenten (13 primitives)

### Data Fetching

1. **Server Components** — Initieel laden via Supabase server client
2. **Client Components** — React Query voor interactieve/realtime data
3. **Realtime** — Supabase channel subscriptions (bijv. beschikbaarheid live updaten)

### State Management

- **Zustand** (`auth-store`) — Huidige user, team, speler, en isCoach status
- **React Query** — Server state caching en synchronisatie

### Database

PostgreSQL via Supabase met de volgende tabellen:

| Tabel | Beschrijving |
|-------|-------------|
| `teams` | Teams met naam, club, formatie, invite code, teamtype |
| `players` | Spelers met positie, rugnummer, foto, skills (JSONB), role |
| `matches` | Wedstrijden met datum, tegenstander, locatie, status, score |
| `availability` | Beschikbaarheid per speler per wedstrijd (available/unavailable/maybe) |
| `match_players` | Spelers gekoppeld aan wedstrijd (selectie, positie, speeltijd) |
| `match_stats` | Doelpunten, assists en kaarten per speler per wedstrijd |
| `lineups` | Opstellingen als JSONB met wisselschema |
| `events` | Teamactiviteiten (training, toernooi, etc.) |
| `event_attendance` | Aanwezigheid per speler per event |
| `event_tasks` | Taken gekoppeld aan een event |
| `exercises` | Oefeningen-bibliotheek met filters |
| `exercise_categories` | Categorieën voor oefeningen |

Row Level Security zorgt ervoor dat:
- Coaches volledige CRUD hebben op hun eigen team
- Spelers hun eigen beschikbaarheid/aanwezigheid kunnen updaten
- Iedereen in het team alles kan lezen

### Rollen

| Rol | Rechten |
|-----|---------|
| **Coach** | Volledige CRUD op team, spelers, wedstrijden, opstellingen, events |
| **Speler** | Eigen beschikbaarheid/aanwezigheid updaten, alles lezen |
| **Niet-geregistreerde speler** | Coach beheert hun beschikbaarheid |

## User Flows

### Coach maakt team aan

1. Registreren → Team aanmaken (naam, club, teamtype)
2. Krijgt uitnodigingslink → Deelt in WhatsApp
3. Spelers joinen via link

### Speler joint team

1. Opent uitnodigingslink → Registreren/inloggen
2. Automatisch gekoppeld aan team

### Beschikbaarheid doorgeven

1. Coach maakt wedstrijd aan
2. Speler opent app → Tikt ja/nee/misschien
3. Coach ziet realtime grid updaten

### Opstelling maken

1. Coach opent wedstrijd → Ziet beschikbare spelers
2. Kiest formatie (4-3-3, 4-4-2, etc. of 7v7 formaties)
3. Sleept spelers naar posities op het veld
4. Plant wisselmomenten met speeltijdverdeling
5. Slaat op → Spelers kunnen opstelling bekijken

### Event organiseren

1. Coach maakt event aan (training, toernooi)
2. Voegt taken toe (bijv. "Rijden", "Fruit meenemen")
3. Spelers geven aanwezigheid door
4. Coach ziet aanwezigheidoverzicht

## Testen

### Unit tests

```bash
npm run test:unit
```

Test utils, constants en stores zonder browser. Draait in Node.

### Storybook tests

```bash
npm run test:stories
```

Rendert alle 83 story-bestanden in een headless Chromium browser via Playwright. Controleert dat componenten correct renderen en geen fouten geven.

### E2E tests

```bash
npm run test:e2e
```

End-to-end tests via Playwright.

### Alle tests

```bash
npm run test
```

### CI

GitHub Actions draait automatisch bij push/PR op `main` en `develop`:

1. **Lint & Build** — ESLint + Next.js production build
2. **Unit Tests** — Vitest unit project
3. **Storybook Tests** — Vitest storybook project met Playwright

## Supabase Migraties

```bash
# Nieuwe migratie aanmaken
npx supabase migration new <naam>
```

Migraties worden toegepast via de MCP Supabase tool (`apply_migration`). Types worden gegenereerd via de MCP tool (`generate_typescript_types`) en geschreven naar `src/lib/supabase/types.ts`. Bestaande migraties nooit wijzigen — altijd nieuwe migraties toevoegen.

## Conventies

### Taal

- **Code** (variabelen, functies, comments): Engels
- **UI teksten** (labels, foutmeldingen): Nederlands
- **Commits**: Engels ([Conventional Commits](https://www.conventionalcommits.org/))

### Naamgeving

| Wat | Conventie | Voorbeeld |
|-----|-----------|-----------|
| Bestanden | kebab-case | `player-chip.tsx` |
| Component mappen | PascalCase | `PlayerChip/` |
| Componenten | PascalCase | `PlayerChip` |
| Hooks | camelCase met `use` | `useMatches` |
| Types | PascalCase | `Player`, `MatchDetail` |
| DB tabellen/kolommen | snake_case | `match_date`, `player_id` |

### Branches

```
main              → productie
develop           → development
feature/[naam]    → nieuwe feature
fix/[naam]        → bugfix
```

## Deployment

De app is geconfigureerd voor Vercel deployment. De PWA service worker wordt alleen geactiveerd in production.

## Licentie

Private repository.
