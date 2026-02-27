# Onboarding: Setup-Checklist + Inline Hints — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a coach onboarding system with a setup-checklist on the dashboard and inline hints at complex features, so new coaches understand how the app works.

**Architecture:** localStorage for dismissed-state tracking (no database changes). Two new molecule components (`OnboardingChecklist`, `OnboardingHint`) plus a utility module. Hints and checklist only render for coaches (`isCoach` from `useAuthStore`).

**Tech Stack:** React, localStorage, Tailwind CSS, Lucide icons, existing React Query hooks (`usePlayers`, `useMatches`)

---

## Task 1: Create `src/lib/onboarding.ts` — localStorage helpers

**Files:**
- Create: `src/lib/onboarding.ts`

**Step 1: Write the utility module**

```typescript
const CHECKLIST_DISMISSED_KEY = "onboarding_checklist_dismissed";
const INVITE_VISITED_KEY = "onboarding_invite_visited";
const HINT_PREFIX = "hint_dismissed_";

function getItem(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

function setItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, "true");
}

export function isChecklistDismissed(): boolean {
  return getItem(CHECKLIST_DISMISSED_KEY);
}

export function dismissChecklist(): void {
  setItem(CHECKLIST_DISMISSED_KEY);
}

export function hasVisitedInvite(): boolean {
  return getItem(INVITE_VISITED_KEY);
}

export function markInviteVisited(): void {
  setItem(INVITE_VISITED_KEY);
}

export function isHintDismissed(hintKey: string): boolean {
  return getItem(`${HINT_PREFIX}${hintKey}`);
}

export function dismissHint(hintKey: string): void {
  setItem(`${HINT_PREFIX}${hintKey}`);
}
```

**Step 2: Write unit tests**

Create `src/lib/__tests__/onboarding.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import {
  isChecklistDismissed,
  dismissChecklist,
  hasVisitedInvite,
  markInviteVisited,
  isHintDismissed,
  dismissHint,
} from "../onboarding";

describe("onboarding localStorage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("checklist starts not dismissed", () => {
    expect(isChecklistDismissed()).toBe(false);
  });

  it("dismissChecklist persists", () => {
    dismissChecklist();
    expect(isChecklistDismissed()).toBe(true);
  });

  it("invite starts not visited", () => {
    expect(hasVisitedInvite()).toBe(false);
  });

  it("markInviteVisited persists", () => {
    markInviteVisited();
    expect(hasVisitedInvite()).toBe(true);
  });

  it("hint starts not dismissed", () => {
    expect(isHintDismissed("lineup_editor")).toBe(false);
  });

  it("dismissHint persists for specific key", () => {
    dismissHint("lineup_editor");
    expect(isHintDismissed("lineup_editor")).toBe(true);
    expect(isHintDismissed("availability_grid")).toBe(false);
  });
});
```

**Step 3: Run tests**

Run: `npm run test:unit -- src/lib/__tests__/onboarding.test.ts`
Expected: All 6 tests PASS

**Step 4: Commit**

```bash
git add src/lib/onboarding.ts src/lib/__tests__/onboarding.test.ts
git commit -m "feat: add onboarding localStorage helpers"
```

---

## Task 2: Create `OnboardingHint` molecule component

**Files:**
- Create: `src/components/molecules/OnboardingHint/OnboardingHint.tsx`
- Create: `src/components/molecules/OnboardingHint/OnboardingHint.stories.tsx`
- Create: `src/components/molecules/OnboardingHint/index.ts`

**Step 1: Create the component**

`src/components/molecules/OnboardingHint/OnboardingHint.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isHintDismissed, dismissHint } from "@/lib/onboarding";

interface OnboardingHintProps {
  hintKey: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function OnboardingHint({
  hintKey,
  title,
  description,
  icon: Icon = Lightbulb,
}: OnboardingHintProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isHintDismissed(hintKey));
  }, [hintKey]);

  if (!visible) return null;

  function handleDismiss() {
    dismissHint(hintKey);
    setVisible(false);
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary-200 bg-primary-50 p-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary-900">{title}</p>
        <p className="mt-0.5 text-sm text-primary-700">{description}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 text-primary-400 hover:bg-primary-100 hover:text-primary-600"
        aria-label="Sluiten"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
```

**Step 2: Create barrel export**

`src/components/molecules/OnboardingHint/index.ts`:

```typescript
export { OnboardingHint } from "./OnboardingHint";
```

**Step 3: Create stories**

`src/components/molecules/OnboardingHint/OnboardingHint.stories.tsx`:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Users } from "lucide-react";
import { OnboardingHint } from "./OnboardingHint";

const meta: Meta<typeof OnboardingHint> = {
  title: "Molecules/OnboardingHint",
  component: OnboardingHint,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      localStorage.clear();
      return (
        <div className="max-w-md p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingHint>;

export const Default: Story = {
  args: {
    hintKey: "storybook_default",
    title: "Tip",
    description:
      "Sleep spelers naar het veld om je opstelling te maken. Kies eerst een formatie rechtsboven.",
  },
};

export const WithCustomIcon: Story = {
  args: {
    hintKey: "storybook_custom_icon",
    title: "Beschikbaarheid",
    description:
      "Spelers kunnen hun beschikbaarheid doorgeven via de app. Deel de uitnodigingslink zodat ze zelf kunnen reageren.",
    icon: Users,
  },
};
```

**Step 4: Verify in Storybook**

Run: `npm run storybook`
Navigate to: Molecules / OnboardingHint
Verify: Both stories render correctly. Clicking the X button dismisses the hint.

**Step 5: Run tests**

Run: `npm run test:stories`
Expected: OnboardingHint stories PASS

**Step 6: Commit**

```bash
git add src/components/molecules/OnboardingHint/
git commit -m "feat: add OnboardingHint molecule component"
```

---

## Task 3: Create `OnboardingChecklist` molecule component

**Files:**
- Create: `src/components/molecules/OnboardingChecklist/OnboardingChecklist.tsx`
- Create: `src/components/molecules/OnboardingChecklist/OnboardingChecklist.stories.tsx`
- Create: `src/components/molecules/OnboardingChecklist/index.ts`

**Step 1: Create the component**

`src/components/molecules/OnboardingChecklist/OnboardingChecklist.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Circle, X, Rocket } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useMatches } from "@/hooks/use-matches";
import {
  isChecklistDismissed,
  dismissChecklist,
  hasVisitedInvite,
} from "@/lib/onboarding";

interface Step {
  label: string;
  href: string;
  completed: boolean;
}

export function OnboardingChecklist() {
  const { isCoach, currentTeam } = useAuthStore();
  const { data: players } = usePlayers(currentTeam?.id);
  const { data: matches } = useMatches(currentTeam?.id);
  const [dismissed, setDismissed] = useState(true);
  const [inviteVisited, setInviteVisited] = useState(false);

  useEffect(() => {
    setDismissed(isChecklistDismissed());
    setInviteVisited(hasVisitedInvite());
  }, []);

  if (!isCoach || !currentTeam || dismissed) return null;

  const steps: Step[] = [
    {
      label: "Team aangemaakt",
      href: "/team",
      completed: true,
    },
    {
      label: "Spelers toevoegen",
      href: "/team",
      completed: (players?.length ?? 0) >= 1,
    },
    {
      label: "Eerste wedstrijd plannen",
      href: "/matches",
      completed: (matches?.length ?? 0) >= 1,
    },
    {
      label: "Uitnodigingslink delen",
      href: "/team/settings",
      completed: inviteVisited,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;

  if (allDone) return null;

  function handleDismiss() {
    dismissChecklist();
    setDismissed(true);
  }

  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="size-5 text-primary-600" />
          <h3 className="font-semibold text-primary-900">Aan de slag</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-md p-1 text-primary-400 hover:bg-primary-100 hover:text-primary-600"
          aria-label="Sluiten"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mb-3 text-sm text-primary-700">
        {completedCount} van {steps.length} stappen voltooid
      </p>

      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.href}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-primary-100"
          >
            {step.completed ? (
              <Check className="size-5 text-success-600" />
            ) : (
              <Circle className="size-5 text-primary-300" />
            )}
            <span
              className={
                step.completed
                  ? "text-sm text-primary-500 line-through"
                  : "text-sm font-medium text-primary-900"
              }
            >
              {step.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create barrel export**

`src/components/molecules/OnboardingChecklist/index.ts`:

```typescript
export { OnboardingChecklist } from "./OnboardingChecklist";
```

**Step 3: Create stories**

`src/components/molecules/OnboardingChecklist/OnboardingChecklist.stories.tsx`:

Note: This component uses hooks (`usePlayers`, `useMatches`, `useAuthStore`), so we mock with decorators. Follow the pattern used by other organisms/molecules in the codebase that depend on data hooks — check if there's a Storybook mock setup. If hooks can't be easily mocked, create stories that render a simplified version showing the visual states.

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingChecklist } from "./OnboardingChecklist";

const meta: Meta<typeof OnboardingChecklist> = {
  title: "Molecules/OnboardingChecklist",
  component: OnboardingChecklist,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      localStorage.clear();
      return (
        <div className="max-w-sm p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingChecklist>;

export const Default: Story = {};
```

> **Note for implementer:** This component depends on `useAuthStore`, `usePlayers`, and `useMatches`. The story above will render nothing unless the store/hooks return data. Check how other organisms with data dependencies handle Storybook (e.g., `MatchList`, `PlayerList`). You may need to add Storybook parameter mocks or use `msw` (Mock Service Worker) if set up. At minimum, ensure the story file exists so the pattern is followed — it can show an empty state.

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 5: Commit**

```bash
git add src/components/molecules/OnboardingChecklist/
git commit -m "feat: add OnboardingChecklist molecule component"
```

---

## Task 4: Integrate OnboardingChecklist into Dashboard

**Files:**
- Modify: `src/app/(main)/dashboard/page.tsx`

**Step 1: Add import**

At the top of the file, after the existing imports, add:

```typescript
import { OnboardingChecklist } from "@/components/molecules/OnboardingChecklist";
```

**Step 2: Add component to the template**

Insert `<OnboardingChecklist />` as the **first item** inside the quick action cards grid. Find this line:

```typescript
{/* Quick action cards */}
<div className="-mt-4 grid gap-3 px-4 pb-4">
```

Add immediately after that opening div:

```typescript
<OnboardingChecklist />
```

This places the checklist card at the top of the card grid, sharing the same gap-3 spacing.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/(main)/dashboard/page.tsx
git commit -m "feat: add onboarding checklist to dashboard"
```

---

## Task 5: Add inline hints to match detail page

**Files:**
- Modify: `src/app/(main)/matches/[id]/page.tsx`

**Step 1: Add imports**

Add at the top, with the other imports:

```typescript
import { OnboardingHint } from "@/components/molecules/OnboardingHint";
import { Users as UsersIcon } from "lucide-react";
```

Note: `Users` is already imported from lucide-react. Either rename the import or reuse it. Since `Users` is already imported, reuse it for the hint icon — no additional import needed. Just add the `OnboardingHint` import.

**Step 2: Add hint above the availability grid section**

Find this block (the Beschikbaarheid section):

```typescript
<div className="rounded-xl bg-white p-4 shadow-md">
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-lg font-semibold">Beschikbaarheid</h2>
```

Add **before** that div (but inside the `<div className="-mt-4 space-y-4 px-4 pb-4">` container):

```typescript
{isCoach && (
  <OnboardingHint
    hintKey="availability_grid"
    title="Beschikbaarheid"
    description="Spelers kunnen hun beschikbaarheid doorgeven via de app. Deel de uitnodigingslink zodat ze zelf kunnen reageren."
    icon={Users}
  />
)}
```

**Step 3: Add hint above the match stats section**

Find this block:

```typescript
{match.status === "completed" && isCoach && (
  <div className="rounded-xl bg-white p-4 shadow-md">
    <h2 className="mb-3 text-lg font-semibold">
      Wedstrijdstatistieken
    </h2>
    <MatchStatsEditor matchId={match.id} />
  </div>
)}
```

Add an `OnboardingHint` **inside** that conditional block, just before the `<h2>`:

```typescript
{match.status === "completed" && isCoach && (
  <div className="rounded-xl bg-white p-4 shadow-md">
    <OnboardingHint
      hintKey="match_stats"
      title="Statistieken invullen"
      description="Vul doelpunten en assists in bij de wedstrijdstatistieken om spelerdata op te bouwen."
    />
    <h2 className="mb-3 text-lg font-semibold">
      Wedstrijdstatistieken
    </h2>
    <MatchStatsEditor matchId={match.id} />
  </div>
)}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/(main)/matches/[id]/page.tsx
git commit -m "feat: add onboarding hints to match detail page"
```

---

## Task 6: Add inline hint to lineup editor page

**Files:**
- Modify: `src/app/(main)/matches/[id]/lineup/page.tsx`

**Step 1: Add imports**

```typescript
import { useAuthStore } from "@/stores/auth-store";
import { OnboardingHint } from "@/components/molecules/OnboardingHint";
```

Note: `useAuthStore` is already imported in this file (used for `isCoach`). Only add `OnboardingHint`.

**Step 2: Add hint before the lineup editor**

Find this block:

```typescript
<h1 className="mb-4 text-2xl font-semibold">Opstelling</h1>

{isCoach ? (
  <LineupField matchId={id} />
) : (
  <LineupView matchId={id} />
)}
```

Add the hint between the `<h1>` and the conditional:

```typescript
<h1 className="mb-4 text-2xl font-semibold">Opstelling</h1>

{isCoach && (
  <div className="mb-4">
    <OnboardingHint
      hintKey="lineup_editor"
      title="Opstelling maken"
      description="Sleep spelers naar het veld om je opstelling te maken. Kies eerst een formatie rechtsboven."
    />
  </div>
)}

{isCoach ? (
  <LineupField matchId={id} />
) : (
  <LineupView matchId={id} />
)}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/(main)/matches/[id]/lineup/page.tsx
git commit -m "feat: add onboarding hint to lineup editor"
```

---

## Task 7: Add inline hint to SubstitutionPlan

**Files:**
- Modify: `src/components/organisms/SubstitutionPlan/SubstitutionPlan.tsx`

**Step 1: Add import**

```typescript
import { OnboardingHint } from "@/components/molecules/OnboardingHint";
```

**Step 2: Add hint at the top of the component**

Find the opening of the return statement:

```typescript
return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold">
```

Add the hint as the first child:

```typescript
return (
  <div className="space-y-4">
    <OnboardingHint
      hintKey="substitution_plan"
      title="Wisselschema"
      description="Plan wisselmomenten en zie automatisch hoeveel minuten elke speler speelt."
    />
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold">
```

**Step 3: Verify build + tests**

Run: `npm run build && npm run test:stories`
Expected: Build succeeds, SubstitutionPlan stories still pass

**Step 4: Commit**

```bash
git add src/components/organisms/SubstitutionPlan/SubstitutionPlan.tsx
git commit -m "feat: add onboarding hint to substitution plan"
```

---

## Task 8: Mark invite link as visited in team settings

**Files:**
- Modify: `src/app/(main)/team/settings/page.tsx`

**Step 1: Add import**

```typescript
import { useEffect } from "react";
import { markInviteVisited } from "@/lib/onboarding";
```

Note: Check if `useEffect` is already imported from React. If not, add it.

**Step 2: Add effect to mark invite as visited**

Inside the `TeamSettingsPage` component, after the existing hooks and before the early returns, add:

```typescript
useEffect(() => {
  if (isCoach) {
    markInviteVisited();
  }
}, [isCoach]);
```

This fires when any coach visits the settings page (which contains the invite link). The checklist step "Uitnodigingslink delen" will then show as completed.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/(main)/team/settings/page.tsx
git commit -m "feat: track invite link visit for onboarding checklist"
```

---

## Task 9: Final verification

**Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 2: Lint**

Run: `npm run lint`
Expected: No new errors (pre-existing warning is OK)

**Step 3: All tests**

Run: `npm run test`
Expected: All tests pass (unit + storybook)

**Step 4: Manual verification in dev**

Run: `npm run dev`

Test as coach:
1. Dashboard → OnboardingChecklist visible with "1 van 4 stappen voltooid" (team exists)
2. Click "Spelers toevoegen" → navigates to /team
3. Add a player → go back to dashboard → step 2 checked off
4. Click "Eerste wedstrijd plannen" → navigates to /matches
5. Add a match → go back to dashboard → step 3 checked off
6. Click "Uitnodigingslink delen" → navigates to /team/settings → go back → step 4 checked off
7. All 4 done → checklist disappears
8. Open a match → hint visible above availability grid → click X → gone permanently
9. Open lineup editor → hint visible → click X → gone permanently
10. Complete a match → hint visible above stats editor
11. Open substitution plan → hint visible

**Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: onboarding polish and fixes"
```
