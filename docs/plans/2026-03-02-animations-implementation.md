# Animations & Micro-interactions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Framer Motion animations throughout the app to create a premium EAFC-companion feel with spring physics, staggered lists, skeleton loaders, and micro-interactions.

**Architecture:** Install `framer-motion`, create shared animation config (`src/lib/animations.ts`), build reusable animated atoms (AnimatedList, Skeleton, NumberCounter), then progressively enhance existing components. All animations respect `prefers-reduced-motion`.

**Tech Stack:** Framer Motion 12.x, React 19, Next.js 16 App Router, Tailwind CSS v4, class-variance-authority

---

## Task 1: Install Framer Motion & Create Animation Config

**Files:**
- Modify: `package.json`
- Create: `src/lib/animations.ts`
- Test: `src/lib/__tests__/animations.test.ts`

**Step 1: Install framer-motion**

Run: `npm install framer-motion`

**Step 2: Create shared animation config**

Create `src/lib/animations.ts`:

```typescript
import type { Transition, Variants } from "framer-motion";

// --- Spring presets ---

export const spring = {
  snappy: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  smooth: { type: "spring", stiffness: 200, damping: 25 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 15 } as Transition,
};

// --- Transition presets ---

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: spring.smooth },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// --- Stagger container ---

export function staggerContainer(staggerDelay = 0.03): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };
}

// --- Stagger item (use inside a stagger container) ---

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: spring.smooth },
};
```

**Step 3: Write unit tests**

Create `src/lib/__tests__/animations.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { spring, fadeIn, slideUp, scaleIn, staggerContainer, staggerItem } from "../animations";

describe("animations", () => {
  it("exports spring presets with correct stiffness", () => {
    expect(spring.snappy).toHaveProperty("stiffness", 300);
    expect(spring.smooth).toHaveProperty("stiffness", 200);
    expect(spring.bouncy).toHaveProperty("stiffness", 400);
  });

  it("exports fadeIn variants with hidden and visible states", () => {
    expect(fadeIn.hidden).toHaveProperty("opacity", 0);
    expect(fadeIn.visible).toHaveProperty("opacity", 1);
  });

  it("exports slideUp variants with y offset", () => {
    expect(slideUp.hidden).toHaveProperty("y", 12);
    expect(slideUp.visible).toHaveProperty("y", 0);
  });

  it("exports scaleIn variants", () => {
    expect(scaleIn.hidden).toHaveProperty("scale", 0.95);
    expect(scaleIn.visible).toHaveProperty("scale", 1);
  });

  it("staggerContainer creates variants with correct delay", () => {
    const container = staggerContainer(0.05);
    const visible = container.visible as { transition: { staggerChildren: number } };
    expect(visible.transition.staggerChildren).toBe(0.05);
  });

  it("staggerItem has hidden and visible states", () => {
    expect(staggerItem.hidden).toHaveProperty("opacity", 0);
    expect(staggerItem.visible).toHaveProperty("opacity", 1);
  });
});
```

**Step 4: Run tests**

Run: `npm run test:unit`
Expected: All tests pass

**Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/animations.ts src/lib/__tests__/animations.test.ts
git commit -m "feat: add framer-motion and shared animation config"
```

---

## Task 2: Create Skeleton Loader Atom

**Files:**
- Create: `src/components/atoms/Skeleton/Skeleton.tsx`
- Create: `src/components/atoms/Skeleton/Skeleton.stories.tsx`
- Create: `src/components/atoms/Skeleton/index.ts`

**Step 1: Create the Skeleton component**

Create `src/components/atoms/Skeleton/Skeleton.tsx`:

```typescript
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-neutral-200",
        variant === "text" && "h-4 rounded-md",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-lg",
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
```

**Step 2: Create barrel export**

Create `src/components/atoms/Skeleton/index.ts`:

```typescript
export { Skeleton } from "./Skeleton";
```

**Step 3: Create stories**

Create `src/components/atoms/Skeleton/Skeleton.stories.tsx`:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  args: { variant: "text", className: "w-48" },
};

export const Circular: Story = {
  args: { variant: "circular", className: "size-12" },
};

export const Rectangular: Story = {
  args: { variant: "rectangular", className: "h-24 w-full" },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-64 space-y-3 rounded-xl border border-neutral-200 p-4">
      <Skeleton variant="rectangular" className="h-32 w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2">
        <Skeleton variant="circular" className="size-6" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  ),
};

export const MatchCardSkeleton: Story = {
  render: () => (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-3 w-16" />
        </div>
        <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-3 w-20" />
      </div>
    </div>
  ),
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 5: Commit**

```bash
git add src/components/atoms/Skeleton/
git commit -m "feat: add Skeleton loader atom component"
```

---

## Task 3: Create AnimatedList Atom

**Files:**
- Create: `src/components/atoms/AnimatedList/AnimatedList.tsx`
- Create: `src/components/atoms/AnimatedList/AnimatedList.stories.tsx`
- Create: `src/components/atoms/AnimatedList/index.ts`

**Step 1: Create AnimatedList component**

Create `src/components/atoms/AnimatedList/AnimatedList.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList({
  children,
  className,
  staggerDelay = 0.03,
}: AnimatedListProps) {
  return (
    <motion.div
      variants={staggerContainer(staggerDelay)}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedListItem({ children, className }: AnimatedListItemProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
```

**Step 2: Create barrel export**

Create `src/components/atoms/AnimatedList/index.ts`:

```typescript
export { AnimatedList, AnimatedListItem } from "./AnimatedList";
```

**Step 3: Create stories**

Create `src/components/atoms/AnimatedList/AnimatedList.stories.tsx`:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedList, AnimatedListItem } from "./AnimatedList";

const meta: Meta<typeof AnimatedList> = {
  title: "Atoms/AnimatedList",
  component: AnimatedList,
};

export default meta;
type Story = StoryObj<typeof AnimatedList>;

export const Default: Story = {
  render: () => (
    <AnimatedList className="space-y-2">
      {Array.from({ length: 6 }, (_, i) => (
        <AnimatedListItem key={i}>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            Item {i + 1}
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
};

export const SlowStagger: Story = {
  render: () => (
    <AnimatedList staggerDelay={0.1} className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <AnimatedListItem key={i}>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            Slow item {i + 1}
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 5: Commit**

```bash
git add src/components/atoms/AnimatedList/
git commit -m "feat: add AnimatedList atom with stagger animations"
```

---

## Task 4: Create NumberCounter Atom

**Files:**
- Create: `src/components/atoms/NumberCounter/NumberCounter.tsx`
- Create: `src/components/atoms/NumberCounter/NumberCounter.stories.tsx`
- Create: `src/components/atoms/NumberCounter/index.ts`

**Step 1: Create NumberCounter component**

Create `src/components/atoms/NumberCounter/NumberCounter.tsx`:

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberCounterProps {
  value: number;
  className?: string;
  duration?: number;
}

export function NumberCounter({ value, className, duration = 0.8 }: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
    duration,
  });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
    return unsubscribe;
  }, [springValue]);

  return <motion.span ref={ref} className={cn(className)}>0</motion.span>;
}
```

**Step 2: Create barrel export**

Create `src/components/atoms/NumberCounter/index.ts`:

```typescript
export { NumberCounter } from "./NumberCounter";
```

**Step 3: Create stories**

Create `src/components/atoms/NumberCounter/NumberCounter.stories.tsx`:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { NumberCounter } from "./NumberCounter";

const meta: Meta<typeof NumberCounter> = {
  title: "Atoms/NumberCounter",
  component: NumberCounter,
};

export default meta;
type Story = StoryObj<typeof NumberCounter>;

export const Default: Story = {
  args: { value: 88, className: "text-3xl font-bold" },
};

export const SmallNumber: Story = {
  args: { value: 7, className: "text-lg font-semibold" },
};

export const LargeNumber: Story = {
  args: { value: 256, className: "text-4xl font-bold text-primary-600" },
};

export const RatingCounter: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <NumberCounter value={88} className="text-3xl font-bold" />
        <div className="text-xs text-muted-foreground">OVR</div>
      </div>
      <div className="text-center">
        <NumberCounter value={92} className="text-xl font-bold" />
        <div className="text-xs text-muted-foreground">SNE</div>
      </div>
      <div className="text-center">
        <NumberCounter value={78} className="text-xl font-bold" />
        <div className="text-xs text-muted-foreground">PAS</div>
      </div>
    </div>
  ),
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 5: Commit**

```bash
git add src/components/atoms/NumberCounter/
git commit -m "feat: add NumberCounter atom with spring animation"
```

---

## Task 5: Add Shimmer Effect to Gold PlayerCards

**Files:**
- Modify: `src/components/atoms/PlayerCard/PlayerCard.tsx`
- Modify: `src/components/atoms/PlayerCard/PlayerCard.stories.tsx`

**Step 1: Add shimmer CSS to PlayerCard**

In `src/components/atoms/PlayerCard/PlayerCard.tsx`, add a shimmer overlay to the LargeCard and MediumCard when tier is "gold".

Add after the imports at the top:

```typescript
// Shimmer overlay for gold cards
function GoldShimmer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <div
        className="absolute -left-full top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        style={{
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
    </div>
  );
}
```

Add shimmer to LargeCard and MediumCard: insert `{tier === "gold" && <GoldShimmer />}` as last child inside the card wrapper div.

Add the keyframe animation. In `src/styles/tokens.css` inside `:root {}`, or better — add to `src/app/globals.css`:

```css
@keyframes shimmer {
  0%, 100% { transform: translateX(-100%) rotate(12deg); }
  50% { transform: translateX(300%) rotate(12deg); }
}
```

**Step 2: Update stories to showcase shimmer**

Add to stories file a dedicated GoldShimmer story that renders a large gold card.

**Step 3: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 4: Commit**

```bash
git add src/components/atoms/PlayerCard/ src/app/globals.css
git commit -m "feat: add shimmer effect to gold player cards"
```

---

## Task 6: Animate PlayerDetail Hero Card

**Files:**
- Modify: `src/components/organisms/PlayerDetail/PlayerDetail.tsx`

**Step 1: Add motion imports and animate hero section**

At the top of `PlayerDetail.tsx`, add:

```typescript
import { motion } from "framer-motion";
import { scaleIn, slideUp, spring } from "@/lib/animations";
```

Wrap the hero card section (lines 84-97, the `PlayerCardDisplay` area) with:

```tsx
<motion.div
  className="flex flex-col items-center gap-3"
  initial={{ opacity: 0, scale: 0.9, y: -20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={spring.bouncy}
>
  <PlayerCardDisplay ... />
  ...
</motion.div>
```

Also wrap the fallback avatar section (lines 98-137) with the same animation.

Wrap the skills section and stats section with `slideUp` variants:

```tsx
<motion.div
  variants={slideUp}
  initial="hidden"
  animate="visible"
  className="mt-6"
>
  {/* Skills section */}
</motion.div>
```

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/components/organisms/PlayerDetail/PlayerDetail.tsx
git commit -m "feat: add entrance animations to PlayerDetail hero card"
```

---

## Task 7: Animate Lists (MatchList, PlayerList, EventList)

**Files:**
- Modify: `src/components/organisms/MatchList/MatchList.tsx`
- Modify: `src/components/organisms/PlayerList/PlayerList.tsx`
- Modify: `src/components/organisms/EventList/EventList.tsx`

**Step 1: Wrap list renders with AnimatedList**

For each list component, import and wrap the list items:

```typescript
import { AnimatedList, AnimatedListItem } from "@/components/atoms/AnimatedList";
```

Replace the list container with `<AnimatedList>` and wrap each item with `<AnimatedListItem>`.

Example pattern for MatchList:

```tsx
// Before:
<div className="space-y-3">
  {matches.map((match) => (
    <MatchCard key={match.id} match={match} ... />
  ))}
</div>

// After:
<AnimatedList className="space-y-3">
  {matches.map((match) => (
    <AnimatedListItem key={match.id}>
      <MatchCard match={match} ... />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

Apply the same pattern to PlayerList and EventList.

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/components/organisms/MatchList/ src/components/organisms/PlayerList/ src/components/organisms/EventList/
git commit -m "feat: add staggered entrance animations to list components"
```

---

## Task 8: Animate NavigationBar Active Indicator

**Files:**
- Modify: `src/components/organisms/NavigationBar/NavigationBar.tsx`

**Step 1: Add motion active indicator**

Import framer-motion and add a `layoutId` animated pill behind the active tab:

```typescript
import { motion } from "framer-motion";
```

Inside the nav item render, add a motion div behind the active icon:

```tsx
<div className="relative flex size-8 items-center justify-center rounded-full">
  {isActive && (
    <motion.div
      layoutId="nav-indicator"
      className="absolute inset-0 rounded-full bg-primary-100"
      transition={spring.smooth}
    />
  )}
  <item.icon className={cn("relative size-5", isActive && "text-primary-700")} />
</div>
```

The `layoutId` makes the pill smoothly slide between tabs when switching.

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/components/organisms/NavigationBar/
git commit -m "feat: add sliding active indicator to NavigationBar"
```

---

## Task 9: Animate AvailabilityToggle

**Files:**
- Modify: `src/components/molecules/AvailabilityToggle/AvailabilityToggle.tsx`

**Step 1: Add motion tap animation**

Import framer-motion:

```typescript
import { motion } from "framer-motion";
```

Replace the `<button>` with `<motion.button>` and add tap/scale animation:

```tsx
<motion.button
  key={option.status}
  type="button"
  onClick={() => onChange(option.status)}
  disabled={disabled}
  whileTap={{ scale: 0.95 }}
  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
  transition={spring.snappy}
  className={cn(
    "flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? option.activeClass
      : "border-border text-muted-foreground hover:bg-accent/50",
    disabled && "cursor-not-allowed opacity-50"
  )}
>
  <Icon className="size-4" />
  <span className="hidden sm:inline">{option.label}</span>
</motion.button>
```

The `animate` with scale array creates a subtle bounce when becoming active. `whileTap` gives tactile feedback.

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/components/molecules/AvailabilityToggle/
git commit -m "feat: add bounce animation to AvailabilityToggle"
```

---

## Task 10: Enhance PitchPlayer Drag & Drop

**Files:**
- Modify: `src/components/molecules/PitchPlayer/PitchPlayer.tsx`

**Step 1: Add motion scale and shadow during drag**

Import framer-motion:

```typescript
import { motion } from "framer-motion";
```

Replace the outer `<div>` with `<motion.div>` and add drag-state animations:

```tsx
<motion.div
  ref={setNodeRef}
  style={style}
  animate={{
    scale: isDragging ? 1.15 : 1,
    zIndex: isDragging ? 50 : 1,
  }}
  transition={spring.snappy}
  className={cn(
    "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center",
    draggable && "cursor-grab touch-none",
    isDragging && "cursor-grabbing"
  )}
  {...(draggable ? { ...listeners, ...attributes } : {})}
>
```

Remove the old `isDragging && "z-50 ... opacity-80"` classes since motion handles it now.

Add a drop shadow during drag via `filter`:

```tsx
animate={{
  scale: isDragging ? 1.15 : 1,
  zIndex: isDragging ? 50 : 1,
  filter: isDragging ? "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" : "drop-shadow(0 0 0 rgba(0,0,0,0))",
}}
```

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/components/molecules/PitchPlayer/
git commit -m "feat: add scale and shadow animation to PitchPlayer drag"
```

---

## Task 11: Animate LineupField Player Entrance

**Files:**
- Modify: `src/components/organisms/LineupField/LineupField.tsx`

**Step 1: Stagger players appearing on pitch**

Import framer-motion:

```typescript
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, spring } from "@/lib/animations";
```

Wrap the pitch area (the div containing formationSlots.map) with a motion container:

```tsx
<motion.div
  variants={staggerContainer(0.05)}
  initial="hidden"
  animate="visible"
  className="relative aspect-[68/105] w-full overflow-hidden rounded-lg bg-green-600"
>
  {/* field markings */}
  ...
  {/* players */}
  {formationSlots.map((slot, index) => (
    <motion.div key={index} variants={staggerItem}>
      {/* existing PitchPlayer or empty slot render */}
    </motion.div>
  ))}
</motion.div>
```

Do the same for the bench section — wrap with AnimatedList.

**Step 2: Animate save button entrance**

Wrap the save button (appears when `hasChanges`) with:

```tsx
{hasChanges && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={spring.bouncy}
  >
    <Button ...>Opstelling opslaan</Button>
  </motion.div>
)}
```

**Step 3: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 4: Commit**

```bash
git add src/components/organisms/LineupField/
git commit -m "feat: add staggered entrance animations to LineupField"
```

---

## Task 12: Replace Page-Level Spinners with Skeletons

**Files:**
- Modify: `src/app/(main)/loading.tsx`
- Modify: `src/app/(main)/matches/loading.tsx`
- Modify: `src/app/(main)/matches/[id]/loading.tsx`
- Modify: `src/app/(main)/team/loading.tsx`
- Modify: `src/app/(main)/events/loading.tsx`

**Step 1: Create page-specific skeleton layouts**

Replace the generic `<Spinner />` in each loading file with contextual skeleton layouts.

Example for `src/app/(main)/matches/loading.tsx`:

```tsx
import { Skeleton } from "@/components/atoms/Skeleton";

export default function MatchesLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="text" className="h-7 w-32" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-5 w-32" />
              <Skeleton variant="text" className="h-3 w-16" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

Create similar contextual skeletons for team (player list), events, and the main dashboard.

**Step 2: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build passes, all tests pass

**Step 3: Commit**

```bash
git add src/app/
git commit -m "feat: replace page-level spinners with skeleton loaders"
```

---

## Task 13: Final Verification & Cleanup

**Step 1: Full build check**

Run: `npm run build`
Expected: No errors

**Step 2: Lint check**

Run: `npm run lint`
Expected: 0 errors

**Step 3: Full test suite**

Run: `npm run test`
Expected: All tests pass (unit + storybook)

**Step 4: Visual verification in Storybook**

Run: `npm run storybook`
Check: All new components render correctly with animations

**Step 5: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: animation polish and cleanup"
```
