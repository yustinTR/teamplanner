"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";

interface BlogCtaProps {
  slug: string;
  placement: "inline" | "end";
  heading: string;
  text: string;
  buttonLabel: string;
  /** Where the main button goes; defaults to sign-up. */
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Example of what the reader will make, e.g. a share card. */
  preview?: ReactNode;
  className?: string;
}

/**
 * Sign-up prompt inside a blog article. Pushes `blog_cta_click` with the
 * article slug and placement so GTM can tell which articles convert.
 */
export function BlogCta({
  slug,
  placement,
  heading,
  text,
  buttonLabel,
  href = "/register",
  secondaryHref,
  secondaryLabel,
  preview,
  className,
}: BlogCtaProps) {
  const track = (target: string) =>
    trackEvent("blog_cta_click", { slug, placement, target });

  return (
    <aside
      className={cn(
        "overflow-hidden rounded-2xl bg-primary-50 p-6 sm:p-8",
        className
      )}
    >
      <h3 className="text-lg font-bold text-neutral-900">{heading}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">{text}</p>

      {preview && (
        <div className="mt-5 flex justify-center" aria-hidden="true">
          {/* Share cards are fixed at 540px wide; zoom keeps them inside a 375px screen. */}
          <div className="pointer-events-none select-none [zoom:0.58] sm:[zoom:0.8]">
            {preview}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={href}
          onClick={() => track(href === "/register" ? "register" : href)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          {buttonLabel}
          <ArrowRight className="size-4" />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            onClick={() => track("feature")}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Gratis · Geen creditcard nodig · Werkt op elke telefoon
      </p>
    </aside>
  );
}
