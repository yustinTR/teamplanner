# SEO + Blog Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 6 new blog articles targeting long-tail keywords, add breadcrumbs to blog/feature pages, and add internal cross-links between articles for better SEO.

**Architecture:** Blog posts are defined as data in `src/lib/blog.ts`. The `[slug]/page.tsx` already has JSON-LD (BlogPosting schema), generateMetadata, and related posts. Sitemap auto-generates from the blogPosts array. We add a Breadcrumbs molecule, 6 new articles with internal links, and cross-link existing articles.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, schema.org JSON-LD

---

### Task 1: Create Breadcrumbs molecule

**Files:**
- Create: `src/components/molecules/Breadcrumbs/Breadcrumbs.tsx`
- Create: `src/components/molecules/Breadcrumbs/Breadcrumbs.stories.tsx`
- Create: `src/components/molecules/Breadcrumbs/index.ts`

**Step 1: Create the component**

```tsx
// src/components/molecules/Breadcrumbs/Breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `https://myteamplanner.nl${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 text-neutral-300" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-neutral-900">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
```

**Step 2: Create barrel export**

```tsx
// src/components/molecules/Breadcrumbs/index.ts
export { Breadcrumbs } from "./Breadcrumbs";
```

**Step 3: Create Storybook story**

```tsx
// src/components/molecules/Breadcrumbs/Breadcrumbs.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Molecules/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const BlogPost: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Voetbal teamindeling maken" },
    ],
  },
};

export const FeaturePage: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#features" },
      { label: "Beschikbaarheid" },
    ],
  },
};
```

**Step 4: Commit**

```bash
git add src/components/molecules/Breadcrumbs/
git commit -m "feat: add Breadcrumbs molecule with BreadcrumbList JSON-LD"
```

---

### Task 2: Add Breadcrumbs to blog post pages

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Replace the "Alle artikelen" back-link with Breadcrumbs**

In `src/app/blog/[slug]/page.tsx`, replace the ArrowLeft back-link block (lines 88-94) with:

```tsx
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";

// Inside the component, replace the back link with:
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ]}
/>
```

Remove the `ArrowLeft` import if no longer used.

**Step 2: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat: add breadcrumbs to blog post pages"
```

---

### Task 3: Add Breadcrumbs to feature pages

**Files:**
- Modify: `src/app/features/beschikbaarheid/page.tsx`
- Modify: `src/app/features/opstellingen/page.tsx`
- Modify: `src/app/features/wedstrijden/page.tsx`
- Modify: `src/app/features/trainingen/page.tsx`

**Step 1: Add Breadcrumbs to each feature page**

For each feature page, add the Breadcrumbs component at the top of the first `<section>` inside the page content:

```tsx
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";

// At the top of the page content (inside the first section, before the h1):
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "PAGE_TITLE_HERE" },
  ]}
/>
```

Page titles:
- beschikbaarheid → "Beschikbaarheid"
- opstellingen → "Opstellingen"
- wedstrijden → "Wedstrijden"
- trainingen → "Trainingen"

**Step 2: Commit**

```bash
git add src/app/features/
git commit -m "feat: add breadcrumbs to feature pages"
```

---

### Task 4: Add `relatedSlugs` field to BlogPost and update existing articles

**Files:**
- Modify: `src/lib/blog.ts` — add `relatedSlugs` to BlogPost interface and to each existing article

**Step 1: Add `relatedSlugs` to the interface**

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  featureLink: string;
  featureLabel: string;
  keywords: string[];
  relatedSlugs: string[]; // NEW — slugs of related articles for internal linking
  sections: BlogSection[];
}
```

**Step 2: Add `relatedSlugs` to each existing article**

- `opstelling-7-tegen-7-voetbal` → `["wisselschema-jeugdvoetbal", "voetbal-training-oefeningen", "voetbal-teamindeling-maken"]`
- `wisselschema-jeugdvoetbal` → `["opstelling-7-tegen-7-voetbal", "beschikbaarheid-bijhouden-voetbalteam", "spelers-beoordelen-jeugdtrainer"]`
- `team-managen-als-voetbaltrainer` → `["beschikbaarheid-bijhouden-voetbalteam", "communicatie-voetbalteam", "gratis-voetbal-app-voor-je-team"]`
- `beschikbaarheid-bijhouden-voetbalteam` → `["team-managen-als-voetbaltrainer", "communicatie-voetbalteam", "gratis-voetbal-app-voor-je-team"]`
- `gratis-voetbal-app-voor-je-team` → `["team-managen-als-voetbaltrainer", "beschikbaarheid-bijhouden-voetbalteam", "app-voetbaltrainer"]`
- `voetbal-training-oefeningen` → `["voetbalseizoen-plannen", "spelers-beoordelen-jeugdtrainer", "opstelling-7-tegen-7-voetbal"]`

**Step 3: Update `[slug]/page.tsx` to use `relatedSlugs` for related posts**

Replace the related posts logic (line 51-53):

```tsx
// Old:
const relatedPosts = blogPosts
  .filter((p) => p.slug !== post.slug)
  .slice(0, 3);

// New:
const relatedPosts = post.relatedSlugs
  .map((s) => blogPosts.find((p) => p.slug === s))
  .filter((p): p is BlogPost => p !== undefined);
```

Import `BlogPost` type:
```tsx
import { blogPosts, getBlogPost, getAllSlugs, type BlogPost } from "@/lib/blog";
```

**Step 4: Commit**

```bash
git add src/lib/blog.ts src/app/blog/[slug]/page.tsx
git commit -m "feat: add relatedSlugs for curated internal linking between blog posts"
```

---

### Task 5: Write 6 new blog articles

**Files:**
- Modify: `src/lib/blog.ts` — append 6 new BlogPost entries to the `blogPosts` array

**Step 1: Add the 6 new articles**

Append to the `blogPosts` array (after the existing 6 entries). Each article needs: slug, title, description, date, readingTime, featureLink, featureLabel, keywords, relatedSlugs, sections (3-5 sections with 2 paragraphs each).

**Article 1: voetbal-teamindeling-maken**
- Title: "Voetbal teamindeling maken: tips voor trainers"
- Description: "Hoe maak je als trainer een eerlijke en effectieve teamindeling? Van spelerselectie tot posities — praktische tips voor amateurvoetbalcoaches."
- Date: "2026-03-13"
- Reading time: "4 min"
- Feature link: /features/opstellingen
- Feature label: "Opstellingen maken"
- Keywords: ["voetbal teamindeling", "teamindeling maken", "voetbal team samenstellen", "teamindeling voetbal coach"]
- Related slugs: ["opstelling-7-tegen-7-voetbal", "wisselschema-jeugdvoetbal", "spelers-beoordelen-jeugdtrainer"]
- Sections:
  1. "Begin bij je spelers, niet bij de formatie" — Ken eerst je selectie (kwaliteiten, posities, ervaring). Pas dan kies je een formatie die bij je spelers past, niet andersom.
  2. "Houd rekening met balans" — Een goede teamindeling is meer dan 11 namen op papier. Mix ervaren en onervaren spelers, linksbeen en rechtsbeen, snelle en sterke spelers.
  3. "Communiceer je keuzes" — Spelers accepteren een teamindeling beter als ze begrijpen waarom. Leg uit waarom iemand op een bepaalde positie staat.
  4. "Gebruik een tool" — Met MyTeamPlanner sleep je spelers naar het veld, kies je een formatie en plan je wissels vooraf. Je ziet direct of je indeling klopt.

**Article 2: app-voetbaltrainer**
- Title: "Beste apps voor voetbaltrainers in 2026"
- Description: "Welke apps zijn er voor amateurvoetbaltrainers? Een vergelijking van de beste tools voor teammanagement, opstellingen en beschikbaarheid."
- Date: "2026-03-10"
- Reading time: "5 min"
- Feature link: /register
- Feature label: "Gratis starten"
- Keywords: ["app voetbaltrainer", "beste voetbal app", "voetbal coach app", "teammanagement app voetbal"]
- Related slugs: ["gratis-voetbal-app-voor-je-team", "team-managen-als-voetbaltrainer", "communicatie-voetbalteam"]
- Sections:
  1. "Waarom een app als trainer?" — WhatsApp is niet ontworpen voor teambeheer. Een speciale app bespaart je uren per week en geeft je overzicht.
  2. "Waar moet je op letten?" — Gebruiksgemak (spelers moeten het ook snappen), gratis of betaalbaar, Nederlandse taal, mobiel-eerst.
  3. "Populaire opties vergeleken" — Vergelijk TeamSnap, SoccerLAB, Spond, en MyTeamPlanner op prijs, functies, en gebruiksgemak. MyTeamPlanner is gratis, volledig Nederlands, specifiek voor amateurvoetbal.
  4. "Conclusie" — Voor amateurvoetbalcoaches in Nederland is een simpele, gratis tool het beste. Probeer MyTeamPlanner en ontdek wat het verschil maakt.

**Article 3: voetbalseizoen-plannen**
- Title: "Hoe plan je een voetbalseizoen als trainer"
- Description: "Een nieuw seizoen begint met goede planning. Van selectie samenstellen tot wedstrijdschema importeren — een stappenplan voor amateurcoaches."
- Date: "2026-03-07"
- Reading time: "5 min"
- Feature link: /features/wedstrijden
- Feature label: "Wedstrijden beheren"
- Keywords: ["voetbalseizoen plannen", "seizoen voorbereiden voetbal", "voetbal coach planning", "seizoensplanning amateurvoetbal"]
- Related slugs: ["team-managen-als-voetbaltrainer", "voetbal-training-oefeningen", "voetbal-teamindeling-maken"]
- Sections:
  1. "Begin op tijd" — Een goed seizoen begint weken voor de eerste wedstrijd. Inventariseer je selectie, registreer nieuwe spelers, en zorg dat iedereen in het systeem staat.
  2. "Importeer je wedstrijdprogramma" — Veel clubs gebruiken voetbal.nl voor hun competitieschema. Met MyTeamPlanner importeer je het hele programma in één keer, inclusief tegenstanders en datums.
  3. "Plan je trainingen" — Maak een globaal trainingsplan per periode. Wissel techniek, tactiek en conditie af. Gebruik de oefeningenbibliotheek voor inspiratie.
  4. "Houd het overzicht" — Met een dashboard zie je in één oogopslag je eerstvolgende wedstrijd, wie er beschikbaar is, en welke trainingen gepland zijn.

**Article 4: voetbal-statistieken-bijhouden**
- Title: "Voetbal statistieken bijhouden: zo doe je dat"
- Description: "Wil je weten wie je topscorer is of hoeveel minuten elke speler maakt? Leer hoe je eenvoudig voetbalstatistieken bijhoudt voor je amateurteam."
- Date: "2026-03-04"
- Reading time: "4 min"
- Feature link: /features/wedstrijden
- Feature label: "Statistieken bijhouden"
- Keywords: ["voetbal statistieken bijhouden", "voetbal stats app", "doelpunten bijhouden voetbal", "speeltijd bijhouden"]
- Related slugs: ["wisselschema-jeugdvoetbal", "voetbalseizoen-plannen", "app-voetbaltrainer"]
- Sections:
  1. "Waarom statistieken bijhouden?" — Statistieken geven je objectief inzicht. Wie maakt de meeste minuten? Wie scoort het vaakst? Het helpt bij het maken van eerlijke keuzes over speeltijd en posities.
  2. "Welke stats zijn nuttig?" — Voor amateurvoetbal hoef je niet alles bij te houden. Focus op: doelpunten, assists, gele/rode kaarten, gespeelde wedstrijden en speelminuten. Dat geeft al een compleet beeld.
  3. "Na elke wedstrijd invullen" — Maak er een gewoonte van. Direct na de wedstrijd vul je de score en individuele stats in. Het kost 2 minuten en bouwt over het seizoen een waardevol overzicht op.
  4. "Seizoenshighlights" — MyTeamPlanner berekent automatisch wie topscorer is, wie de meeste wedstrijden speelde, en wie de meeste minuten maakte. Ideaal voor het seizoensoverzicht of de jaarlijkse teamavond.

**Article 5: communicatie-voetbalteam**
- Title: "Communicatie in een voetbalteam verbeteren"
- Description: "Slechte communicatie kost je spelers en wedstrijden. Ontdek hoe je als coach de communicatie in je amateurvoetbalteam verbetert."
- Date: "2026-03-01"
- Reading time: "4 min"
- Feature link: /features/beschikbaarheid
- Feature label: "Beschikbaarheid bijhouden"
- Keywords: ["communicatie voetbalteam", "team communicatie verbeteren", "voetbal team organiseren", "communicatie coach spelers"]
- Related slugs: ["team-managen-als-voetbaltrainer", "beschikbaarheid-bijhouden-voetbalteam", "app-voetbaltrainer"]
- Sections:
  1. "Het probleem met WhatsApp-groepen" — Belangrijke berichten verdwijnen tussen emoji's en memes. Niet iedereen leest alles. En als coach heb je geen idee wie het gezien heeft.
  2. "Scheidt informatie van communicatie" — Gebruik WhatsApp voor de gezelligheid, maar een apart kanaal voor de organisatie. Wedstrijdinfo, beschikbaarheid en opstellingen horen niet in een chatgroep.
  3. "Maak reageren makkelijk" — Hoe minder moeite het kost om te reageren, hoe meer spelers het doen. Een app waar je met één tik je beschikbaarheid doorgeeft werkt beter dan een WhatsApp-poll.
  4. "Wees consistent" — Stuur info altijd via hetzelfde kanaal. Als spelers weten waar ze moeten kijken, hoef je niet meer te herhalen.

**Article 6: spelers-beoordelen-jeugdtrainer**
- Title: "Spelers beoordelen en ontwikkelen als jeugdtrainer"
- Description: "Hoe beoordeel je spelers eerlijk als jeugdtrainer? Praktische tips voor het bijhouden van vaardigheden en het stimuleren van ontwikkeling."
- Date: "2026-02-26"
- Reading time: "5 min"
- Feature link: /features/opstellingen
- Feature label: "Spelerprofielen bekijken"
- Keywords: ["spelers beoordelen jeugd", "jeugdvoetbal evaluatie", "spelers ontwikkelen", "vaardigheden jeugdvoetbal"]
- Related slugs: ["voetbal-teamindeling-maken", "wisselschema-jeugdvoetbal", "voetbal-training-oefeningen"]
- Sections:
  1. "Beoordelen is niet hetzelfde als selecteren" — Bij jeugdvoetbal gaat het niet om wie de beste is, maar om wie zich het meeste ontwikkelt. Beoordeel spelers op groei, niet alleen op huidig niveau.
  2. "Welke vaardigheden beoordeel je?" — Focus op de basis: techniek, snelheid, passing, positiespel, inzet. Geef elke vaardigheid een score van 1-10 en herhaal dit een paar keer per seizoen om ontwikkeling te zien.
  3. "Maak het visueel" — Een radardiagram per speler maakt sterke punten en verbeterpunten direct zichtbaar. In MyTeamPlanner vul je vaardigheden in per speler en zie je automatisch een radar met hun profiel.
  4. "Gebruik beoordelingen voor de training" — Als je weet dat 5 spelers laag scoren op passing, plan dan een passtraining. Beoordelingen zijn niet alleen voor het rapport — ze sturen je trainingsplanning.
  5. "Eerlijk en transparant" — Bespreek beoordelingen met spelers (en bij jeugd: met ouders). Leg uit wat je ziet en wat ze kunnen verbeteren. Dat motiveert meer dan een cijfer zonder context.

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, new blog pages are statically generated.

**Step 3: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: add 6 new blog articles targeting long-tail SEO keywords"
```

---

### Task 6: Update sitemap lastModified date

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Update lastModified for blog index and homepage**

Change the `lastModified` dates for the homepage and blog index to `"2026-03-13"` to reflect the new content.

**Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "chore: update sitemap dates for new blog content"
```

---

### Task 7: Build, lint, test, and final commit

**Step 1: Run build**

Run: `npm run build`
Expected: All pages build successfully, including 12 blog post pages.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No new errors.

**Step 3: Run tests**

Run: `npm run test`
Expected: All tests pass including new Breadcrumbs story.

**Step 4: Merge to main and release**

```bash
git push origin develop
git checkout main
git merge develop --no-edit
git push origin main
gh release create v1.9.0 --target main --title "v1.9.0" --notes "..."
git checkout develop
```
