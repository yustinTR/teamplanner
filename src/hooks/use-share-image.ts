"use client";

import { useCallback, useState } from "react";
import html2canvas from "html2canvas-pro";
import { trackEvent } from "@/lib/gtm";

interface UseShareImageReturn {
  /** `event` is the GTM event name; defaults to share_lineup. */
  share: (element: HTMLElement, filename: string, event?: string) => Promise<void>;
  isGenerating: boolean;
}

export function useShareImage(): UseShareImageReturn {
  const [isGenerating, setIsGenerating] = useState(false);

  const share = useCallback(async (element: HTMLElement, filename: string, event = "share_lineup") => {
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
          "image/png"
        );
      });

      const file = new File([blob], `${filename}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        trackEvent(event, { method: "native" });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.png`;
        a.click();
        URL.revokeObjectURL(url);
        trackEvent(event, { method: "download" });
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { share, isGenerating };
}
