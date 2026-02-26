# SEO: Landing Page Verbetering + Feature Pagina's

## Probleem

TeamPlanner heeft een solide technische SEO-basis (metadata, structured data, OG images), maar mist content om organisch gevonden te worden. De sitemap bevat slechts 5 pagina's. Coaches die googlen naar "voetbal beschikbaarheid app" of "opstelling maker voetbal" komen niet bij MyTeamPlanner terecht.

## Oplossing

Twee verbeteringen:

1. **Landing page versterken** — FAQ-sectie met schema.org markup, sterkere headings, klikbare feature links
2. **4 feature pagina's** — standalone pagina's per kernfeature die specifieke zoektermen targeten

Alles statische content, geen database of hooks nodig.

---

## Deel 1: Landing page verbeteringen

### 1. FAQ-sectie met schema.org

Nieuwe sectie onderaan de landing page (voor de CTA) met 6 veelgestelde vragen:

| Vraag | Antwoord (samenvatting) |
|-------|------------------------|
| Is MyTeamPlanner echt gratis? | Ja, volledig gratis. Geen creditcard, geen verborgen kosten. |
| Hoe werkt de beschikbaarheid? | Spelers geven met één tik aan of ze kunnen. De coach ziet een realtime overzicht. |
| Kan ik opstellingen maken met drag & drop? | Ja, kies een formatie en sleep spelers op het veld. Inclusief wisselschema met speeltijdverdeling. |
| Werkt het ook voor jeugdteams en G-teams? | Ja, met aangepaste formaties (7v7), grote touch targets en oefeningen per niveau. |
| Moet ik iets installeren? | Nee, het is een web-app die je kunt toevoegen aan je homescreen. Werkt op elke telefoon. |
| Hoe nodig ik mijn team uit? | Deel de uitnodigingslink via WhatsApp. Spelers klikken en zijn direct gekoppeld. |

Wordt gerenderd als accordion + `<script type="application/ld+json">` met FAQPage schema.

### 2. Feature kaarten klikbaar

De 4 bestaande feature-kaarten op de landing page linken naar de nieuwe feature pagina's:
- Wedstrijden → `/features/wedstrijden`
- Beschikbaarheid → `/features/beschikbaarheid`
- Opstellingen & wissels → `/features/opstellingen`
- Trainingen & evenementen → `/features/trainingen`

### 3. Sterkere H2 headings

| Huidig | Nieuw |
|--------|-------|
| "Alles wat je team nodig heeft" | "De complete teamplanner voor amateurvoetbal" |
| "Zo werkt het" | "In 3 stappen je team organiseren" |
| "Waarom MyTeamPlanner?" | "Waarom coaches kiezen voor MyTeamPlanner" |

---

## Deel 2: Feature pagina's

4 standalone pagina's onder `/features/`:

### Pagina-overzicht

| Route | H1 | Target zoekwoorden |
|-------|-----|-------------------|
| `/features/beschikbaarheid` | Beschikbaarheid bijhouden voor je voetbalteam | beschikbaarheid voetbal app, wie kan er spelen |
| `/features/opstellingen` | Opstelling maken met drag & drop | opstelling maker voetbal, wisselschema voetbal |
| `/features/wedstrijden` | Wedstrijdbeheer voor amateurvoetbal | wedstrijden plannen voetbal, voetbal.nl import |
| `/features/trainingen` | Trainingsplannen met kant-en-klare oefeningen | voetbal training oefeningen, trainingsplan voetbal |

### Structuur per pagina

Elke feature pagina volgt dezelfde opzet:

1. **Hero** — gradient achtergrond + H1 titel + ondertitel (1 zin)
2. **Probleemstelling** — "Herkenbaar?" + 2-3 zinnen over de pijn die coaches ervaren
3. **Oplossing** — hoe MyTeamPlanner dit oplost, 4-5 bullet points met iconen
4. **Hoe het werkt** — 3 concrete stappen
5. **CTA** — "Probeer het gratis" knop naar `/register`
6. **Footer** — zelfde als landing page

### SEO per pagina

- `metadata` export met title (template: `%s | MyTeamPlanner`), description (150+ chars), canonical URL
- Toegevoegd aan sitemap met priority 0.8, changeFrequency monthly
- Keywords in H1, H2, en body text

---

## Technisch overzicht

### Nieuwe bestanden

| Bestand | Type | Doel |
|---------|------|------|
| `src/app/features/beschikbaarheid/page.tsx` | Page (server) | Feature pagina beschikbaarheid |
| `src/app/features/opstellingen/page.tsx` | Page (server) | Feature pagina opstellingen |
| `src/app/features/wedstrijden/page.tsx` | Page (server) | Feature pagina wedstrijdbeheer |
| `src/app/features/trainingen/page.tsx` | Page (server) | Feature pagina trainingen |
| `src/components/molecules/FaqSection/FaqSection.tsx` | Molecule | FAQ accordion + JSON-LD schema |
| `src/components/molecules/FaqSection/FaqSection.stories.tsx` | Stories | Storybook stories |
| `src/components/molecules/FaqSection/index.ts` | Barrel | Export |

### Bestaande bestanden die wijzigen

| Bestand | Wijziging |
|---------|-----------|
| `src/app/page.tsx` | FAQ-sectie toevoegen, feature kaarten klikbaar, H2's aanscherpen |
| `src/app/sitemap.ts` | 4 feature pagina's toevoegen |
| `src/app/layout.tsx` | Keywords uitbreiden |

### Feature pagina's zijn server components

- Exporteren `metadata` direct (geen `"use client"`)
- Puur statisch, geen hooks of state
- Delen dezelfde visuele stijl als de landing page (gradient hero, witte content secties)

### FaqSection component

```typescript
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
}
```

- Rendert shadcn/ui `Accordion` component
- Injecteert `<script type="application/ld+json">` met FAQPage schema
- Herbruikbaar op landing page en feature pagina's

### Geen database-wijzigingen

Alles statische content.

### Geen nieuwe hooks of externe libraries

Gebruikt bestaande shadcn/ui Accordion component (toevoegen via `npx shadcn@latest add accordion` als het nog niet bestaat).
