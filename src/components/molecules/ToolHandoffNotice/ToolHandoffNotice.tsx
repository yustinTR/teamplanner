"use client";

import { Users } from "lucide-react";

interface ToolHandoffNoticeProps {
  tool: "wisselschema" | "opstelling";
  names: string[];
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TOOL_LABEL = { wisselschema: "de wisselschema-tool", opstelling: "de opstellingstool" };
const PREVIEW = 6;

/** Tells a new coach that the players they typed in a free tool will be added to the team. */
export function ToolHandoffNotice({ tool, names, checked, onCheckedChange }: ToolHandoffNoticeProps) {
  const preview = names.slice(0, PREVIEW).join(", ");
  const rest = names.length - PREVIEW;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
      <Users className="mt-0.5 size-5 shrink-0 text-primary-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary-900">
          {names.length} spelers uit {TOOL_LABEL[tool]} staan klaar
        </p>
        <p className="mt-0.5 text-sm text-primary-700">
          {preview}
          {rest > 0 ? ` en nog ${rest}` : ""}
        </p>
        <label className="mt-2 flex min-h-[44px] items-center gap-2 text-sm font-medium text-primary-900">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="size-5 accent-primary-600"
          />
          Voeg ze toe aan mijn team
        </label>
      </div>
    </div>
  );
}
