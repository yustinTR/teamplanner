import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Klik hier</Button>);
    expect(screen.getByRole("button", { name: "Klik hier" })).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Verwijderen</Button>);
    const button = screen.getByRole("button", { name: "Verwijderen" });
    expect(button).toHaveAttribute("data-variant", "destructive");
  });

  it("has minimum touch target size", () => {
    render(<Button>Tap</Button>);
    const button = screen.getByRole("button", { name: "Tap" });
    expect(button.className).toContain("min-h-[44px]");
  });

  it("can be disabled", () => {
    render(<Button disabled>Uitgeschakeld</Button>);
    expect(screen.getByRole("button", { name: "Uitgeschakeld" })).toBeDisabled();
  });
});
