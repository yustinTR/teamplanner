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

        {quotes.length > 0 && (
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex justify-center gap-4"
          >
            {quotes.map((item) => (
              <motion.div
                key={item.name}
                variants={staggerItem}
                className="max-w-md rounded-xl border border-neutral-200 bg-white p-5"
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
        )}
      </div>
    </section>
  );
}
