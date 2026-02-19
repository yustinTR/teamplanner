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

- **Auth** — E-mail login via Supabase Auth
- **Teambeheer** — Team aanmaken, spelers toevoegen, uitnodigingslink delen
- **Spelerprofielen** — Naam, positie, rugnummer, notities
- **Wedstrijdprogramma** — Wedstrijden plannen met datum, tegenstander, locatie, thuis/uit
- **Beschikbaarheid** — Spelers geven ja/nee/misschien, coach ziet realtime overzichtsgrid
- **Opstelling maker** — Visueel drag & drop voetbalveld met formatie-keuze (4-3-3, 4-4-2, 3-5-2, 4-2-3-1)
- **PWA** — Installeerbaar op homescreen, offline basis, portrait-optimized

## Tech Stack

| Categorie | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router) |
| Taal | TypeScript (strict) |
| Styling | Tailwind CSS v4 (mobile-first) |
| UI Components | shadcn/ui + class-variance-authority |
| Client State | Zustand |
| Server State | TanStack React Query |
| Backend | Supabase (Auth, PostgreSQL, Realtime) |
| Drag & Drop | dnd-kit |
| PWA | Serwist (service worker) |
| Icons | Lucide React |
| Testing | Vitest + Storybook 10 + Playwright |
| CI | GitHub Actions |
| Hosting | Vercel |

## Aan de slag

### Vereisten

- Node.js 22+
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm install -g supabase`)
- Docker (voor lokale Supabase)

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
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<je-lokale-anon-key>
```

De anon key krijg je na het starten van lokale Supabase (zie hieronder).

### Lokale Supabase

```bash
# Start lokale Supabase (vereist Docker)
npx supabase start

# Dit toont je lokale URL en keys.
# Gebruik de anon key in .env.local

# Database types genereren (na schema wijzigingen)
npx supabase gen types typescript --local > src/lib/supabase/types.ts
```

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
| `npm run storybook` | Storybook dev server (poort 6006) |

## Projectstructuur

```
teamplanner/
├── .github/workflows/       CI pipeline (lint, build, tests)
├── .storybook/              Storybook configuratie
├── public/                  Static assets, PWA manifest, icons
├── supabase/migrations/     Database migraties (SQL)
├── src/
│   ├── app/                 Next.js App Router
│   │   ├── (auth)/          Login & registratie pagina's
│   │   ├── (main)/          Hoofdlayout met bottom navigation
│   │   │   ├── matches/     Wedstrijdprogramma & detail
│   │   │   ├── team/        Teamoverzicht & spelerdetail
│   │   │   └── profile/     Gebruikersprofiel
│   │   ├── auth/callback/   OAuth callback
│   │   └── join/[code]/     Uitnodigingslink handler
│   ├── components/          Atomic Design componenten
│   │   ├── atoms/           Button, Avatar, Badge, Input, Card, Spinner, etc.
│   │   ├── molecules/       PlayerChip, AvailabilityToggle, MatchForm, etc.
│   │   ├── organisms/       PlayerList, MatchCard, AvailabilityGrid, LineupField, etc.
│   │   └── ui/              shadcn/ui primitives (Sheet, Dialog, Select, etc.)
│   ├── hooks/               React Query hooks (use-players, use-matches, etc.)
│   ├── lib/
│   │   ├── supabase/        Supabase clients (browser, server, middleware, types)
│   │   ├── test/            Mock data factories & test utilities
│   │   ├── utils.ts         Utility functies (cn, formatMatchDate, etc.)
│   │   └── constants.ts     Formaties, labels, posities
│   ├── stores/              Zustand stores (auth-store)
│   └── types/               TypeScript types (Team, Player, Match, etc.)
├── CLAUDE.md                AI-assistent instructies
├── CONVENTIONS.md           Code conventies
└── PROJECT_CONTEXT.md       Projectcontext & beslissingen
```

## Architectuur

### Atomic Design

Alle UI-componenten volgen het Atomic Design patroon:

- **Atoms** — Pure presentatie, geen business logica of API calls
- **Molecules** — Combineren atoms, mogen lokale UI-state hebben
- **Organisms** — Eigen state, hooks en API calls. Dit zijn de "slimme" componenten
- **UI** — shadcn/ui basis-componenten (Sheet, Dialog, etc.)

### Data Fetching

1. **Server Components** — Initieel laden via Supabase server client
2. **Client Components** — React Query voor interactieve/realtime data
3. **Realtime** — Supabase channel subscriptions (bijv. beschikbaarheid live updaten)

### State Management

- **Zustand** (`auth-store`) — Huidige user, team, speler, en isCoach status
- **React Query** — Server state caching en synchronisatie

### Database

PostgreSQL via Supabase met 5 tabellen:

| Tabel | Beschrijving |
|-------|-------------|
| `teams` | Teams met naam, club, formatie, invite code |
| `players` | Spelers gekoppeld aan team (optioneel aan user) |
| `matches` | Wedstrijden met datum, tegenstander, locatie, status |
| `availability` | Beschikbaarheid per speler per wedstrijd (available/unavailable/maybe) |
| `lineups` | Opstellingen als JSONB ([{player_id, x, y, position_label}]) |

Row Level Security zorgt ervoor dat:
- Coaches volledige CRUD hebben op hun eigen team
- Spelers hun eigen beschikbaarheid kunnen updaten
- Iedereen in het team alles kan lezen

### Rollen

| Rol | Rechten |
|-----|---------|
| **Coach** | Volledige CRUD op team, spelers, wedstrijden, opstellingen |
| **Speler** | Eigen beschikbaarheid updaten, alles lezen |
| **Niet-geregistreerde speler** | Coach beheert hun beschikbaarheid |

## User Flows

### Coach maakt team aan

1. Registreren → Team aanmaken (naam, club)
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
2. Kiest formatie (4-3-3, 4-4-2, etc.)
3. Sleept spelers naar posities op het veld
4. Slaat op → Spelers kunnen opstelling bekijken

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

Rendert alle 33 story-bestanden in een headless Chromium browser via Playwright. Controleert dat componenten correct renderen en geen fouten geven.

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

# Types regenereren na schema wijziging
npx supabase gen types typescript --local > src/lib/supabase/types.ts
```

Bestaande migraties nooit wijzigen. Altijd nieuwe migraties toevoegen.

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
