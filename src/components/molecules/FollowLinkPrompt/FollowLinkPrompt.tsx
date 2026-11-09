"use client";

import { useState } from "react";
import { Check, Copy, Eye, Share2, X } from "lucide-react";
import { getFollowUrl } from "@/lib/utils";

interface FollowLinkPromptProps {
  /** Set once the link is on; the prompt then offers to share it. */
  shareToken: string | null;
  onEnable: () => Promise<void>;
  onDismiss: () => void;
  pending?: boolean;
}

/**
 * Shown to a coach right after sharing a lineup: parents could see this
 * themselves through the follow link. One tap switches it on, then the
 * link can be shared straight away.
 */
export function FollowLinkPrompt({ shareToken, onEnable, onDismiss, pending }: FollowLinkPromptProps) {
  const [copied, setCopied] = useState(false);
  const url = shareToken ? getFollowUrl(shareToken) : null;

  async function shareLink() {
    if (!url) return;
    const text = `Programma en opstellingen van ons team: ${url}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text });
      } catch {
        // Share sheet closed.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
      <Eye className="mt-0.5 size-5 shrink-0 text-primary-600" />
      <div className="min-w-0 flex-1">
        {url ? (
          <>
            <p className="text-sm font-medium text-primary-900">Volglink staat aan</p>
            <p className="mt-0.5 break-all text-sm text-primary-700">{url}</p>
            <button
              type="button"
              onClick={shareLink}
              className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-800"
            >
              {copied ? <Check className="size-4" /> : typeof navigator !== "undefined" && "share" in navigator ? <Share2 className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Gekopieerd" : "Deel met ouders"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-primary-900">Laat ouders dit zelf zien</p>
            <p className="mt-0.5 text-sm text-primary-700">
              Met de volglink zien ouders het programma en de opstelling, zonder account en zonder
              dat je alles apart hoeft te sturen.
            </p>
            <button
              type="button"
              onClick={onEnable}
              disabled={pending}
              className="mt-2 inline-flex min-h-[44px] items-center rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
            >
              {pending ? "Aanzetten…" : "Volglink aanzetten"}
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-md text-primary-400 hover:bg-primary-100 hover:text-primary-600"
        aria-label="Sluiten"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
