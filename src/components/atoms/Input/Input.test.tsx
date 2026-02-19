import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Naam invoeren" />);
    expect(screen.getByPlaceholderText("Naam invoeren")).toBeInTheDocument();
  });

  it("has minimum touch target height", () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByPlaceholderText("Test");
    expect(input.className).toContain("min-h-[44px]");
  });

  it("can be disabled", () => {
    render(<Input placeholder="Uitgeschakeld" disabled />);
    expect(screen.getByPlaceholderText("Uitgeschakeld")).toBeDisabled();
  });
});
