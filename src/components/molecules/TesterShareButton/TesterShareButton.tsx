"use client";

import { Share2 } from "lucide-react";
import { trackEvent } from "@/lib/gtm";
import { TESTER_SHARE_TEXT, whatsAppShareUrl } from "@/lib/android-testing";
import { cn } from "@/lib/utils";

interface TesterShareButtonProps {
  /** Where the button sits, sent along with the GTM event. */
  placement: string;
  label?: string;
  className?: string;
}

/**
 * Lets a coach forward the tester request to their team. Uses the system
 * share sheet where it exists and falls back to a WhatsApp link.
 */
export function TesterShareButton({
  placement,
  label = "Deel met je team",
  className,
}: TesterShareButtonProps) {
  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent("android_tester_share", { placement });
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      event.preventDefault();
      try {
        await navigator.share({ text: TESTER_SHARE_TEXT });
      } catch {
        // The user closed the share sheet; nothing to do.
      }
    }
  }

  return (
    <a
      href={whatsAppShareUrl(TESTER_SHARE_TEXT)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-primary-700 bg-white px-4 text-sm font-semibold text-primary-700 hover:bg-primary-50",
        className
      )}
    >
      <Share2 className="size-4" />
      {label}
    </a>
  );
}
