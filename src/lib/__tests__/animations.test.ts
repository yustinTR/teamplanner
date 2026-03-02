import { describe, it, expect } from "vitest";
import { spring, fadeIn, slideUp, scaleIn, staggerContainer, staggerItem } from "../animations";

describe("animations", () => {
  it("exports spring presets with correct stiffness", () => {
    expect(spring.snappy).toHaveProperty("stiffness", 300);
    expect(spring.smooth).toHaveProperty("stiffness", 200);
    expect(spring.bouncy).toHaveProperty("stiffness", 400);
  });

  it("exports fadeIn variants with hidden and visible states", () => {
    expect(fadeIn.hidden).toHaveProperty("opacity", 0);
    expect(fadeIn.visible).toHaveProperty("opacity", 1);
  });

  it("exports slideUp variants with y offset", () => {
    expect(slideUp.hidden).toHaveProperty("y", 12);
    expect(slideUp.visible).toHaveProperty("y", 0);
  });

  it("exports scaleIn variants", () => {
    expect(scaleIn.hidden).toHaveProperty("scale", 0.95);
    expect(scaleIn.visible).toHaveProperty("scale", 1);
  });

  it("staggerContainer creates variants with correct delay", () => {
    const container = staggerContainer(0.05);
    const visible = container.visible as { transition: { staggerChildren: number } };
    expect(visible.transition.staggerChildren).toBe(0.05);
  });

  it("staggerItem has hidden and visible states", () => {
    expect(staggerItem.hidden).toHaveProperty("opacity", 0);
    expect(staggerItem.visible).toHaveProperty("opacity", 1);
  });
});
