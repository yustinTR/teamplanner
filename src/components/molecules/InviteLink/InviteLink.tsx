"use client";

import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { getInviteUrl } from "@/lib/utils";

interface InviteLinkProps {
  inviteCode: string;
}

export function InviteLink({ inviteCode }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const url = getInviteUrl(inviteCode);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    const text = `Word lid van ons team op TeamPlanner: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={url} readOnly className="text-sm" />
        <Button variant="outline" size="icon" onClick={handleCopy}>
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
    </div>
  );
}
