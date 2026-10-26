"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { getFollowUrl } from "@/lib/utils";

interface FollowLinkSettingsProps {
  /** Null when the link is switched off. */
  shareToken: string | null;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

/** Coach setting: the read-only "volglink" for parents and carers. */
export function FollowLinkSettings({ shareToken, onToggle, disabled }: FollowLinkSettingsProps) {
  const [copied, setCopied] = useState(false);
  const url = shareToken ? getFollowUrl(shareToken) : null;

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    if (!url) return;
    const text = `Programma en opstellingen van ons team: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <Label htmlFor="follow-link">Volglink voor ouders</Label>
          <p className="text-xs text-muted-foreground">
            Iedereen met de link ziet het programma en de opstellingen, zonder account.
            Uitzetten maakt de link ongeldig.
          </p>
        </div>
        <Switch
          id="follow-link"
          checked={!!shareToken}
          onCheckedChange={onToggle}
          disabled={disabled}
        />
      </div>

      {url && (
        <>
          <div className="flex gap-2">
            <Input value={url} readOnly className="text-sm" />
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Kopieer link">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              <Copy className="mr-2 size-4" />
              {copied ? "Gekopieerd!" : "Kopieer link"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleShareWhatsApp}>
              <Share2 className="mr-2 size-4" />
              Deel via WhatsApp
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
