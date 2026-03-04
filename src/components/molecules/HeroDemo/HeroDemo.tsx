"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/lib/animations";

type DemoStep = "availability" | "lineup" | "ready";

const STEP_DURATIONS: Record<DemoStep, number> = {
  availability: 4000,
  lineup: 4000,
  ready: 3000,
};

const STEPS: DemoStep[] = ["availability", "lineup", "ready"];

function useReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function HeroDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("availability");
  const prefersReducedMotion = useReducedMotion();

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

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
        <div className="relative aspect-[9/19.5] w-full overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Demo data ---
// Matches real app: Avatar (initials) + name + Badge (pill with label)

const DEMO_PLAYERS = [
  { name: "Daan V.", status: "available" as const },
  { name: "Sem B.", status: "available" as const },
  { name: "Luca M.", status: "unavailable" as const },
  { name: "Finn D.", status: "available" as const },
  { name: "Jesse K.", status: "maybe" as const },
  { name: "Milan R.", status: "available" as const },
];

const STATUS_BADGE = {
  available: { bg: "bg-success/10", text: "text-success", label: "Beschikbaar" },
  unavailable: { bg: "bg-danger/10", text: "text-danger", label: "Afwezig" },
  maybe: { bg: "bg-warning/10", text: "text-warning", label: "Misschien" },
};

// Matches real LineupView: bg-green-600, border-white/40, size-10 primary dots
const FORMATION_POSITIONS = [
  { x: 50, y: 90, label: "K", name: "Sem" },
  { x: 20, y: 72, label: "LV", name: "Finn" },
  { x: 40, y: 75, label: "CV", name: "Milan" },
  { x: 60, y: 75, label: "CV", name: "Luca" },
  { x: 80, y: 72, label: "RV", name: "Daan" },
  { x: 30, y: 50, label: "CM", name: "Jesse" },
  { x: 50, y: 45, label: "CM", name: "Tim" },
  { x: 70, y: 50, label: "CM", name: "Noah" },
  { x: 25, y: 25, label: "LA", name: "Luuk" },
  { x: 50, y: 20, label: "SA", name: "Jayden" },
  { x: 75, y: 25, label: "RA", name: "Max" },
];

// --- Step 1: Availability ---
// Mirrors: AvailabilitySummary (dots + counts) + PlayerAvailabilityRow (Avatar + name + Badge)

function AvailabilityStep() {
  return (
    <div className="flex h-full flex-col px-3 pt-8">
      {/* Match header */}
      <div className="mb-2 rounded-lg border border-neutral-100 bg-white px-3 py-2 shadow-sm">
        <p className="text-[10px] font-semibold text-neutral-900">
          vs FC Hoorn
        </p>
        <p className="text-[8px] text-muted-foreground">Za 8 mrt · 14:30</p>
      </div>

      {/* Availability summary — mirrors AvailabilitySummary atom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mb-2 flex items-center gap-2.5 px-0.5 text-[9px] text-neutral-500"
      >
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-success" />4
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-danger" />1
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-warning" />1
        </span>
      </motion.div>

      {/* Player rows — mirrors PlayerAvailabilityRow */}
      <div className="space-y-0.5">
        {DEMO_PLAYERS.map((player, i) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3, ...spring.smooth }}
            className="flex items-center gap-2 py-1"
          >
            {/* Avatar — mirrors Avatar atom with initials */}
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[7px] font-medium text-neutral-600">
              {player.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            {/* Name */}
            <span className="flex-1 truncate text-[10px] text-neutral-900">
              {player.name}
            </span>
            {/* Badge — mirrors Badge atom */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.3 + 0.2, ...spring.snappy }}
              className={`rounded-full px-1.5 py-0.5 text-[7px] font-medium ${STATUS_BADGE[player.status].bg} ${STATUS_BADGE[player.status].text}`}
            >
              {STATUS_BADGE[player.status].label}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- Step 2: Lineup ---
// Mirrors: LineupView with bg-green-600, border-white/40 markings,
// size-10 bg-primary dots with border-white, name below

function LineupStep() {
  return (
    <div className="flex h-full flex-col pt-7">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between px-3">
        <p className="text-[10px] text-muted-foreground">Formatie: 4-3-3</p>
      </div>

      {/* Pitch — mirrors LineupView: aspect-[68/105] bg-green-600 */}
      <div className="relative mx-2 flex-1 overflow-hidden rounded-lg bg-green-600">
        {/* Field markings — exact match with LineupView */}
        <div className="absolute inset-1.5 rounded border border-white/40" />
        <div className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />
        <div className="absolute inset-x-[20%] top-1.5 h-[18%] border border-t-0 border-white/40" />
        <div className="absolute inset-x-[20%] bottom-1.5 h-[18%] border border-b-0 border-white/40" />

        {/* Player dots — mirrors PitchPlayer: bg-primary rounded-full border-white */}
        {FORMATION_POSITIONS.map((pos, i) => (
          <motion.div
            key={pos.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12, ...spring.bouncy }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="flex size-5 items-center justify-center rounded-full border border-white bg-primary text-[6px] font-bold text-primary-foreground shadow-md">
                {pos.label}
              </div>
              <span className="mt-0.5 text-[5px] font-medium text-white drop-shadow-md">
                {pos.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- Step 3: Ready ---
// Same pitch as LineupStep but static, with share button

function ReadyStep() {
  return (
    <div className="flex h-full flex-col pt-7">
      <div className="mb-1 flex items-center justify-between px-3">
        <p className="text-[10px] text-muted-foreground">Formatie: 4-3-3</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-0.5 text-[9px] text-muted-foreground"
        >
          <svg
            className="size-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v13"
            />
          </svg>
          Delen
        </motion.div>
      </div>

      <div className="relative mx-2 flex-1 overflow-hidden rounded-lg bg-green-600">
        <div className="absolute inset-1.5 rounded border border-white/40" />
        <div className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />
        <div className="absolute inset-x-[20%] top-1.5 h-[18%] border border-t-0 border-white/40" />
        <div className="absolute inset-x-[20%] bottom-1.5 h-[18%] border border-b-0 border-white/40" />

        {FORMATION_POSITIONS.map((pos) => (
          <div
            key={pos.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="flex size-5 items-center justify-center rounded-full border border-white bg-primary text-[6px] font-bold text-primary-foreground shadow-md">
                {pos.label}
              </div>
              <span className="mt-0.5 text-[5px] font-medium text-white drop-shadow-md">
                {pos.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pulsing share prompt */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ...spring.smooth }}
        className="px-3 py-2 text-center"
      >
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[9px] font-medium text-primary"
        >
          Klaar om te delen met je team!
        </motion.p>
      </motion.div>
    </div>
  );
}
