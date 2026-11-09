"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseToolHandoff, readToolHandoffRaw, type ToolHandoff } from "@/lib/tool-handoff";

const subscribe = () => () => {};
const serverSnapshot = () => null;

/** The players a visitor typed into a free tool before signing up, or null. */
export function useToolHandoff(): ToolHandoff | null {
  const raw = useSyncExternalStore(subscribe, readToolHandoffRaw, serverSnapshot);
  return useMemo(() => parseToolHandoff(raw), [raw]);
}
