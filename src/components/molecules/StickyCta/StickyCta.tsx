"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { spring } from "@/lib/animations";

interface StickyCtaProps {
  targetId: string;
}

export function StickyCta({ targetId }: StickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
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
