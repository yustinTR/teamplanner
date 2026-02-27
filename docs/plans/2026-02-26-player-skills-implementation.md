# Player Skills Profile Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a skills radar chart (10 vaardigheden, 1–10 schaal) to the player detail page, editable by coach via bottom sheet with sliders.

**Architecture:** JSONB `skills` column on existing `players` table. Two new molecules: `SkillsRadar` (recharts RadarChart, read-only) and `SkillsEditor` (bottom sheet with sliders). Integrated into existing `PlayerDetail` organism. No new hooks — reuses `useUpdatePlayer()`.

**Tech Stack:** Recharts (RadarChart), shadcn/ui Slider, Supabase migration, existing React Query hooks.

---

### Task 1: Database migration + type regeneration

**Files:**
- Create: `supabase/migrations/20260226150000_add_player_skills.sql`
- Modify: `src/lib/supabase/types.ts` (regenerate)

**Step 1: Create migration file**

```bash
npx supabase migration new add_player_skills
```

Then write this content to the generated file:

```sql
ALTER TABLE players ADD COLUMN skills jsonb DEFAULT '{}';
```

**Step 2: Apply migration**

Apply via MCP Supabase tool (`apply_migration`) with the SQL above.

**Step 3: Regenerate TypeScript types**

Use MCP Supabase tool (`generate_typescript_types`) and write output to `src/lib/supabase/types.ts`.

Verify: the `players` Row type should now include `skills: Json` (where `Json` is `string | number | boolean | null | { [key: string]: Json } | Json[]`).

**Step 4: Commit**

```bash
git add supabase/migrations/*add_player_skills* src/lib/supabase/types.ts
git commit -m "feat: add skills JSONB column to players table"
```

---

### Task 2: PLAYER_SKILLS constant

**Files:**
- Modify: `src/lib/constants.ts` (append at end, before closing)

**Step 1: Add the constant**

Append to the end of `src/lib/constants.ts`:

```typescript
// --- Player skills ---

export interface PlayerSkillDef {
  key: string;
  label: string;
}

export const PLAYER_SKILLS: PlayerSkillDef[] = [
  { key: "speed", label: "Snelheid" },
  { key: "strength", label: "Kracht" },
  { key: "technique", label: "Techniek" },
  { key: "passing", label: "Passing" },
  { key: "dribbling", label: "Dribbelen" },
  { key: "heading", label: "Koppen" },
  { key: "defending", label: "Verdedigen" },
  { key: "positioning", label: "Positiespel" },
  { key: "finishing", label: "Afwerken" },
  { key: "stamina", label: "Conditie" },
];

export type PlayerSkills = Record<string, number>;
```

**Step 2: Verify build**

```bash
npm run build
```

Expected: success.

**Step 3: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: add PLAYER_SKILLS constant with 10 skills"
```

---

### Task 3: Install dependencies

**Files:** None (package.json auto-updated)

**Step 1: Install recharts**

```bash
npm install recharts
```

**Step 2: Install shadcn Slider**

```bash
npx shadcn@latest add slider
```

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add package.json package-lock.json src/components/ui/slider.tsx
git commit -m "chore: add recharts and shadcn slider dependencies"
```

---

### Task 4: SkillsRadar molecule

**Files:**
- Create: `src/components/molecules/SkillsRadar/SkillsRadar.tsx`
- Create: `src/components/molecules/SkillsRadar/SkillsRadar.stories.tsx`
- Create: `src/components/molecules/SkillsRadar/index.ts`

**Step 1: Create barrel export**

`src/components/molecules/SkillsRadar/index.ts`:

```typescript
export { SkillsRadar } from "./SkillsRadar";
```

**Step 2: Create the component**

`src/components/molecules/SkillsRadar/SkillsRadar.tsx`:

```tsx
"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { PLAYER_SKILLS, type PlayerSkills } from "@/lib/constants";

interface SkillsRadarProps {
  skills: PlayerSkills;
}

export function SkillsRadar({ skills }: SkillsRadarProps) {
  const data = PLAYER_SKILLS.map((skill) => ({
    skill: skill.label,
    value: skills[skill.key] ?? 0,
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="var(--color-neutral-200)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "var(--color-neutral-600)", fontSize: 11 }}
        />
        <Radar
          name="Vaardigheden"
          dataKey="value"
          stroke="var(--color-primary-600)"
          fill="var(--color-primary-500)"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{
            r: 3,
            fill: "var(--color-primary-600)",
            strokeWidth: 0,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
```

**Note on CSS variables:** This project uses Tailwind CSS v4 with tokens defined as CSS custom properties in `src/styles/tokens.css`. The variables `--color-primary-600`, `--color-neutral-200` etc. are available globally. If the exact variable names differ, check `src/styles/tokens.css` and adjust accordingly. The pattern is `--color-{token}`.

**Step 3: Create stories**

`src/components/molecules/SkillsRadar/SkillsRadar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkillsRadar } from "./SkillsRadar";

const meta: Meta<typeof SkillsRadar> = {
  title: "Molecules/SkillsRadar",
  component: SkillsRadar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SkillsRadar>;

export const Default: Story = {
  args: {
    skills: {
      speed: 7,
      strength: 5,
      technique: 8,
      passing: 6,
      dribbling: 7,
      heading: 4,
      defending: 3,
      positioning: 6,
      finishing: 8,
      stamina: 7,
    },
  },
};

export const AllHigh: Story = {
  args: {
    skills: {
      speed: 9,
      strength: 9,
      technique: 10,
      passing: 8,
      dribbling: 9,
      heading: 8,
      defending: 9,
      positioning: 9,
      finishing: 10,
      stamina: 8,
    },
  },
};

export const Beginner: Story = {
  args: {
    skills: {
      speed: 3,
      strength: 2,
      technique: 2,
      passing: 3,
      dribbling: 1,
      heading: 1,
      defending: 2,
      positioning: 2,
      finishing: 1,
      stamina: 4,
    },
  },
};

export const PartiallyFilled: Story = {
  args: {
    skills: {
      speed: 7,
      technique: 6,
      passing: 8,
    },
  },
};

export const Empty: Story = {
  args: {
    skills: {},
  },
};
```

**Step 4: Verify in Storybook**

```bash
npm run storybook
```

Navigate to Molecules/SkillsRadar. Verify all stories render correctly.

**Step 5: Run tests**

```bash
npm run test
```

Expected: all tests pass.

**Step 6: Commit**

```bash
git add src/components/molecules/SkillsRadar/
git commit -m "feat: add SkillsRadar molecule with recharts RadarChart"
```

---

### Task 5: SkillsEditor molecule

**Files:**
- Create: `src/components/molecules/SkillsEditor/SkillsEditor.tsx`
- Create: `src/components/molecules/SkillsEditor/SkillsEditor.stories.tsx`
- Create: `src/components/molecules/SkillsEditor/index.ts`

**Step 1: Create barrel export**

`src/components/molecules/SkillsEditor/index.ts`:

```typescript
export { SkillsEditor } from "./SkillsEditor";
```

**Step 2: Create the component**

`src/components/molecules/SkillsEditor/SkillsEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PLAYER_SKILLS, type PlayerSkills } from "@/lib/constants";
import { Button } from "@/components/atoms/Button";
import { Slider } from "@/components/ui/slider";

interface SkillsEditorProps {
  skills: PlayerSkills;
  onSave: (skills: PlayerSkills) => void | Promise<void>;
  isSaving?: boolean;
}

export function SkillsEditor({ skills, onSave, isSaving }: SkillsEditorProps) {
  const [values, setValues] = useState<PlayerSkills>(() => {
    const initial: PlayerSkills = {};
    for (const skill of PLAYER_SKILLS) {
      initial[skill.key] = skills[skill.key] ?? 5;
    }
    return initial;
  });

  function handleChange(key: string, value: number[]) {
    setValues((prev) => ({ ...prev, [key]: value[0] }));
  }

  async function handleSave() {
    await onSave(values);
  }

  return (
    <div className="space-y-5">
      {PLAYER_SKILLS.map((skill) => (
        <div key={skill.key}>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-900">
              {skill.label}
            </label>
            <span className="min-w-[2ch] text-right text-sm font-semibold text-primary-700">
              {values[skill.key]}
            </span>
          </div>
          <Slider
            value={[values[skill.key]]}
            onValueChange={(value) => handleChange(skill.key, value)}
            min={1}
            max={10}
            step={1}
          />
        </div>
      ))}

      <Button
        onClick={handleSave}
        className="w-full"
        disabled={isSaving}
      >
        {isSaving ? "Opslaan..." : "Opslaan"}
      </Button>
    </div>
  );
}
```

**Step 3: Create stories**

`src/components/molecules/SkillsEditor/SkillsEditor.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkillsEditor } from "./SkillsEditor";

const meta: Meta<typeof SkillsEditor> = {
  title: "Molecules/SkillsEditor",
  component: SkillsEditor,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SkillsEditor>;

export const Default: Story = {
  args: {
    skills: {
      speed: 7,
      strength: 5,
      technique: 8,
      passing: 6,
      dribbling: 7,
      heading: 4,
      defending: 3,
      positioning: 6,
      finishing: 8,
      stamina: 7,
    },
    onSave: (skills) => {
      console.log("Saved skills:", skills);
    },
  },
};

export const Empty: Story = {
  args: {
    skills: {},
    onSave: (skills) => {
      console.log("Saved skills:", skills);
    },
  },
};

export const Saving: Story = {
  args: {
    skills: {
      speed: 7,
      technique: 8,
    },
    onSave: () => new Promise(() => {}),
    isSaving: true,
  },
};
```

**Step 4: Verify in Storybook**

```bash
npm run storybook
```

Navigate to Molecules/SkillsEditor. Verify sliders work, values update, button renders in all states.

**Step 5: Run tests**

```bash
npm run test
```

Expected: all tests pass.

**Step 6: Commit**

```bash
git add src/components/molecules/SkillsEditor/
git commit -m "feat: add SkillsEditor molecule with sliders for 10 skills"
```

---

### Task 6: Integrate into PlayerDetail

**Files:**
- Modify: `src/components/organisms/PlayerDetail/PlayerDetail.tsx`

**Step 1: Add imports**

Add these imports at the top of `PlayerDetail.tsx`:

```typescript
import { Radar } from "lucide-react";
import { SkillsRadar } from "@/components/molecules/SkillsRadar";
import { SkillsEditor } from "@/components/molecules/SkillsEditor";
import type { PlayerSkills } from "@/lib/constants";
```

**Step 2: Add skills sheet state**

After the existing `const [deleteOpen, setDeleteOpen] = useState(false);` (line 43), add:

```typescript
const [skillsOpen, setSkillsOpen] = useState(false);
```

**Step 3: Add skills section to the JSX**

Insert between the notes section and the stats section. Find this code block (around line 116):

```tsx
      {!isStaff && (
        <div className="mt-4">
          <PlayerStatsSection
```

Insert **before** it:

```tsx
      {!isStaff && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Vaardigheden
            </h2>
            {isCoach && (
              <Sheet open={skillsOpen} onOpenChange={setSkillsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Pencil className="mr-1 size-3.5" />
                    {Object.keys((player.skills as PlayerSkills) ?? {}).length > 0
                      ? "Bewerken"
                      : "Beoordelen"}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Vaardigheden beoordelen</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-4">
                    <SkillsEditor
                      skills={(player.skills as PlayerSkills) ?? {}}
                      onSave={async (skills) => {
                        await updatePlayer.mutateAsync({
                          id: player.id,
                          skills: skills as unknown as typeof player.skills,
                        });
                        setSkillsOpen(false);
                      }}
                      isSaving={updatePlayer.isPending}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          {Object.keys((player.skills as PlayerSkills) ?? {}).length > 0 ? (
            <SkillsRadar skills={(player.skills as PlayerSkills) ?? {}} />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Nog geen vaardigheden beoordeeld.
            </p>
          )}
        </div>
      )}
```

**Note:** The `player.skills` field from Supabase will be typed as `Json` (generic). We cast it to `PlayerSkills` using `as PlayerSkills`. The `as unknown as typeof player.skills` in the save call handles the reverse cast for the Supabase update.

**Step 4: Verify build**

```bash
npm run build
```

Expected: success, no TypeScript errors.

**Step 5: Run lint**

```bash
npm run lint
```

Expected: no errors.

**Step 6: Run tests**

```bash
npm run test
```

Expected: all tests pass.

**Step 7: Manual verification**

1. Start dev server: `npm run dev`
2. Navigate to a player detail page as coach
3. Verify "Vaardigheden" section appears with "Nog geen vaardigheden beoordeeld" and "Beoordelen" button
4. Click "Beoordelen" → bottom sheet opens with 10 sliders
5. Adjust sliders and click "Opslaan"
6. Radar chart appears with the values
7. Click "Bewerken" → sliders show saved values
8. Verify as non-coach user: radar chart visible but no edit button

**Step 8: Commit**

```bash
git add src/components/organisms/PlayerDetail/PlayerDetail.tsx
git commit -m "feat: integrate skills radar and editor into player detail page"
```

---

### Task 7: Final verification

**Step 1: Full test suite**

```bash
npm run build && npm run lint && npm run test
```

Expected: all pass.

**Step 2: Storybook check**

```bash
npm run storybook
```

Verify: SkillsRadar and SkillsEditor stories render without errors.
