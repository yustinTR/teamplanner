import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isChecklistDismissed,
  dismissChecklist,
  hasVisitedInvite,
  markInviteVisited,
  isHintDismissed,
  dismissHint,
} from "../onboarding";

// Provide window and localStorage mocks for the Node test environment
const store: Record<string, string> = {};

if (typeof globalThis.window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = globalThis;
}

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }),
  },
  writable: true,
});

describe("onboarding localStorage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("checklist starts not dismissed", () => {
    expect(isChecklistDismissed()).toBe(false);
  });

  it("dismissChecklist persists", () => {
    dismissChecklist();
    expect(isChecklistDismissed()).toBe(true);
  });

  it("invite starts not visited", () => {
    expect(hasVisitedInvite()).toBe(false);
  });

  it("markInviteVisited persists", () => {
    markInviteVisited();
    expect(hasVisitedInvite()).toBe(true);
  });

  it("hint starts not dismissed", () => {
    expect(isHintDismissed("lineup_editor")).toBe(false);
  });

  it("dismissHint persists for specific key", () => {
    dismissHint("lineup_editor");
    expect(isHintDismissed("lineup_editor")).toBe(true);
    expect(isHintDismissed("availability_grid")).toBe(false);
  });
});
