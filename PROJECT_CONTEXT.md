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

Het MVP bevat precies deze features:

1. **Auth** — E-mail + magic link login via Supabase Auth
2. **Teambeheer** — Team aanmaken, spelers toevoegen, invite links delen
3. **Spelerprofielen** — Naam, positie, rugnummer, foto, notities (voor G-voetbal bijzonderheden)
4. **Wedstrijdprogramma** — CRUD voor wedstrijden (datum, tegenstander, locatie, thuis/uit)
5. **Beschikbaarheid** — Spelers geven ja/nee/misschien. Coach ziet overzichtsgrid
6. **Opstelling maker** — Visueel drag & drop voetbalveld met formatie keuze
7. **Push notificaties** — Herinneringen voor beschikbaarheid
8. **PWA** — Installeerbaar, offline basis, homescreen icon

Alles wat hier NIET in staat is V2. Bouw geen features die niet in deze lijst staan.

## Database Tabellen

```sql
-- teams: Het team
teams (id, name, club_name, formation, invite_code, created_by, logo_url)

-- players: Spelers in een team
players (id, team_id, user_id, name, position, jersey_number, photo_url, notes, is_active)

-- matches: Wedstrijden
matches (id, team_id, opponent, match_date, location, home_away, status, score_home, score_away, notes)

-- availability: Beschikbaarheid per speler per wedstrijd
availability (id, player_id, match_id, status, responded_at)
-- status: 'available' | 'unavailable' | 'maybe'

-- lineups: Opstellingen per wedstrijd
lineups (id, match_id, formation, positions)
-- positions: JSONB [{player_id, x, y, position_label}]
```

## Rollen & Rechten

- **Coach** (created_by van team): Volledige CRUD op team, spelers, wedstrijden, opstellingen
- **Speler** (user_id in players): Kan eigen beschikbaarheid updaten, alles lezen
- **Niet-geregistreerde speler** (user_id = NULL): Coach beheert hun beschikbaarheid

## User Flows

### Flow 1: Coach maakt team aan
Register → Create Team (naam, club) → Krijgt invite link → Deelt in WhatsApp → Spelers joinen

### Flow 2: Speler joint team
Opent invite link → Register/Login → Automatisch gekoppeld aan team

### Flow 3: Beschikbaarheid (de killer feature)
Coach maakt wedstrijd aan → Push notificatie naar spelers → Speler opent app → Tikt ja/nee/misschien → Coach ziet realtime grid updaten

### Flow 4: Opstelling maken
Coach opent wedstrijd → Ziet wie beschikbaar is → Kiest formatie → Sleept spelers op het veld → Slaat op → Spelers kunnen opstelling bekijken

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

## Wat NIET te doen

- Geen over-engineering. Dit is een simpele app voor amateurvoetbal, geen enterprise software.
- Geen custom auth. Gebruik Supabase Auth.
- Geen GraphQL. Supabase client is genoeg.
- Geen SSR voor alles. Gebruik server components voor initial data, client components voor interactiviteit.
- Geen desktop-first. Altijd mobile-first.
- Geen features buiten MVP scope zonder expliciete vraag.

## Repo Structuur

```
documents/sites/teamplanner/
├── docs/
│   └── teamplanner-project-documentatie.docx
├── app/                    → Next.js app (pages + routes)
├── src/
│   ├── components/         → Atomic Design componenten
│   ├── hooks/              → Custom React hooks
│   ├── lib/                → Utilities, Supabase clients
│   ├── stores/             → Zustand stores
│   ├── types/              → TypeScript types
│   └── styles/             → Design tokens CSS
├── public/                 → Static assets, PWA manifest
├── supabase/
│   └── migrations/         → Database migraties
├── CONVENTIONS.md          → Code standaarden (dit lezen!)
├── PROJECT_CONTEXT.md      → Dit bestand
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Huidige Status

🟡 **Fase 0 — Setup & Design System**

Volgende stappen:
1. Next.js project initialiseren
2. Tailwind + shadcn/ui configureren
3. Design tokens opzetten
4. Supabase project aanmaken
5. Database migraties schrijven
6. Eerste atoms bouwen (Button, Avatar, Badge, Input, Card)
