"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/lib/animations";

type DemoStep = "availability" | "lineup" | "ready";

const STEP_DURATIONS: Record<DemoStep, number> = {
  availability: 2000,
  lineup: 2000,
  ready: 1500,
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

const FORMATION_POSITIONS = [
  { x: 50, y: 90, name: "Sem" },
  { x: 20, y: 72, name: "Finn" },
  { x: 40, y: 75, name: "Milan" },
  { x: 60, y: 75, name: "Luca" },
  { x: 80, y: 72, name: "Daan" },
  { x: 30, y: 50, name: "Jesse" },
  { x: 50, y: 45, name: "Tim" },
  { x: 70, y: 50, name: "Noah" },
  { x: 25, y: 25, name: "Luuk" },
  { x: 50, y: 20, name: "Jayden" },
  { x: 75, y: 25, name: "Max" },
];

// --- Step 1: Availability ---

function AvailabilityStep() {
  return (
    <div className="flex h-full flex-col px-3 pt-8">
      <div className="mb-3 rounded-lg bg-primary-50 px-3 py-2">
        <p className="text-[10px] font-semibold text-primary-800">
          Zat 8 mrt — vs FC Hoorn
        </p>
      </div>

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

// --- Step 2: Lineup ---

function LineupStep() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-emerald-600 to-emerald-700 pt-7">
      <div className="mb-2 px-3">
        <p className="text-[10px] font-semibold text-white/90">
          Opstelling 4-3-3
        </p>
      </div>

      <div className="relative mx-2 flex-1">
        <div className="absolute left-1/2 top-[45%] size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="absolute left-2 right-2 top-[45%] h-px bg-white/20" />
        <div className="absolute bottom-2 left-1/2 h-10 w-24 -translate-x-1/2 border border-b-0 border-white/20" />
        <div className="absolute left-1/2 top-2 h-10 w-24 -translate-x-1/2 border border-t-0 border-white/20" />

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

// --- Step 3: Ready ---

function ReadyStep() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-emerald-600 to-emerald-700 pt-7">
      <div className="mb-2 px-3">
        <p className="text-[10px] font-semibold text-white/90">
          Opstelling 4-3-3
        </p>
      </div>

      <div className="relative mx-2 flex-1">
        <div className="absolute left-1/2 top-[45%] size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="absolute left-2 right-2 top-[45%] h-px bg-white/20" />
        <div className="absolute bottom-2 left-1/2 h-10 w-24 -translate-x-1/2 border border-b-0 border-white/20" />
        <div className="absolute left-1/2 top-2 h-10 w-24 -translate-x-1/2 border border-t-0 border-white/20" />

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
