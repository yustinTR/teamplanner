# Growth SEO Quick Wins Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 3 SEO/viral growth quick wins: performance hints, internal links between feature pages, and WhatsApp-optimized invite link previews.

**Architecture:** All changes are in existing Next.js pages/layouts. No new components needed. Performance hints go in root layout head. Internal links are added as a "Bekijk ook" section at the bottom of each feature page. Invite link gets `generateMetadata` for OG tags.

**Tech Stack:** Next.js App Router metadata API, HTML link tags

---

### Task 1: Add Performance Hints to Root Layout

**Files:**
- Modify: `src/app/layout.tsx:115-117` (inside `<head>`)

**Step 1: Add dns-prefetch and preconnect**

In `src/app/layout.tsx`, add these link tags inside `<head>` before the JSON-LD script:

```tsx
<head>
  <link rel="dns-prefetch" href="https://zonxfimxwqgpgycblvcg.supabase.co" />
  <link rel="preconnect" href="https://zonxfimxwqgpgycblvcg.supabase.co" crossOrigin="anonymous" />
  <script
    type="application/ld+json"
    ...
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: add dns-prefetch and preconnect for Supabase"
```

---

### Task 2: Add Internal Links Between Feature Pages

Each of the 4 feature pages needs a "Bekijk ook" section above the CTA, linking to the other 3 feature pages.

**Files:**
- Modify: `src/app/features/wedstrijden/page.tsx`
- Modify: `src/app/features/beschikbaarheid/page.tsx`
- Modify: `src/app/features/opstellingen/page.tsx`
- Modify: `src/app/features/trainingen/page.tsx`

**Step 1: Define the related features data**

Each page gets a `relatedFeatures` array excluding itself. The links use the same icon + title + description pattern from the homepage.

Mapping:
- wedstrijden → beschikbaarheid, opstellingen, trainingen
- beschikbaarheid → wedstrijden, opstellingen, trainingen
- opstellingen → wedstrijden, beschikbaarheid, trainingen
- trainingen → wedstrijden, beschikbaarheid, opstellingen

**Step 2: Add "Bekijk ook" section to each page**

Insert a new section between the "Hoe het werkt" section and the CTA section:

```tsx
{/* Related features */}
<section className="bg-white px-4 py-16">
  <div className="mx-auto max-w-3xl">
    <h2 className="text-center text-2xl font-bold text-neutral-900">Bekijk ook</h2>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {relatedFeatures.map((feature) => (
        <Link
          key={feature.href}
          href={feature.href}
          className="rounded-xl border border-neutral-100 bg-neutral-50 p-5 transition-shadow hover:shadow-md"
        >
          <feature.icon className="size-5 text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-neutral-900">{feature.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{feature.description}</p>
        </Link>
      ))}
    </div>
  </div>
</section>
```

The `relatedFeatures` array for each page uses these definitions:
- Wedstrijden: `{ icon: Calendar, title: "Wedstrijden", description: "Wedstrijden plannen en scores bijhouden", href: "/features/wedstrijden" }`
- Beschikbaarheid: `{ icon: Users, title: "Beschikbaarheid", description: "Spelers geven met een tik aan of ze er zijn", href: "/features/beschikbaarheid" }`
- Opstellingen: `{ icon: ClipboardList, title: "Opstellingen", description: "Drag & drop opstellingen met wisselschema", href: "/features/opstellingen" }`
- Trainingen: `{ icon: Dumbbell, title: "Trainingen", description: "Kant-en-klare oefeningen en trainingsplannen", href: "/features/trainingen" }`

Each page imports only the icons it needs for the related features (it may already import its own icon).

**Step 3: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/features/
git commit -m "feat(seo): add internal links between feature pages"
```

---

### Task 3: WhatsApp-Optimized Invite Link Preview

**Files:**
- Modify: `src/app/join/[code]/page.tsx`

**Step 1: Add generateMetadata with team lookup**

Add a `generateMetadata` function that tries to fetch the team name from the invite code. Fall back to generic text if the team can't be found (RLS may block anonymous access).

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { code } = await params;
  const supabase = await createClient();

  // Try to fetch team name — may fail if user is not authenticated (RLS)
  const { data: team } = await supabase
    .from("teams")
    .select("name")
    .eq("invite_code", code)
    .limit(1)
    .single();

  const teamName = team?.name;
  const title = teamName
    ? `Word lid van ${teamName}!`
    : "Je bent uitgenodigd!";
  const description = teamName
    ? `Je bent uitgenodigd om lid te worden van ${teamName} op MyTeamPlanner. Meld je gratis aan en doe mee.`
    : "Een teamgenoot heeft je uitgenodigd om mee te doen op MyTeamPlanner. Meld je gratis aan.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://myteamplanner.nl/join/${code}`,
      siteName: "MyTeamPlanner",
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
    robots: { index: false, follow: false },
  };
}
```

Note: `robots: { index: false }` prevents invite links from being indexed (they're user-specific), but OG tags still work for WhatsApp/social previews.

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 3: Commit**

```bash
git add "src/app/join/[code]/page.tsx"
git commit -m "feat(seo): add OG metadata to invite links for WhatsApp preview"
```

---

### Task 4: Final Verification

**Step 1: Full build + lint + test**

```bash
npm run build && npm run lint && npm run test
```

Expected: All pass

**Step 2: Merge to main and push**

```bash
git checkout develop && git add -A && git push origin develop
git checkout main && git merge develop --no-edit && git push origin main && git push origin develop
```
