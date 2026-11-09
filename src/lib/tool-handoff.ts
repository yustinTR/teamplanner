import type { TeamType } from "@/types";

/**
 * Carries what a visitor typed into a free tool (names, format, team name)
 * across sign-up, so their first team starts filled in. Kept in
 * localStorage for a week; nothing leaves the browser until the team is
 * created.
 */
export interface ToolHandoff {
  tool: "wisselschema" | "opstelling";
  names: string[];
  formatKey: string;
  teamName: string;
  savedAt: number;
}

const KEY = "mtp_tool_handoff";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_PLAYERS = 40;

/** Tool formats (MATCH_FORMATS keys) to the team type a new team gets. */
const TEAM_TYPE_BY_FORMAT: Record<string, TeamType> = {
  senioren: "senioren",
  jo19_jo17: "jo19_jo17",
  jo15_jo14: "jo15_jo13",
  jo13: "jo15_jo13",
  jo12_jo11: "jo12_jo11",
  jo10: "jo10",
  jo9_jo8: "jo9_jo8",
  "7x7": "senioren",
};

export function teamTypeForFormat(formatKey: string): TeamType {
  return TEAM_TYPE_BY_FORMAT[formatKey] ?? "senioren";
}

export function saveToolHandoff(data: Omit<ToolHandoff, "savedAt">, now = Date.now()): void {
  try {
    const names = [...new Set(data.names.map((n) => n.trim()).filter(Boolean))].slice(0, MAX_PLAYERS);
    localStorage.setItem(KEY, JSON.stringify({ ...data, names, teamName: data.teamName.trim(), savedAt: now }));
  } catch {
    // Storage blocked (private mode): sign-up still works, just without prefill.
  }
}

/** Raw stored value; a stable string, so it can back useSyncExternalStore. */
export function readToolHandoffRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseToolHandoff(raw: string | null, now = Date.now()): ToolHandoff | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ToolHandoff;
    if (!Array.isArray(data.names) || now - data.savedAt > MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function loadToolHandoff(now = Date.now()): ToolHandoff | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ToolHandoff;
    if (!Array.isArray(data.names) || now - data.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearToolHandoff(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
