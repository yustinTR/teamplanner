# Onboarding: Setup-checklist + Inline Hints

## Probleem

Coaches die TeamPlanner vinden weten niet goed hoe het werkt. Na registratie landen ze op een leeg dashboard zonder begeleiding. Er is geen tour, geen tooltips, geen stappen-overzicht. Complexe features (lineup editor, wisselschema) missen context.

## Oplossing

Twee onboarding-mechanismen die samenwerken:

1. **Setup-checklist** op het dashboard — begeleidt coaches door de eerste configuratie
2. **Inline hints** bij complexe features — eenmalige contextual uitleg

Geen externe libraries. Alles via localStorage voor dismissed-state, bestaande hooks voor data.

---

## Deel 1: Setup-checklist

Kaart bovenaan het dashboard, alleen voor coaches, zolang de setup niet compleet is.

### Stappen

| # | Stap | Afvinkt wanneer | Link |
|---|------|-----------------|------|
| 1 | Team aangemaakt | Altijd (coach is al op dashboard) | — |
| 2 | Spelers toevoegen | `players.length >= 1` | /team of /team/settings/import |
| 3 | Eerste wedstrijd plannen | `matches.length >= 1` | /matches |
| 4 | Uitnodigingslink delen | localStorage `onboarding_invite_visited` | /team/settings |

### Gedrag

- Progress-indicator: "2 van 4 stappen voltooid"
- Elke stap is klikbaar → navigeert naar juiste plek
- "Sluiten" knop → slaat `onboarding_checklist_dismissed` op in localStorage
- Verdwijnt automatisch als alle 4 stappen af zijn
- Verdwijnt als handmatig gesloten
- Alleen zichtbaar voor coaches (`isCoach`)

### Implementatie

- Nieuw component: `src/components/molecules/OnboardingChecklist/`
- Haalt data op via bestaande hooks (`usePlayers`, `useMatches`) + `useAuthStore`
- Wordt toegevoegd in `src/app/(main)/dashboard/page.tsx` boven de quick action cards

---

## Deel 2: Inline hints

Korte tip-banners die eenmalig verschijnen bij complexe features. Lichte info-kaart (primary tint), niet blokkerend, met "Begrepen" knop.

### Hints

| Key | Locatie | Tekst |
|-----|---------|-------|
| `hint_availability_grid` | Wedstrijddetail, bij beschikbaarheidsgrid | "Spelers kunnen hun beschikbaarheid doorgeven via de app. Deel de uitnodigingslink zodat ze zelf kunnen reageren." |
| `hint_lineup_editor` | Lineup editor pagina | "Sleep spelers naar het veld om je opstelling te maken. Kies eerst een formatie rechtsboven." |
| `hint_substitution_plan` | Wisselschema sectie | "Plan wisselmomenten en zie automatisch hoeveel minuten elke speler speelt." |
| `hint_match_stats` | Wedstrijddetail, na eerste afronden | "Vul doelpunten en assists in bij de wedstrijdstatistieken om spelerdata op te bouwen." |

### Gedrag

- Verschijnt als info-kaart bovenaan de betreffende sectie
- "Begrepen" knop → verdwijnt permanent via localStorage (`hint_dismissed_<key>`)
- Max 1 hint per pagina
- Alleen voor coaches

### Implementatie

- Nieuw component: `src/components/molecules/OnboardingHint/`
- Props: `hintKey`, `title`, `description`, `icon?`
- Checkt `localStorage` via helper in `src/lib/onboarding.ts`

---

## Technisch overzicht

### Nieuwe bestanden

| Bestand | Type | Doel |
|---------|------|------|
| `src/lib/onboarding.ts` | Utility | localStorage helpers: `isHintDismissed()`, `dismissHint()`, `isChecklistDismissed()`, `dismissChecklist()`, `markInviteVisited()`, `hasVisitedInvite()` |
| `src/components/molecules/OnboardingHint/OnboardingHint.tsx` | Molecule | Herbruikbare hint-banner |
| `src/components/molecules/OnboardingHint/OnboardingHint.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/OnboardingHint/index.ts` | Barrel | Export |
| `src/components/molecules/OnboardingChecklist/OnboardingChecklist.tsx` | Molecule | Setup-checklist kaart |
| `src/components/molecules/OnboardingChecklist/OnboardingChecklist.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/OnboardingChecklist/index.ts` | Barrel | Export |

### Bestaande bestanden die wijzigen

| Bestand | Wijziging |
|---------|-----------|
| `src/app/(main)/dashboard/page.tsx` | `<OnboardingChecklist>` boven quick action cards |
| `src/app/(main)/matches/[id]/page.tsx` | Hint bij beschikbaarheidsgrid + hint bij wedstrijdstatistieken |
| `src/app/(main)/matches/[id]/lineup/page.tsx` | Hint bij lineup editor |
| `src/components/organisms/SubstitutionPlan/SubstitutionPlan.tsx` | Hint bij wisselschema |
| `src/app/(main)/team/settings/page.tsx` | `markInviteVisited()` call bij mount |

### Geen database-wijzigingen

Alle state via localStorage + bestaande data (players count, matches count).

### Geen nieuwe hooks

OnboardingChecklist gebruikt bestaande `usePlayers()` en `useMatches()` hooks.

### Geen externe libraries

Pure React + localStorage.
