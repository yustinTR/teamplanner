import { describe, it, expect } from "vitest";
import { buildFcmMessage, fcmConfigured } from "../fcm";

describe("fcm", () => {
  it("builds a data-only high-priority message with the shared payload", () => {
    const message = buildFcmMessage("token-1", {
      title: "Opstelling bekend",
      body: "Be Fair G2 – SEV G3",
      url: "/matches/m1",
      tag: "lineup-m1",
    });
    expect(message.message.token).toBe("token-1");
    expect(message.message.data).toEqual({
      title: "Opstelling bekend",
      body: "Be Fair G2 – SEV G3",
      url: "/matches/m1",
      tag: "lineup-m1",
    });
    expect(message.message.android.priority).toBe("high");
    expect("notification" in message.message).toBe(false);
  });

  it("is not configured without a service account", () => {
    expect(fcmConfigured()).toBe(false);
  });
});
