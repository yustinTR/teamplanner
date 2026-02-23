# PROJECT_CONTEXT.md — TeamPlanner

> High-level context voor Claude Code. Lees dit samen met CONVENTIONS.md.

## Wat is TeamPlanner?

TeamPlanner is een mobile-first PWA waarmee coaches van amateurvoetbalteams hun team kunnen managen. De app vervangt WhatsApp-groepen voor het regelen van beschikbaarheid, opstellingen en wedstrijdinfo.

## Waarom bestaat dit?

Amateurclubs (senioren, jeugd, G-voetbal) managen alles via WhatsApp. Dit leidt tot:

- Coaches die op vrijdagavond nog niet weten wie er zaterdag kan spelen
- Opstellingen op bierviltjes die verloren gaan
- Geen overzicht van speeltijdverdeling (cruciaal bij G-voetbal)
- Ouders/verzorgers die belangrijke info missen

TeamPlanner lost dit op met één centrale plek voor het hele team.

## Doelgroep

1. **Coaches/trainers** (primary) — maken teams aan, beheren wedstrijden, maken opstellingen
2. **Spelers** — geven beschikbaarheid door, bekijken opstellingen
3. **Ouders/verzorgers** (v2) — read-only view voor jeugd- en G-voetbalteams

## MVP Scope

Het MVP bevat deze features:

1. **Auth** — E-mail login + wachtwoord reset via Supabase Auth
2. **Teambeheer** — Team aanmaken (met teamtype: senioren, junioren, G-team, 7v7), spelers toevoegen, invite links delen
3. **Spelerprofielen** — Naam, positie, rugnummer, foto, notities (voor G-voetbal bijzonderheden)
4. **Wedstrijdprogramma** — CRUD voor wedstrijden (datum, tegenstander, locatie, thuis/uit)
5. **Beschikbaarheid** — Spelers geven ja/nee/misschien. Coach ziet realtime overzichtsgrid
6. **Opstelling maker** — Visueel drag & drop voetbalveld met formatie keuze (inclusief 7v7 formaties)
7. **Wisselschema** — Wisselmomenten plannen met speeltijdverdeling per speler
8. **Evenementen** — Trainingen, toernooien en andere teamactiviteiten met aanwezigheid en taken
9. **Voetbal.nl import** — Team- en spelergegevens importeren vanuit voetbal.nl
10. **PWA** — Installeerbaar, offline basis, homescreen icon

## Database Tabellen

```sql
-- teams: Het team
teams (id, name, club_name, formation, invite_code, created_by, logo_url, import_source, team_type)
-- team_type: 'senior' | 'junior_11' | 'junior_7' | 'g_team_11' | 'g_team_7'

-- players: Spelers in een team
players (id, team_id, user_id, name, position, jersey_number, photo_url, notes, is_active)

-- matches: Wedstrijden
matches (id, team_id, opponent, match_date, location, home_away, status, score_home, score_away, notes)

-- availability: Beschikbaarheid per speler per wedstrijd
availability (id, player_id, match_id, status, responded_at)
-- status: 'available' | 'unavailable' | 'maybe'

-- match_players: Spelers gekoppeld aan een wedstrijd (selectie, posities, speeltijd)
match_players (id, match_id, player_id, is_selected, position, minutes_played)

-- lineups: Opstellingen per wedstrijd
lineups (id, match_id, formation, positions, substitution_plan)
-- positions: JSONB [{player_id, x, y, position_label}]
-- substitution_plan: JSONB [{moment, substitutions: [{in, out}]}]

-- events: Teamactiviteiten (training, toernooi, etc.)
events (id, team_id, title, description, event_type, event_date, location, created_by)

-- event_attendance: Aanwezigheid per speler per event
event_attendance (id, event_id, player_id, status, responded_at)

-- event_tasks: Taken gekoppeld aan een event
event_tasks (id, event_id, title, assigned_to, is_completed)
```

## Rollen & Rechten

- **Coach** (created_by van team): Volledige CRUD op team, spelers, wedstrijden, opstellingen, events
- **Speler** (user_id in players): Kan eigen beschikbaarheid/aanwezigheid updaten, alles lezen
- **Niet-geregistreerde speler** (user_id = NULL): Coach beheert hun beschikbaarheid

## User Flows

### Flow 1: Coach maakt team aan
Register → Create Team (naam, club, teamtype) → Krijgt invite link → Deelt in WhatsApp → Spelers joinen

### Flow 2: Speler joint team
Opent invite link → Register/Login → Automatisch gekoppeld aan team

### Flow 3: Beschikbaarheid (de killer feature)
Coach maakt wedstrijd aan → Speler opent app → Tikt ja/nee/misschien → Coach ziet realtime grid updaten

### Flow 4: Opstelling maken
Coach opent wedstrijd → Ziet wie beschikbaar is → Kiest formatie → Sleept spelers op het veld → Plant wisselmomenten → Slaat op → Spelers kunnen opstelling bekijken

### Flow 5: Event organiseren
Coach maakt event aan (training, toernooi) → Voegt taken toe → Spelers geven aanwezigheid door → Coach ziet overzicht

## Design Principes

1. **Mobile-first** — 95% gebruikt dit op telefoon. Design voor 375px, schaal omhoog.
2. **Simpel** — Een coach moet in 30 seconden een wedstrijd aanmaken. Een speler in 5 seconden beschikbaarheid doorgeven.
3. **Toegankelijk** — G-voetbal spelers en hun begeleiders moeten het kunnen gebruiken. Grote touch targets, duidelijke labels.
4. **Snel** — Laden onder 2 seconden. Offline beschikbaar voor basisinfo.

## Key Technical Decisions

- **PWA over native** — Geen App Store gedoe, direct deelbaar via link, lagere drempel
- **Supabase over custom backend** — Auth, database, realtime, storage in één. Gratis tier is ruim.
- **Next.js App Router** — Server components voor snelle initial load, client components voor interactiviteit
- **Atomic Design** — Consistentie en herbruikbaarheid. Zie CONVENTIONS.md voor details.
- **shadcn/ui als basis** — Niet als drop-in library, maar als startpunt dat we aanpassen aan ons design systeem
- **Tailwind CSS v4** — CSS-native configuratie via PostCSS, design tokens als CSS custom properties (geen `tailwind.config.ts`)

## Wat NIET te doen

- Geen over-engineering. Dit is een simpele app voor amateurvoetbal, geen enterprise software.
- Geen custom auth. Gebruik Supabase Auth.
- Geen GraphQL. Supabase client is genoeg.
- Geen SSR voor alles. Gebruik server components voor initial data, client components voor interactiviteit.
- Geen desktop-first. Altijd mobile-first.
- Geen features buiten MVP scope zonder expliciete vraag.

## Repo Structuur

```
teamplanner/
├── .github/workflows/         → CI pipeline (lint, build, tests)
├── .storybook/                → Storybook configuratie
├── docs/                      → Project documentatie (.docx)
├── e2e/                       → E2E tests (Playwright)
├── public/                    → Static assets, PWA manifest, icons
├── supabase/migrations/       → Database migraties (SQL)
├── src/
│   ├── app/                   → Next.js App Router (pages + routes)
│   │   ├── (auth)/            → Login, registratie, wachtwoord reset
│   │   ├── (main)/            → Hoofdlayout met bottom navigation
│   │   ├── api/               → API routes (OG image, voetbal.nl import)
│   │   ├── auth/              → Auth callback & confirm handlers
│   │   └── join/[code]/       → Invite link handler
│   ├── components/            → Atomic Design componenten
│   │   ├── atoms/             → 8 componenten (Button, Avatar, Badge, etc.)
│   │   ├── molecules/         → 25 componenten (PlayerChip, MatchForm, EventForm, etc.)
│   │   ├── organisms/         → 17 componenten (PlayerList, LineupField, EventList, etc.)
│   │   └── ui/                → shadcn/ui primitives (Sheet, Dialog, Select, etc.)
│   ├── hooks/                 → 9 React Query hooks
│   ├── lib/                   → Utilities, Supabase clients, constants
│   ├── stores/                → Zustand stores (auth-store, ui-store)
│   ├── types/                 → TypeScript types (7 types + barrel export)
│   └── styles/                → Design tokens CSS
├── CLAUDE.md                  → AI-assistent instructies
├── CONVENTIONS.md             → Code standaarden (dit lezen!)
├── PROJECT_CONTEXT.md         → Dit bestand
├── package.json
├── next.config.ts
├── postcss.config.mjs         → Tailwind CSS v4 PostCSS setup
├── vitest.config.ts
├── playwright.config.ts
└── tsconfig.json
```

## Huidige Status

**MVP grotendeels compleet.** Alle kernfunctionaliteit is gebouwd:

- [x] Next.js project met App Router
- [x] Tailwind CSS v4 + shadcn/ui + design tokens
- [x] Supabase Auth (e-mail login, wachtwoord reset)
- [x] Database schema met 9 migraties en RLS policies
- [x] Atomic Design componenten (8 atoms, 25 molecules, 17 organisms)
- [x] 49 Storybook stories met Playwright browser testing
- [x] Wedstrijdbeheer met beschikbaarheid en opstellingen
- [x] Drag & drop lineup editor met formatie-keuze (11v11 + 7v7)
- [x] Wisselschema met speeltijdverdeling
- [x] Evenementen systeem met aanwezigheid en taken
- [x] Voetbal.nl import integratie
- [x] Team types (senioren, junioren, G-team, 7v7)
- [x] PWA configuratie met Serwist
- [x] CI/CD pipeline (GitHub Actions)
- [x] Landing page met OG image generatie
