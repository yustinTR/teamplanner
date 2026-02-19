import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <CardContent>Kaart inhoud</CardContent>
      </Card>
    );
    expect(screen.getByText("Kaart inhoud")).toBeInTheDocument();
  });

  it("renders with header and title", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Wedstrijd</CardTitle>
        </CardHeader>
        <CardContent>Details hier</CardContent>
      </Card>
    );
    expect(screen.getByText("Wedstrijd")).toBeInTheDocument();
    expect(screen.getByText("Details hier")).toBeInTheDocument();
  });
});
