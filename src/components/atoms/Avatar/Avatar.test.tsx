import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials as fallback", () => {
    render(<Avatar fallback="Jan de Vries" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders single initial for single name", () => {
    render(<Avatar fallback="Jan" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("limits initials to 2 characters", () => {
    render(<Avatar fallback="Jan de Vries Junior" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
