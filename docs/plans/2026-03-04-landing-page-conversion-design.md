# Landing Page Conversie-optimalisatie

**Datum:** 2026-03-04
**Status:** Goedgekeurd
**Doel:** De landing page omvormen van een informatieve pagina naar een conversie-machine. Bezoekers moeten de app *zien en voelen* voordat ze zich aanmelden.

---

## Context

TeamPlanner heeft <10 actieve teams. De app is functioneel compleet (MVP + growth features), maar de landing page converteert niet: geen productbeeld, geen social proof, geen urgentie. Elke SEO-bezoeker, elke gedeelde link, elke WhatsApp-doorstuur landt hier — als deze pagina niet converteert, is al het andere verkeer verspild.

**Groeimodel:** Puur organisch (geen ads-budget). Elke bezoeker moet maximaal geconverteerd worden.

---

## Sectie 1: Hero (herschrijven)

### Layout

Split-screen: tekst links, product-demo rechts (desktop). Op mobiel: gestapeld (tekst boven, demo onder).

### Links — Tekst

- **Badge** bovenaan: "Gratis voor amateurvoetbal" (pill-shaped, primary tint)
- **H1:** "Nooit meer 'wie kan er zaterdag?' in de groepsapp"
- **Subtitle:** "De gratis teamplanner voor amateurvoetbal. Beschikbaarheid, opstellingen en wedstrijden — alles in één app."
- **Primary CTA:** "Maak je team aan" button → `/register`
- **Secondary link:** "Bekijk hoe het werkt ↓" — smooth scroll naar feature cards
- **Trust strip:** "Gratis · Geen creditcard · Klaar in 30 seconden" (muted text, onder de CTA)

### Rechts — Geanimeerde App Demo

Een telefoon-frame (`aspect-[9/19.5]`, rounded corners, subtle shadow) met daarin een looping animatie die 3 stappen toont:

**Stap 1: Beschikbaarheid (2s)**
- Simulatie van het beschikbaarheidsgrid
- 3-4 spelersnamen met animating availability toggles (groen/rood/oranje die één voor één verschijnen)
- Getal "8/14 beschikbaar" telt op

**Stap 2: Opstelling (2s)**
- Crossfade naar een voetbalveld met formatie
- Spelers staggeren in op hun posities (reuse `staggerItem` animaties)
- Een speler "zweeft" naar een positie (gesimuleerde drag, motion path)

**Stap 3: Klaar (1.5s)**
- Volledige opstelling zichtbaar
- Subtle glow/pulse op "Delen" knop
- Text: "Klaar om te delen!"

**Loop:** Na stap 3 fade out → terug naar stap 1.

**Technisch:**
- Puur visueel component: `src/components/molecules/HeroDemo/`
- Vaste/hardcoded data (Nederlandse spelersnamen)
- Framer Motion `AnimatePresence` + `variants` voor stap-overgangen
- `useEffect` + `setInterval` voor auto-advance (5.5s per cyclus)
- Geen API calls, geen interactiviteit
- `prefers-reduced-motion`: toon statische screenshot van stap 3

---

## Sectie 2: Social Proof (nieuw)

Direct onder de hero. Subtiele grijze achtergrond (`bg-neutral-50`).

### Team teller

"Al **X** teams gebruiken MyTeamPlanner"

- Server component haalt `count` op uit `teams` tabel
- NumberCounter animatie voor het getal
- Minimumwaarde: toon pas als er ≥5 teams zijn. Onder de 5: toon "Coaches in heel Nederland gebruiken MyTeamPlanner"

### Quotes (3 stuks)

3 korte coach-quotes in een horizontaal scrollbare rij (mobiel) of grid (desktop):

| Quote | Naam | Team |
|-------|------|------|
| "Eindelijk weet ik op donderdag al wie er zaterdag kan spelen." | Coach Willem | Be Fair 5 |
| "Mijn spelers vinden het geweldig dat ze de opstelling in de app kunnen zien." | Trainer Karin | VV Drieberg JO13 |
| "Het wisselschema bespaart me elke week minstens een kwartier." | Coach Martijn | DSVP G1 |

Initieel fictief maar realistisch. Later vervangen door echte quotes.

Visueel: card met quote-icoon, italic tekst, naam bold, team muted.

---

## Sectie 3: Feature Cards (verbeteren)

### Huidig

4 kaarten met icoon + titel + korte beschrijving, klikbaar naar feature pagina's.

### Verbetering

Voeg aan elke card een **mini-screenshot** toe (of een gestileerde illustratie) die het feature in actie laat zien:

| Feature | Afbeelding |
|---------|-----------|
| Wedstrijden | Matchcard met score en datum |
| Beschikbaarheid | Beschikbaarheidsgrid met groene/rode bolletjes |
| Opstellingen | Mini voetbalveld met spelers erop |
| Trainingen | Oefening-card met categorie-tags |

Screenshots worden als statische images in `/public/features/` geplaatst (optimized PNG of WebP). Alternatief: rendert als mini-componenten met vaste data (hergebruik bestaande atoms/molecules).

Cards linken naar `/features/[slug]` (bestaande SEO pagina's).

---

## Sectie 4: "Zo werkt het" (verbeteren)

### Huidig

3 stappen met tekst en nummers.

### Verbetering

Voeg bij elke stap een kleine visuele indicator toe:

1. **"Maak je team aan"** — icoon van team + naam invoer
2. **"Deel de link in WhatsApp"** — WhatsApp-achtige preview card mockup
3. **"Klaar! Spelers reageren direct"** — beschikbaarheidsgrid dat zich vult

Kan subtiel zijn — kleine illustraties of iconen, geen volledige screenshots nodig.

---

## Sectie 5: FAQ + CTA (bestaand)

Geen wijzigingen nodig. FAQ met schema.org JSON-LD werkt goed. CTA onderaan de pagina.

---

## Sectie 6: Sticky Mobile CTA (nieuw)

Op mobiel: een sticky balk onderaan het scherm met de primaire CTA.

### Gedrag

- **Verschijnt** wanneer de hero CTA-button uit de viewport scrolt (IntersectionObserver)
- **Verdwijnt** wanneer de hero CTA weer in beeld komt
- Bevat: "Maak je team aan" button (full width) + "Gratis" label
- Achtergrond: `bg-white/95 backdrop-blur` met `border-top`
- Animatie: slide up bij verschijnen, slide down bij verdwijnen

### Technisch

- `src/components/molecules/StickyCta/`
- IntersectionObserver op de hero CTA ref
- Framer Motion `AnimatePresence` voor slide animatie
- `fixed bottom-0 inset-x-0 z-50`
- Alleen op schermen < `md:` breakpoint (768px)

---

## Technisch Overzicht

### Nieuwe bestanden

| Bestand | Type | Doel |
|---------|------|------|
| `src/components/molecules/HeroDemo/HeroDemo.tsx` | Molecule | Geanimeerde app demo in telefoon-frame |
| `src/components/molecules/HeroDemo/HeroDemo.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/HeroDemo/index.ts` | Barrel | Export |
| `src/components/molecules/SocialProof/SocialProof.tsx` | Molecule | Team teller + coach quotes |
| `src/components/molecules/SocialProof/SocialProof.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/SocialProof/index.ts` | Barrel | Export |
| `src/components/molecules/StickyCta/StickyCta.tsx` | Molecule | Sticky mobile CTA balk |
| `src/components/molecules/StickyCta/StickyCta.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/StickyCta/index.ts` | Barrel | Export |

### Bestaande bestanden die wijzigen

| Bestand | Wijziging |
|---------|-----------|
| `src/app/page.tsx` | Hero herschrijven, SocialProof toevoegen, feature cards verbeteren, StickyCta toevoegen |
| `public/features/` | Mini-screenshots voor feature cards (optioneel, kan ook als componenten) |

### Geen database-wijzigingen

De team-count query voor social proof gebruikt de bestaande `teams` tabel.

### Geen nieuwe dependencies

Alles met Framer Motion (al geïnstalleerd), bestaande componenten, en Tailwind CSS.

---

## Implementatievolgorde

1. **HeroDemo component** — de geanimeerde telefoon-demo (meeste impact, meeste werk)
2. **Hero tekst herschrijven** — nieuwe headline, subtitle, CTA
3. **SocialProof component** — team teller + quotes
4. **StickyCta component** — sticky mobile CTA
5. **Feature cards verbeteren** — mini-screenshots toevoegen
6. **"Zo werkt het" visueel verbeteren** — illustraties bij stappen
