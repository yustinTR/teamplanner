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

## Features

### MVP (compleet)

1. **Auth** — E-mail login + wachtwoord reset via Supabase Auth
2. **Teambeheer** — Team aanmaken (met teamtype: senioren, junioren, G-team, 7v7), spelers toevoegen, invite links delen
3. **Multi-team support** — Gebruikers kunnen lid zijn van meerdere teams, team switcher in de header
4. **Spelerprofielen** — Naam, positie, rugnummer, foto, notities (voor G-voetbal bijzonderheden)
5. **Speler vaardigheden** — 10 skills (1-10) met radardiagram, bewerkbaar door coach
6. **Speler ratings** — FUT-stijl spelerskaarten (brons/zilver/goud) met overall rating
7. **Wedstrijdprogramma** — CRUD met tabs (aankomend/gespeeld), score editing, match stats (goals, assists, kaarten)
8. **Beschikbaarheid** — Spelers geven ja/nee/misschien. Coach ziet realtime overzichtsgrid
9. **Opstelling maker** — Visueel drag & drop voetbalveld met formatie keuze (inclusief 7v7 formaties)
10. **Wisselschema** — Wisselmomenten plannen met speeltijdverdeling per speler
11. **Evenementen** — Trainingen, toernooien en andere teamactiviteiten met aanwezigheid en taken
12. **Trainingen** — Oefeningen-bibliotheek met filters (niveau, thema, spelersaantal) + trainingsplannen
13. **Voetbal.nl import** — Team- en spelergegevens importeren vanuit voetbal.nl
14. **PWA** — Installeerbaar, offline basis, homescreen icon

### Growth features (compleet)

15. **Onboarding** — Setup-checklist op dashboard + inline hints bij complexe features
16. **Animaties** — Framer Motion door de hele app: staggered lists, skeleton loaders, spring physics
17. **Image sharing** — Lineup en match report delen als PNG via Web Share API
18. **Blog** — 6 SEO-artikelen over voetbal teammanagement
19. **Feature pages** — 4 standalone SEO-pagina's per kernfeature
20. **FAQ** — met schema.org structured data op de landing page

## Database Tabellen

```sql
-- teams: Het team
teams (id, name, club_name, formation, invite_code, created_by, logo_url, import_source, team_type, default_gathering_minutes)
-- team_type: 'senior' | 'junior_11' | 'junior_7' | 'g_team_11' | 'g_team_7'

-- players: Spelers in een team
players (id, team_id, user_id, name, position, detailed_position, role, jersey_number, photo_url, notes, is_active, skills, skills_version)
-- skills: JSONB {speed, strength, technique, passing, dribbling, heading, defending, positioning, finishing, stamina}
-- role: 'player' | 'goalkeeper' | 'staff'

-- matches: Wedstrijden
matches (id, team_id, opponent, match_date, location, home_away, status, score_home, score_away, notes)

-- availability: Beschikbaarheid per speler per wedstrijd
availability (id, player_id, match_id, status, responded_at)
-- status: 'available' | 'unavailable' | 'maybe'

-- match_players: Spelers gekoppeld aan een wedstrijd (selectie, posities, speeltijd)
match_players (id, match_id, player_id, is_selected, position, minutes_played)

-- match_stats: Wedstrijdstatistieken per speler
match_stats (id, match_id, player_id, goals, assists, yellow_cards, red_cards)

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

-- exercises: Oefeningen-bibliotheek
exercises (id, title, description, category, level, min_players, max_players, duration_minutes, setup_instructions, variations, video_url)

-- exercise_categories: Categorieën voor oefeningen
exercise_categories (id, name, slug)
```

## Rollen & Rechten

- **Coach** (created_by van team): Volledige CRUD op team, spelers, wedstrijden, opstellingen, events, trainingsplannen
- **Speler** (user_id in players): Kan eigen beschikbaarheid/aanwezigheid updaten, alles lezen
- **Niet-geregistreerde speler** (user_id = NULL): Coach beheert hun beschikbaarheid
- **Multi-team**: Gebruikers kunnen lid zijn van meerdere teams (als coach en/of speler), team switcher in de header

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
- **Framer Motion** — Spring physics animaties door de hele app, staggered lists, skeleton loaders
- **Recharts** — Radar charts voor speler vaardigheden
- **html2canvas-pro** — DOM-to-PNG rendering voor image sharing via Web Share API

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
├── docs/                      → Project documentatie & design archief
│   ├── plans/                 → 14 design & implementatie documenten (archief)
│   └── teamplanner-project-documentatie.docx
├── e2e/                       → E2E tests (Playwright)
├── public/                    → Static assets, PWA manifest, icons
├── supabase/migrations/       → Database migraties (17 SQL bestanden)
├── src/
│   ├── app/                   → Next.js App Router (pages + routes)
│   │   ├── (auth)/            → Login, registratie, wachtwoord reset
│   │   ├── (main)/            → Hoofdlayout met bottom navigation + team switcher
│   │   ├── api/               → API routes (OG image, voetbal.nl import, travel time)
│   │   ├── auth/              → Auth callback & confirm handlers
│   │   ├── blog/              → Blog (6 SEO artikelen)
│   │   ├── features/          → 4 SEO feature pagina's
│   │   ├── join/[code]/       → Invite link handler (met OG metadata)
│   │   ├── privacy/           → Privacyverklaring
│   │   └── voorwaarden/       → Algemene voorwaarden
│   ├── components/            → Atomic Design componenten (83 stories)
│   │   ├── atoms/             → 12 componenten
│   │   ├── molecules/         → 45 componenten
│   │   ├── organisms/         → 26 componenten
│   │   └── ui/                → 13 shadcn/ui primitives
│   ├── hooks/                 → 16 React Query hooks
│   ├── lib/                   → 9 utility modules + Supabase clients
│   ├── stores/                → Zustand stores (auth-store, ui-store)
│   ├── types/                 → TypeScript types (9 types + barrel export)
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

**MVP compleet + growth features gebouwd.** Alle functionaliteit is live:

### MVP
- [x] Next.js project met App Router
- [x] Tailwind CSS v4 + shadcn/ui + design tokens
- [x] Supabase Auth (e-mail login, wachtwoord reset)
- [x] Database schema met 17 migraties en RLS policies
- [x] Atomic Design componenten (12 atoms, 45 molecules, 26 organisms)
- [x] 83 Storybook stories met Playwright browser testing
- [x] Multi-team support met team switcher
- [x] Wedstrijdbeheer met tabs, score editing en match stats
- [x] Beschikbaarheid met realtime grid
- [x] Drag & drop lineup editor met formatie-keuze (11v11 + 7v7)
- [x] Wisselschema met speeltijdverdeling
- [x] Speler vaardigheden (radar chart) en FUT-stijl spelerskaarten
- [x] Evenementen systeem met aanwezigheid en taken
- [x] Trainingen: oefeningen-bibliotheek + trainingsplannen
- [x] Voetbal.nl import integratie
- [x] Team types (senioren, junioren, G-team, 7v7)
- [x] PWA configuratie met Serwist
- [x] CI/CD pipeline (GitHub Actions)

### Growth
- [x] Landing page met FAQ + schema.org structured data
- [x] 4 SEO feature pagina's met interne links
- [x] Blog met 6 SEO-artikelen
- [x] OG metadata op invite links (WhatsApp preview)
- [x] Image sharing: lineup en match report als PNG (Web Share API)
- [x] Onboarding: setup-checklist + inline hints
- [x] Framer Motion animaties door de hele app
- [x] Privacy & voorwaarden pagina's
