# Landing Page Conversie-optimalisatie — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the landing page from an informational page into a conversion-optimized page with animated product demo, social proof, and sticky mobile CTA.

**Architecture:** Three new molecule components (HeroDemo, SocialProof, StickyCta) plus a rewrite of the existing `src/app/page.tsx`. HeroDemo uses Framer Motion AnimatePresence for a 3-step looping animation inside a phone frame. SocialProof fetches team count server-side and passes it as a prop. StickyCta uses IntersectionObserver to show/hide based on hero CTA visibility.

**Tech Stack:** Framer Motion (already installed), Tailwind CSS v4, Next.js Server Components, existing NumberCounter atom, IntersectionObserver API.

**Design doc:** `docs/plans/2026-03-04-landing-page-conversion-design.md`

---

## Task 1: Create HeroDemo component — phone frame shell

**Files:**
- Create: `src/components/molecules/HeroDemo/HeroDemo.tsx`
- Create: `src/components/molecules/HeroDemo/index.ts`

**Step 1: Create barrel export**

```ts
// src/components/molecules/HeroDemo/index.ts
export { HeroDemo } from "./HeroDemo";
```

**Step 2: Build the phone frame shell with step state machine**

Create `src/components/molecules/HeroDemo/HeroDemo.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/lib/animations";

type DemoStep = "availability" | "lineup" | "ready";

const STEP_DURATIONS: Record<DemoStep, number> = {
  availability: 2000,
  lineup: 2000,
  ready: 1500,
};

const STEPS: DemoStep[] = ["availability", "lineup", "ready"];

export function HeroDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("availability");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const idx = STEPS.indexOf(prev);
      return STEPS[(idx + 1) % STEPS.length];
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(advanceStep, STEP_DURATIONS[currentStep]);
    return () => clearTimeout(timer);
  }, [currentStep, advanceStep, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <PhoneFrame>
        <ReadyStep />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        {currentStep === "availability" && (
          <motion.div
            key="availability"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <AvailabilityStep />
          </motion.div>
        )}
        {currentStep === "lineup" && (
          <motion.div
            key="lineup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <LineupStep />
          </motion.div>
        )}
        {currentStep === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ReadyStep />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}

// --- Phone Frame ---

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      {/* Phone bezel */}
      <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
        {/* Screen */}
        <div className="relative aspect-[9/19.5] w-full overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Step components (placeholders — implemented in Tasks 2-4) ---

function AvailabilityStep() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <p className="text-xs text-neutral-400">Beschikbaarheid</p>
    </div>
  );
}

function LineupStep() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <p className="text-xs text-neutral-400">Opstelling</p>
    </div>
  );
}

function ReadyStep() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <p className="text-xs text-neutral-400">Klaar!</p>
    </div>
  );
}
```

**Step 3: Verify it renders**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/molecules/HeroDemo/
git commit -m "feat: add HeroDemo phone frame shell with step state machine"
```

---

## Task 2: HeroDemo — Availability step animation

**Files:**
- Modify: `src/components/molecules/HeroDemo/HeroDemo.tsx` (replace `AvailabilityStep`)

**Step 1: Replace the AvailabilityStep placeholder**

Replace the `AvailabilityStep` function in `HeroDemo.tsx` with:

```tsx
const DEMO_PLAYERS = [
  { name: "Daan", status: "available" as const },
  { name: "Sem", status: "available" as const },
  { name: "Luca", status: "unavailable" as const },
  { name: "Finn", status: "available" as const },
  { name: "Jesse", status: "maybe" as const },
  { name: "Milan", status: "available" as const },
];

const STATUS_COLORS = {
  available: "bg-success text-white",
  unavailable: "bg-danger text-white",
  maybe: "bg-warning text-white",
};

const STATUS_LABELS = {
  available: "Ja",
  unavailable: "Nee",
  maybe: "?",
};

function AvailabilityStep() {
  return (
    <div className="flex h-full flex-col pt-8 px-3">
      {/* Mini header */}
      <div className="mb-3 rounded-lg bg-primary-50 px-3 py-2">
        <p className="text-[10px] font-semibold text-primary-800">
          Zat 8 mrt — vs FC Hoorn
        </p>
      </div>

      {/* Player rows */}
      <div className="space-y-1.5">
        {DEMO_PLAYERS.map((player, i) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, ...spring.smooth }}
            className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-neutral-200 text-[8px] font-medium text-neutral-600">
                {player.name.charAt(0)}
              </div>
              <span className="text-[11px] font-medium text-neutral-800">
                {player.name}
              </span>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 + 0.15, ...spring.bouncy }}
              className={`flex size-6 items-center justify-center rounded-full text-[9px] font-bold ${STATUS_COLORS[player.status]}`}
            >
              {STATUS_LABELS[player.status]}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-3 text-center"
      >
        <p className="text-[11px] font-semibold text-primary-700">
          4/6 beschikbaar
        </p>
      </motion.div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/molecules/HeroDemo/HeroDemo.tsx
git commit -m "feat: add availability step animation to HeroDemo"
```

---

## Task 3: HeroDemo — Lineup step animation

**Files:**
- Modify: `src/components/molecules/HeroDemo/HeroDemo.tsx` (replace `LineupStep`)

**Step 1: Replace the LineupStep placeholder**

Replace the `LineupStep` function with:

```tsx
const FORMATION_POSITIONS = [
  // GK
  { x: 50, y: 90, name: "Sem" },
  // Defenders
  { x: 20, y: 72, name: "Finn" },
  { x: 40, y: 75, name: "Milan" },
  { x: 60, y: 75, name: "Luca" },
  { x: 80, y: 72, name: "Daan" },
  // Midfielders
  { x: 30, y: 50, name: "Jesse" },
  { x: 50, y: 45, name: "Tim" },
  { x: 70, y: 50, name: "Noah" },
  // Forwards
  { x: 25, y: 25, name: "Luuk" },
  { x: 50, y: 20, name: "Jayden" },
  { x: 75, y: 25, name: "Max" },
];

function LineupStep() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-emerald-600 to-emerald-700 pt-7">
      {/* Mini header */}
      <div className="mb-2 px-3">
        <p className="text-[10px] font-semibold text-white/90">
          Opstelling 4-3-3
        </p>
      </div>

      {/* Pitch lines */}
      <div className="relative mx-2 flex-1">
        {/* Center circle */}
        <div className="absolute left-1/2 top-[45%] size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        {/* Center line */}
        <div className="absolute left-2 right-2 top-[45%] h-px bg-white/20" />
        {/* Penalty areas */}
        <div className="absolute bottom-2 left-1/2 h-10 w-24 -translate-x-1/2 border border-b-0 border-white/20" />
        <div className="absolute left-1/2 top-2 h-10 w-24 -translate-x-1/2 border border-t-0 border-white/20" />

        {/* Players */}
        {FORMATION_POSITIONS.map((pos, i) => (
          <motion.div
            key={pos.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, ...spring.bouncy }}
            className="absolute flex flex-col items-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-white text-[7px] font-bold text-emerald-800 shadow-sm">
              {pos.name.charAt(0)}
            </div>
            <span className="mt-0.5 text-[6px] font-medium text-white/80">
              {pos.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/molecules/HeroDemo/HeroDemo.tsx
git commit -m "feat: add lineup step animation to HeroDemo"
```

---

## Task 4: HeroDemo — Ready step + Storybook stories

**Files:**
- Modify: `src/components/molecules/HeroDemo/HeroDemo.tsx` (replace `ReadyStep`)
- Create: `src/components/molecules/HeroDemo/HeroDemo.stories.tsx`

**Step 1: Replace the ReadyStep placeholder**

Replace the `ReadyStep` function with:

```tsx
function ReadyStep() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-emerald-600 to-emerald-700 pt-7">
      {/* Mini header */}
      <div className="mb-2 px-3">
        <p className="text-[10px] font-semibold text-white/90">
          Opstelling 4-3-3
        </p>
      </div>

      {/* Pitch lines (same as LineupStep) */}
      <div className="relative mx-2 flex-1">
        <div className="absolute left-1/2 top-[45%] size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="absolute left-2 right-2 top-[45%] h-px bg-white/20" />
        <div className="absolute bottom-2 left-1/2 h-10 w-24 -translate-x-1/2 border border-b-0 border-white/20" />
        <div className="absolute left-1/2 top-2 h-10 w-24 -translate-x-1/2 border border-t-0 border-white/20" />

        {/* Static players (all visible) */}
        {FORMATION_POSITIONS.map((pos) => (
          <div
            key={pos.name}
            className="absolute flex flex-col items-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-white text-[7px] font-bold text-emerald-800 shadow-sm">
              {pos.name.charAt(0)}
            </div>
            <span className="mt-0.5 text-[6px] font-medium text-white/80">
              {pos.name}
            </span>
          </div>
        ))}
      </div>

      {/* Share button with pulse */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...spring.smooth }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="rounded-full bg-white px-4 py-1.5 text-[10px] font-semibold text-emerald-800 shadow-lg"
        >
          Delen met team
        </motion.div>
      </motion.div>
    </div>
  );
}
```

**Step 2: Create Storybook stories**

Create `src/components/molecules/HeroDemo/HeroDemo.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroDemo } from "./HeroDemo";

const meta: Meta<typeof HeroDemo> = {
  title: "Molecules/HeroDemo",
  component: HeroDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[500px] items-center justify-center bg-primary-900 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroDemo>;

export const Default: Story = {};
```

**Step 3: Verify build and tests**

Run: `npm run build && npm run test:stories`
Expected: Build succeeds, stories pass.

**Step 4: Commit**

```bash
git add src/components/molecules/HeroDemo/
git commit -m "feat: complete HeroDemo with ready step and Storybook stories"
```

---

## Task 5: Create SocialProof component

**Files:**
- Create: `src/components/molecules/SocialProof/SocialProof.tsx`
- Create: `src/components/molecules/SocialProof/SocialProof.stories.tsx`
- Create: `src/components/molecules/SocialProof/index.ts`

**Step 1: Create barrel export**

```ts
// src/components/molecules/SocialProof/index.ts
export { SocialProof } from "./SocialProof";
```

**Step 2: Build the SocialProof component**

Create `src/components/molecules/SocialProof/SocialProof.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { NumberCounter } from "@/components/atoms/NumberCounter";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface CoachQuote {
  quote: string;
  name: string;
  team: string;
}

interface SocialProofProps {
  teamCount: number;
  quotes: CoachQuote[];
}

const MIN_TEAMS_FOR_COUNT = 5;

export function SocialProof({ teamCount, quotes }: SocialProofProps) {
  return (
    <section className="bg-neutral-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Team counter */}
        <div className="mb-8 text-center">
          {teamCount >= MIN_TEAMS_FOR_COUNT ? (
            <p className="text-lg font-semibold text-neutral-800">
              Al{" "}
              <NumberCounter
                value={teamCount}
                className="text-primary-600"
              />{" "}
              teams gebruiken MyTeamPlanner
            </p>
          ) : (
            <p className="text-lg font-semibold text-neutral-800">
              Coaches in heel Nederland gebruiken MyTeamPlanner
            </p>
          )}
        </div>

        {/* Coach quotes */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0"
        >
          {quotes.map((item) => (
            <motion.div
              key={item.name}
              variants={staggerItem}
              className="w-[280px] shrink-0 rounded-xl border border-neutral-200 bg-white p-5 sm:w-auto"
            >
              <Quote className="mb-2 size-5 text-primary-300" />
              <p className="text-sm italic leading-relaxed text-neutral-700">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-3">
                <p className="text-sm font-semibold text-neutral-900">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">{item.team}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 3: Create Storybook stories**

Create `src/components/molecules/SocialProof/SocialProof.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialProof } from "./SocialProof";

const DEMO_QUOTES = [
  {
    quote:
      "Eindelijk weet ik op donderdag al wie er zaterdag kan spelen.",
    name: "Coach Willem",
    team: "Be Fair 5",
  },
  {
    quote:
      "Mijn spelers vinden het geweldig dat ze de opstelling in de app kunnen zien.",
    name: "Trainer Karin",
    team: "VV Drieberg JO13",
  },
  {
    quote:
      "Het wisselschema bespaart me elke week minstens een kwartier.",
    name: "Coach Martijn",
    team: "DSVP G1",
  },
];

const meta: Meta<typeof SocialProof> = {
  title: "Molecules/SocialProof",
  component: SocialProof,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="-m-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SocialProof>;

export const WithTeamCount: Story = {
  args: {
    teamCount: 23,
    quotes: DEMO_QUOTES,
  },
};

export const FewTeams: Story = {
  args: {
    teamCount: 3,
    quotes: DEMO_QUOTES,
  },
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test:stories`
Expected: Build succeeds, all stories pass.

**Step 5: Commit**

```bash
git add src/components/molecules/SocialProof/
git commit -m "feat: add SocialProof component with team counter and coach quotes"
```

---

## Task 6: Create StickyCta component

**Files:**
- Create: `src/components/molecules/StickyCta/StickyCta.tsx`
- Create: `src/components/molecules/StickyCta/StickyCta.stories.tsx`
- Create: `src/components/molecules/StickyCta/index.ts`

**Step 1: Create barrel export**

```ts
// src/components/molecules/StickyCta/index.ts
export { StickyCta } from "./StickyCta";
```

**Step 2: Build the StickyCta component**

Create `src/components/molecules/StickyCta/StickyCta.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { spring } from "@/lib/animations";

interface StickyCtaProps {
  /** Ref ID of the hero CTA element to observe */
  targetId: string;
}

export function StickyCta({ targetId }: StickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when hero CTA is NOT visible
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={spring.snappy}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden"
        >
          <Link
            href="/register"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary-600 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
          >
            Maak je team aan
            <ArrowRight className="size-4" />
          </Link>
          <p className="mt-1 text-center text-[11px] text-muted-foreground">
            Gratis · Geen creditcard nodig
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 3: Create Storybook stories**

Create `src/components/molecules/StickyCta/StickyCta.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyCta } from "./StickyCta";

const meta: Meta<typeof StickyCta> = {
  title: "Molecules/StickyCta",
  component: StickyCta,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[200vh]">
        {/* Fake hero CTA that can be scrolled out of view */}
        <div className="bg-primary-800 p-8">
          <button
            id="hero-cta-demo"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-primary-800"
          >
            Maak je team aan
          </button>
        </div>
        <div className="p-8">
          <p className="text-muted-foreground">
            Scroll naar beneden om de sticky CTA te zien verschijnen.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StickyCta>;

export const Default: Story = {
  args: {
    targetId: "hero-cta-demo",
  },
};
```

**Step 4: Verify build and tests**

Run: `npm run build && npm run test:stories`
Expected: Build succeeds, all stories pass.

**Step 5: Commit**

```bash
git add src/components/molecules/StickyCta/
git commit -m "feat: add StickyCta component with IntersectionObserver visibility"
```

---

## Task 7: Rewrite the landing page — Hero section

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Rewrite the hero section**

Replace the entire hero `<section>` (lines 116-164) with the new split-screen layout:

```tsx
{/* Hero section */}
<section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
  {/* Football pitch pattern */}
  <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white" />
    <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
    <div className="absolute inset-y-[10%] left-0 w-[20%] border-[3px] border-l-0 border-white" />
    <div className="absolute inset-y-[10%] right-0 w-[20%] border-[3px] border-r-0 border-white" />
  </div>

  <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 sm:pb-20 sm:pt-16">
    <div className="flex flex-col items-center gap-10 md:flex-row md:gap-12">
      {/* Left — Text */}
      <div className="flex-1 text-center md:text-left">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full bg-primary-500/20 px-3 py-1 text-xs font-medium text-primary-200">
          Gratis voor amateurvoetbal
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          Nooit meer &lsquo;wie kan er zaterdag?&rsquo; in de groepsapp
        </h1>
        <p className="mt-4 max-w-lg text-base text-white/80 sm:text-lg md:mx-0">
          De gratis teamplanner voor amateurvoetbal. Beschikbaarheid,
          opstellingen en wedstrijden — alles in een app.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
          <Link
            id="hero-cta"
            href="/register"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary-800 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Maak je team aan
            <ArrowRight className="size-5" />
          </Link>
          <a
            href="#functies"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Bekijk hoe het werkt ↓
          </a>
        </div>

        <p className="mt-3 text-xs text-white/40">
          Gratis · Geen creditcard · Klaar in 30 seconden
        </p>
      </div>

      {/* Right — Animated Demo */}
      <div className="flex-shrink-0">
        <HeroDemo />
      </div>
    </div>
  </div>
</section>
```

**Step 2: Update imports at the top of page.tsx**

Add the HeroDemo import. The updated imports block:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Calendar,
  Users,
  ClipboardList,
  ArrowRight,
  PartyPopper,
  Smartphone,
  Shield,
  Zap,
} from "lucide-react";
import { FaqSection } from "@/components/molecules/FaqSection";
import { MarketingFooter } from "@/components/organisms/MarketingFooter";
import { HeroDemo } from "@/components/molecules/HeroDemo";
import { SocialProof } from "@/components/molecules/SocialProof";
import { StickyCta } from "@/components/molecules/StickyCta";
import { createClient } from "@/lib/supabase/server";
```

Remove the `Image` import since the logo is no longer used in the hero. Also remove `Shield`, `Zap`, `Smartphone` if benefits section is kept — actually keep them for now.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds (HeroDemo is a client component imported into a server component — this is fine in Next.js).

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite hero section with split-screen layout and HeroDemo"
```

---

## Task 8: Integrate SocialProof + StickyCta into landing page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Make the page an async server component and fetch team count**

Change the function signature and add the team count query. The page is already a server component (no `"use client"` directive), so we can use async:

```tsx
export default async function LandingPage() {
  // Fetch team count for social proof
  const supabase = await createClient();
  const { count: teamCount } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true });
```

**Step 2: Add the coach quotes data**

Add this constant alongside the existing `features`, `faqItems`, and `benefits` arrays:

```tsx
const coachQuotes = [
  {
    quote: "Eindelijk weet ik op donderdag al wie er zaterdag kan spelen.",
    name: "Coach Willem",
    team: "Be Fair 5",
  },
  {
    quote:
      "Mijn spelers vinden het geweldig dat ze de opstelling in de app kunnen zien.",
    name: "Trainer Karin",
    team: "VV Drieberg JO13",
  },
  {
    quote: "Het wisselschema bespaart me elke week minstens een kwartier.",
    name: "Coach Martijn",
    team: "DSVP G1",
  },
];
```

**Step 3: Add SocialProof after the hero section**

Insert between the hero `</section>` and the features `<section>`:

```tsx
{/* Social proof */}
<SocialProof teamCount={teamCount ?? 0} quotes={coachQuotes} />
```

**Step 4: Add StickyCta before closing `</div>`**

Insert just before the closing `</div>` of the page (before `<MarketingFooter />`):

```tsx
<StickyCta targetId="hero-cta" />
```

**Step 5: Remove the unused `Image` import**

The logo is no longer displayed in the hero. Remove the `Image` import from `next/image` if it's no longer used anywhere else in the file.

**Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds. The landing page now fetches team count server-side and renders HeroDemo, SocialProof, and StickyCta.

**Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate SocialProof and StickyCta into landing page"
```

---

## Task 9: Improve feature cards with visual indicators

**Files:**
- Modify: `src/app/page.tsx` (features section)

**Step 1: Add visual mini-illustrations to feature cards**

Replace the features section (the grid of 4 cards) with enhanced versions that include a small visual element. Update the `features` array to include an illustration component:

```tsx
const features = [
  {
    icon: Calendar,
    title: "Wedstrijden",
    description:
      "Plan wedstrijden, importeer programma's van je club en houd de stand bij.",
    color: "bg-primary-100 text-primary-700",
    href: "/features/wedstrijden",
    illustration: (
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/80 p-2 text-[10px]">
        <div className="rounded bg-primary-100 px-1.5 py-0.5 font-medium text-primary-700">Za 14:30</div>
        <span className="font-medium text-neutral-700">vs FC Hoorn</span>
        <span className="ml-auto font-bold text-neutral-900">3 - 1</span>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Beschikbaarheid",
    description:
      "Spelers geven met een tik aan of ze er zijn. Geen eindeloze WhatsApp-berichten meer.",
    color: "bg-success-100 text-success-700",
    href: "/features/beschikbaarheid",
    illustration: (
      <div className="mt-3 flex gap-1.5">
        {["bg-success", "bg-success", "bg-danger", "bg-success", "bg-warning", "bg-success"].map((c, i) => (
          <div key={i} className={`size-4 rounded-full ${c}`} />
        ))}
        <span className="ml-1 text-[10px] font-medium text-neutral-500">4/6</span>
      </div>
    ),
  },
  {
    icon: ClipboardList,
    title: "Opstellingen & Wissels",
    description:
      "Sleep spelers naar het veld. Automatisch wisselschema met eerlijke speeltijd.",
    color: "bg-warning-100 text-warning-700",
    href: "/features/opstellingen",
    illustration: (
      <div className="mt-3 flex items-center gap-2">
        <div className="relative size-10 rounded bg-emerald-600">
          {[{x:50,y:20},{x:25,y:50},{x:75,y:50},{x:50,y:80}].map((p, i) => (
            <div key={i} className="absolute size-1.5 rounded-full bg-white" style={{left:`${p.x}%`,top:`${p.y}%`,transform:'translate(-50%,-50%)'}} />
          ))}
        </div>
        <span className="text-[10px] text-neutral-500">4-3-3</span>
      </div>
    ),
  },
  {
    icon: PartyPopper,
    title: "Trainingen & Evenementen",
    description:
      "Kant-en-klare trainingsoefeningen en teamactiviteiten organiseren.",
    color: "bg-danger-100 text-danger-700",
    href: "/features/trainingen",
    illustration: (
      <div className="mt-3 flex flex-wrap gap-1">
        {["Positiespel", "Afwerken", "Warming-up"].map((tag) => (
          <span key={tag} className="rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-medium text-neutral-600">{tag}</span>
        ))}
      </div>
    ),
  },
];
```

**Step 2: Render the illustration in the card**

Update the card rendering to include the illustration. After the `<p>` description, add:

```tsx
{feature.illustration}
```

The full card becomes:

```tsx
<Link
  key={feature.title}
  href={feature.href}
  className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 transition-shadow hover:shadow-md"
>
  <div
    className={`inline-flex size-12 items-center justify-center rounded-xl ${feature.color}`}
  >
    <feature.icon className="size-6" />
  </div>
  <h3 className="mt-4 text-lg font-semibold text-neutral-900">
    {feature.title}
  </h3>
  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
    {feature.description}
  </p>
  {feature.illustration}
</Link>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add visual mini-illustrations to feature cards"
```

---

## Task 10: Improve "Zo werkt het" section with visual indicators

**Files:**
- Modify: `src/app/page.tsx` ("How it works" section)

**Step 1: Add visual elements to the steps**

Replace the steps data and rendering:

```tsx
{[
  {
    step: "1",
    title: "Maak je team aan",
    description:
      "Registreer je en maak je team aan in een paar klikken.",
    illustration: (
      <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm">
        <Users className="size-4 text-primary-600" />
        <span className="text-xs font-medium text-neutral-700">VV Drieberg JO13</span>
      </div>
    ),
  },
  {
    step: "2",
    title: "Deel de link in WhatsApp",
    description:
      "Spelers joinen met een tik via de uitnodigingslink.",
    illustration: (
      <div className="mx-auto mb-3 w-fit rounded-lg bg-[#dcf8c6] px-3 py-2 text-left shadow-sm">
        <p className="text-[10px] font-medium text-neutral-800">
          Doe mee met VV Drieberg JO13!
        </p>
        <p className="text-[9px] text-blue-600 underline">
          myteamplanner.nl/join/abc123
        </p>
      </div>
    ),
  },
  {
    step: "3",
    title: "Klaar! Spelers reageren direct",
    description:
      "Spelers geven beschikbaarheid door en jij maakt de opstelling.",
    illustration: (
      <div className="mx-auto mb-3 flex w-fit gap-1">
        {[
          "bg-success",
          "bg-success",
          "bg-danger",
          "bg-success",
          "bg-warning",
        ].map((c, i) => (
          <div key={i} className={`size-3.5 rounded-full ${c}`} />
        ))}
      </div>
    ),
  },
].map((item) => (
  <div key={item.step} className="text-center">
    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
      {item.step}
    </div>
    {item.illustration}
    <h3 className="mt-2 font-semibold text-neutral-900">
      {item.title}
    </h3>
    <p className="mt-2 text-sm text-muted-foreground">
      {item.description}
    </p>
  </div>
))}
```

**Step 2: Add the Users import if not already present**

`Users` is already imported from lucide-react in the current file, so no changes needed.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add visual indicators to how-it-works steps"
```

---

## Task 11: Final verification and integration test

**Files:**
- No new files

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Run linter**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Run all tests**

Run: `npm run test`
Expected: All tests pass (unit + storybook). The 2 new story files (HeroDemo, SocialProof, StickyCta) render without errors.

**Step 4: Visual check in dev server**

Run: `npm run dev`
Open http://localhost:3000 and verify:
- Hero shows split layout with HeroDemo animation on the right
- Badge "Gratis voor amateurvoetbal" appears above the H1
- Social proof section appears below hero with team count and quotes
- Feature cards have mini-illustrations
- "Zo werkt het" steps have visual indicators
- Sticky CTA appears on mobile when scrolling past hero
- `prefers-reduced-motion` shows static screenshot

**Step 5: Check Storybook**

Run: `npm run storybook`
Open http://localhost:6006 and verify:
- HeroDemo story renders animated phone demo
- SocialProof stories show both variants (with/without count)
- StickyCta story demonstrates scroll behavior

**Step 6: Commit final adjustments (if any)**

```bash
git add -A
git commit -m "fix: address integration issues from visual review"
```

---

## Summary

| Task | Component | Description |
|------|-----------|-------------|
| 1 | HeroDemo | Phone frame shell + step state machine |
| 2 | HeroDemo | Availability step animation |
| 3 | HeroDemo | Lineup step animation |
| 4 | HeroDemo | Ready step + Storybook stories |
| 5 | SocialProof | Team counter + coach quotes + stories |
| 6 | StickyCta | Sticky mobile CTA + stories |
| 7 | page.tsx | Rewrite hero section (split-screen) |
| 8 | page.tsx | Integrate SocialProof + StickyCta + server-side count |
| 9 | page.tsx | Feature cards with mini-illustrations |
| 10 | page.tsx | "Zo werkt het" visual improvements |
| 11 | — | Full build, lint, test, visual verification |

**New files:** 9 (3 components × 3 files each)
**Modified files:** 1 (`src/app/page.tsx`)
**New dependencies:** None
**Database changes:** None
