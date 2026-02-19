import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders label text", () => {
    render(<Badge label="Beschikbaar" variant="available" />);
    expect(screen.getByText("Beschikbaar")).toBeInTheDocument();
  });

  it("applies available variant styling", () => {
    render(<Badge label="Beschikbaar" variant="available" />);
    const badge = screen.getByText("Beschikbaar");
    expect(badge.className).toContain("text-success");
  });

  it("applies unavailable variant styling", () => {
    render(<Badge label="Afwezig" variant="unavailable" />);
    const badge = screen.getByText("Afwezig");
    expect(badge.className).toContain("text-danger");
  });

  it("applies maybe variant styling", () => {
    render(<Badge label="Misschien" variant="maybe" />);
    const badge = screen.getByText("Misschien");
    expect(badge.className).toContain("text-warning");
  });

  it("uses default variant when none specified", () => {
    render(<Badge label="Positie" />);
    const badge = screen.getByText("Positie");
    expect(badge.className).toContain("text-neutral-600");
  });
});
