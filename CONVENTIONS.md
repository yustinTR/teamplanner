# CONVENTIONS.md — TeamPlanner

> Dit bestand wordt gelezen door Claude Code om consistent te blijven met het project.

## Project

- **Naam:** TeamPlanner
- **Type:** Progressive Web App (Mobile-First)
- **Beschrijving:** Voetbalteam manager voor amateurclubs
- **Documentatie:** Zie `docs/teamplanner-project-documentatie.docx` voor volledige specificaties

## Stack

- **Framework:** Next.js 16 (App Router)
- **Taal:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (mobile-first, CSS custom properties via PostCSS)
- **UI Basis:** shadcn/ui (aanpasbaar, toegankelijk)
- **State Management:** Zustand (client state) + TanStack React Query (server state)
- **Database/Backend:** Supabase (Auth, PostgreSQL, Realtime, Storage, Edge Functions)
- **Drag & Drop:** dnd-kit
- **PWA:** Serwist (service worker, offline, installeerbaar)
- **Hosting:** Vercel
- **Testing:** Vitest + Storybook 10 + Playwright (browser tests)
- **Icons:** Lucide React

## Architectuur: Atomic Design

Alle UI-componenten volgen Atomic Design in `src/components/`:

```
src/components/
├── atoms/           → 8 componenten: Button, Avatar, Badge, Input, Card, Spinner, EmptyState, Textarea
├── molecules/       → 25 componenten: PlayerChip, AvailabilityToggle, AvailabilitySummary, MatchForm,
│                      MatchScore, MatchStatusBadge, MatchPlayerForm, MatchPlayerChip, FormField,
│                      FormationSelector, PitchPlayer, BenchPlayer, PlayerAvailabilityRow, PlayerForm,
│                      PlayerMinutesBar, SubstitutionMomentCard, LoginForm, RegisterForm, TeamForm,
│                      InviteLink, EventForm, AttendanceToggle, AttendanceSummary, EventTaskItem, EventTaskForm
├── organisms/       → 17 componenten: AuthHydrator, NavigationBar, PlayerList, PlayerDetail, MatchCard,
│                      MatchList, AvailabilityGrid, MyAvailability, LineupField, LineupView, ImportPreview,
│                      SubstitutionPlan, EventCard, EventList, EventAttendanceGrid, EventTaskList, MyEventAttendance
├── templates/       → Pagina layouts zonder data (nog niet in gebruik)
├── pages/           → Data-connected pages (in app/ routes)
└── ui/              → shadcn/ui primitives (avatar, badge, button, card, dialog, input, label, select, separator, sheet)
```

### Component Map Structuur

Elke component leeft in een eigen map:

```
src/components/atoms/Button/
├── Button.tsx           → Component
├── Button.stories.tsx   → Storybook stories (VERPLICHT)
├── index.ts             → Barrel export
```

`index.ts` bevat altijd named exports.

### Regels per niveau

- **Atoms:** Geen eigen business logica. Alleen presentatie + props. Geen API calls. Geen Supabase imports.
- **Molecules:** Combineren atoms. Mogen lokale UI-state hebben (bijv. toggle state). Geen API calls.
- **Organisms:** Mogen eigen state, hooks, en API calls hebben. Gebruiken molecules en atoms.
- **Templates:** Definiëren layout/structuur. Ontvangen children/slots. Geen data fetching.
- **Pages:** Halen data op via hooks. Geven data door aan templates/organisms.

## Folder Structuur

```
src/app/                          → Next.js App Router pages
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
├── (main)/                       → Layout met bottom navigation
│   ├── layout.tsx
│   ├── dashboard/page.tsx        → Dashboard (home)
│   ├── matches/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── lineup/page.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── team/
│   │   ├── page.tsx
│   │   ├── players/[id]/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       └── import/page.tsx
│   ├── create-team/page.tsx
│   └── profile/page.tsx
├── auth/
│   ├── callback/route.ts         → OAuth callback handler
│   └── confirm/route.ts          → Email confirmation
├── api/
│   ├── og/route.tsx              → Dynamic OG image generation
│   └── import-voetbal-nl/        → Voetbal.nl import API
│       ├── route.ts
│       ├── confirm/route.ts
│       └── refresh/route.ts
├── join/[code]/page.tsx          → Invite link handler
├── reset-password/page.tsx       → Wachtwoord reset formulier
├── layout.tsx                    → Root layout (providers, fonts)
└── page.tsx                      → Landing/redirect page
src/
├── components/                   → Atomic Design (zie boven)
├── hooks/                        → Custom React Query hooks
│   ├── use-team.ts
│   ├── use-matches.ts
│   ├── use-match-players.ts
│   ├── use-availability.ts
│   ├── use-players.ts
│   ├── use-lineup.ts
│   ├── use-events.ts
│   ├── use-event-attendance.ts
│   └── use-event-tasks.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts             → Browser Supabase client
│   │   ├── server.ts             → Server Supabase client
│   │   ├── middleware.ts         → Auth middleware
│   │   └── types.ts              → Generated database types
│   ├── utils.ts                  → Utility functies (cn(), formatDate(), etc.)
│   ├── constants.ts              → Formaties, labels, posities (6.5 KB)
│   ├── lineup-generator.ts      → Auto-generatie van opstellingen
│   ├── voetbal-nl-parser.ts     → Parser voor voetbal.nl import
│   └── test/                     → Mock data factories & test utilities
├── stores/                       → Zustand stores
│   ├── auth-store.ts             → User, team, speler, isCoach status
│   └── ui-store.ts               → UI state
├── types/                        → Gedeelde TypeScript types
│   ├── team.ts
│   ├── match.ts
│   ├── player.ts
│   ├── availability.ts
│   ├── match-player.ts
│   ├── lineup.ts
│   ├── event.ts
│   └── index.ts                  → Barrel export
└── styles/
    └── tokens.css                → Design tokens als CSS custom properties
```

## Naming Conventions

| Wat                  | Conventie          | Voorbeeld                     |
|----------------------|--------------------|-------------------------------|
| Bestanden            | kebab-case         | `player-chip.tsx`             |
| Component mappen     | PascalCase         | `PlayerChip/`                 |
| Componenten          | PascalCase         | `export function PlayerChip`  |
| Hooks                | camelCase met use- | `useMatches`, `useAvailability` |
| Zustand stores       | camelCase          | `useAuthStore`                |
| Types/Interfaces     | PascalCase         | `Player`, `MatchDetail`       |
| CSS tokens           | kebab-case         | `--color-primary`             |
| Supabase tabellen    | snake_case         | `match_players`               |
| Database kolommen    | snake_case         | `player_id`, `match_date`     |
| API routes           | kebab-case         | `/api/import-voetbal-nl`      |

## Taal

- **Code** (variabelen, functies, comments): Engels
- **UI teksten** (labels, placeholders, foutmeldingen): Nederlands
- **Commit messages**: Engels

## Styling Regels

### Mobile-First

Altijd mobile-first schrijven. Begin met het kleinste scherm (375px), voeg breakpoints toe voor groter:

```tsx
// Correct — mobile-first
<div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8">

// Fout — desktop-first
<div className="px-8 py-4 max-sm:px-4 max-sm:py-3">
```

### Breakpoints

```
Default:  0px    → Mobiel (375px design target)
sm:       640px  → Grote telefoon / kleine tablet
md:       768px  → Tablet
lg:       1024px → Desktop (optioneel, low priority)
```

### Design Tokens

Gebruik altijd Tailwind classes die mappen naar de design tokens. Vermijd hardcoded waarden:

```tsx
// Correct
<p className="text-neutral-900">          → --color-neutral-900
<div className="bg-primary">              → --color-primary
<span className="text-sm">               → --text-small (14px)
<div className="p-4">                     → --space-md (16px)
<div className="rounded-xl">              → --radius-md (12px)

// Fout
<p className="text-[#111827]">
<div className="p-[17px]">
```

### Tailwind CSS v4

Design tokens staan gedefinieerd als CSS custom properties in `src/styles/tokens.css`. Er is **geen `tailwind.config.ts`** — Tailwind v4 wordt geconfigureerd via PostCSS (`postcss.config.mjs`) en CSS variabelen.

## TypeScript

- Strict mode aan (`"strict": true`)
- Geen `any` — gebruik `unknown` als type onbekend is
- Exporteer types vanuit `src/types/`
- Supabase types genereren via `supabase gen types typescript`
- Props types altijd als interface:

```tsx
interface PlayerChipProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showPosition?: boolean;
  onClick?: (playerId: string) => void;
}
```

## Data Fetching Patterns

### Server Components (default)

Gebruik server components voor initiële data:

```tsx
// app/(main)/matches/page.tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function MatchesPage() {
  const supabase = await createServerClient();
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true });

  return <MatchList initialMatches={matches} />;
}
```

### Client Components (interactief)

Gebruik React Query voor client-side data die realtime moet updaten:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useAvailability(matchId: string) {
  return useQuery({
    queryKey: ['availability', matchId],
    queryFn: async () => {
      const { data } = await supabase
        .from('availability')
        .select('*, players(*)')
        .eq('match_id', matchId);
      return data;
    },
  });
}
```

### Realtime Subscriptions

Voor live updates (beschikbaarheid die binnenkomt):

```tsx
useEffect(() => {
  const channel = supabase
    .channel(`availability:${matchId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'availability',
      filter: `match_id=eq.${matchId}`,
    }, (payload) => {
      queryClient.invalidateQueries(['availability', matchId]);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [matchId]);
```

## Component Patterns

### Atoms voorbeeld

```tsx
// src/components/atoms/Badge/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        available: 'bg-success/10 text-success',
        unavailable: 'bg-danger/10 text-danger',
        maybe: 'bg-warning/10 text-warning',
        default: 'bg-neutral-100 text-neutral-600',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function Badge({ variant, label, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{label}</span>;
}
```

### Molecules voorbeeld

```tsx
// src/components/molecules/PlayerChip/PlayerChip.tsx
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import type { Player } from '@/types/player';

interface PlayerChipProps {
  player: Player;
  showPosition?: boolean;
  size?: 'sm' | 'md';
}

export function PlayerChip({ player, showPosition = true, size = 'md' }: PlayerChipProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar src={player.photo_url} fallback={player.name} size={size} />
      <div>
        <p className="text-sm font-medium text-neutral-900">{player.name}</p>
        {showPosition && <Badge label={player.position} />}
      </div>
    </div>
  );
}
```

## Git Conventions

### Branches

```
main              → productie
develop           → development
feature/[naam]    → feature/availability-grid
fix/[naam]        → fix/lineup-drag-bug
```

### Commits

Conventional Commits formaat:

```
feat: add availability toggle component
fix: correct lineup position saving
style: update match card spacing
refactor: extract supabase hooks
docs: update CONVENTIONS.md
chore: update dependencies
```

## Supabase Migrations

Migraties staan in `supabase/migrations/` en worden aangemaakt via:

```bash
npx supabase migration new [naam]
# bijv: npx supabase migration new create_teams_table
```

Altijd in volgorde uitvoeren. Nooit bestaande migraties wijzigen.

## Storybook & Testing

**Elk component MOET een Storybook story file hebben (`Component.stories.tsx`).** Geen uitzonderingen. Dit is de primaire manier waarop componenten worden gedocumenteerd en getest.

**Testing workflow (Vitest + Playwright browser):**
- Stories worden automatisch als tests gedraaid via `@storybook/addon-vitest` met Playwright browser
- `npm run test:stories` draait alle stories headless in Chromium
- `npm run test:unit` draait unit tests (utils, constants, stores)
- `npm run test` draait alles
- De `a11y` addon controleert toegankelijkheid op elke story

**Huidige status:** 49 story-bestanden, 8 atoms + 25 molecules + 17 organisms.

## Accessibility

- Alle interactieve elementen moeten keyboard-navigeerbaar zijn
- ARIA labels op icon-only buttons
- Focus visible states op alle focusbare elementen
- Kleurcontrast minimaal 4.5:1 (WCAG AA)
- Touch targets minimaal 44x44px op mobiel
- Speciaal belangrijk voor G-voetbal: houd de UI simpel en duidelijk

## Performance Targets

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size bewaken met `next/bundle-analyzer`
