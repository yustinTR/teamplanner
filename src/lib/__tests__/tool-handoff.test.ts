import { beforeEach, describe, expect, it } from "vitest";
import { clearToolHandoff, loadToolHandoff, saveToolHandoff, teamTypeForFormat } from "@/lib/tool-handoff";

// Node test environment: a minimal in-memory localStorage.
const store = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  },
  writable: true,
});

describe("tool handoff", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips names, format and team name, trimmed and deduplicated", () => {
    saveToolHandoff({ tool: "wisselschema", names: [" Sem ", "Daan", "Sem", ""], formatKey: "jo10", teamName: " JO10-2 " }, 1000);
    expect(loadToolHandoff(2000)).toEqual({
      tool: "wisselschema",
      names: ["Sem", "Daan"],
      formatKey: "jo10",
      teamName: "JO10-2",
      savedAt: 1000,
    });
  });

  it("expires after a week", () => {
    saveToolHandoff({ tool: "opstelling", names: ["Sem"], formatKey: "senioren", teamName: "" }, 0);
    expect(loadToolHandoff(8 * 24 * 60 * 60 * 1000)).toBeNull();
  });

  it("clears", () => {
    saveToolHandoff({ tool: "opstelling", names: ["Sem"], formatKey: "senioren", teamName: "" });
    clearToolHandoff();
    expect(loadToolHandoff()).toBeNull();
  });

  it("maps tool formats to team types", () => {
    expect(teamTypeForFormat("jo12_jo11")).toBe("jo12_jo11");
    expect(teamTypeForFormat("jo13")).toBe("jo15_jo13");
    expect(teamTypeForFormat("7x7")).toBe("senioren");
    expect(teamTypeForFormat("unknown")).toBe("senioren");
  });
});
