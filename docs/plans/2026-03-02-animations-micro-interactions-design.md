# Design: Animaties & Micro-interactions (Framer Motion Polish Pack)

**Datum:** 2026-03-02
**Status:** Goedgekeurd
**Doel:** De app van MVP naar premium EAFC-companion gevoel tillen door smooth animaties, spring physics, en micro-interactions toe te voegen met Framer Motion.

---

## Context

TeamPlanner voelt functioneel maar "webby" — harde page cuts, instant state changes, spinners als loading state. Gebruikers verwachten een native-app-achtig gevoel, geïnspireerd door de EAFC/FIFA companion app. De recent toegevoegde FUT-stijl spelerskaarten zijn het perfecte startpunt om animatie-"juice" toe te voegen.

## Aanpak

**Framer Motion** als animatie-library door de hele app. ~15KB gzipped, tree-shakeable, industriestandaard voor React animaties. Spring physics voor natuurlijk gevoel, `AnimatePresence` voor mount/unmount animaties.

---

## 1. Animatie-infrastructuur

### Dependency

`framer-motion` — tree-shakeable, ~15KB gzipped voor wat we gebruiken.

### Gedeelde config — `src/lib/animations.ts`

- **Spring presets:**
  - `snappy` — stiffness: 300, damping: 30 (buttons, toggles)
  - `smooth` — stiffness: 200, damping: 25 (page transitions, lists)
  - `bouncy` — stiffness: 400, damping: 15 (kaart reveals, drops)
- **Transition presets:** `fadeIn`, `slideUp`, `slideInFromRight`, `scaleIn`
- **Stagger helper:** delay per item voor lijst-animaties
- **Reduced motion:** automatisch uitschakelen bij `prefers-reduced-motion`

### AnimatedPage wrapper — `src/components/atoms/AnimatedPage/`

- Wraps page content met fade + subtle slide-up bij mount
- Exit animatie bij navigatie (fade out)
- Eenmalig in layout, elke pagina animeert automatisch

---

## 2. Spelerskaart Animaties

### Kaart reveal (PlayerDetail)

- Kaart schuift van boven in + scale (1.05 → 1.0)
- Goud-kaarten: **shimmer effect** — glanzende lichtstreep over de kaart (CSS gradient, getriggerd na animatie)
- Rating telt op van 0 → werkelijke waarde (counter animatie)

### Kaart op opstellingsveld

- Mini-kaarten staggeren in: keeper → verdediging → middenveld → aanval
- Drag & drop: scale 1.1x bij oppakken, zachte schaduw, smooth snap

### Skills beoordeling

- Na opslaan: kaart doet subtiele **3D flip** (rotate Y 0° → 180° → 0°) om nieuwe rating te onthullen
- Tier-change (brons → zilver): extra glow-effect

---

## 3. Lijsten & Navigatie

### Lijst-animaties

- Items staggeren in bij laden (30ms delay per item, slide-up)
- Nieuw item: smooth expand + fade in
- Verwijderd item: slide left + fade out, lijst collapst smooth

### Navigatie

- Bottom tab: actieve indicator animeert smooth naar geselecteerde tab (sliding pill)
- Sheet/drawer: spring physics bij open/sluit
- Terug-navigatie: pagina schuift naar rechts

### Loading states

- Skeleton loaders met pulserende gradient (vervangt Spinner op de meeste plekken)
- Content fades in wanneer data geladen is

---

## 4. Micro-interactions & Feedback

### Beschikbaarheid

- Toggle bounce bij tik + smooth color morph (groen ↔ rood ↔ oranje)

### Score & stats

- Doelpunten/assists: number counter animatie
- Speeltijd-balk: animated width grow

### Formulieren

- Submit succes: korte check-animatie
- Validation error: input shake

### Opstelling

- Lege positie: subtiele pulse bij drag hover (drop target hint)
- Succesvolle drop: korte ripple/glow
- Wisselplan: highlight-animatie op gewisselde spelers

---

## 5. Technische Details

### Nieuwe bestanden

| Bestand | Beschrijving |
|---------|-------------|
| `src/lib/animations.ts` | Spring configs, transition presets, stagger helpers |
| `src/components/atoms/AnimatedPage/` | Page transition wrapper |
| `src/components/atoms/AnimatedList/` | Staggered list wrapper |
| `src/components/atoms/Skeleton/` | Pulserende skeleton loader |
| `src/components/atoms/NumberCounter/` | Animated number counter |
| `src/components/atoms/ShimmerCard/` | Goud-kaart shimmer overlay |

### Te wijzigen

- `PlayerCard` — shimmer, reveal, flip
- `PitchPlayer` — stagger in, drag scale
- `LineupField` — drop targets, drag feedback
- `PlayerDetail` — hero kaart reveal, stats counter
- `NavigationBar` — sliding active indicator
- `AvailabilityToggle` — bounce, color morph
- `MatchCard` / `PlayerList` / `EventCard` — list stagger
- Sheet/Dialog componenten — spring physics
- Loading states app-breed — skeleton loaders

### Performance

- `will-change` hints op geanimeerde elementen
- `layout` animaties alleen waar nodig
- `useReducedMotion()` hook respecteert OS-instelling
- Lazy load Framer Motion features die niet op eerste render nodig zijn

---

## Implementatievolgorde

1. Infrastructuur (dependency, animations.ts, AnimatedPage)
2. Skeleton loaders & loading states
3. Lijst-animaties (AnimatedList, stagger)
4. Spelerskaart animaties (reveal, shimmer, flip)
5. Navigatie (tab indicator, sheet spring physics)
6. Micro-interactions (toggles, counters, form feedback)
7. Drag & drop juice (LineupField, PitchPlayer)

Elke stap levert een werkende staat op.
