import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

const meta = {
  title: "Atoms/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardContent>
        <p>Eenvoudige kaart met inhoud.</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Wedstrijd</CardTitle>
        <CardDescription>Zaterdag 22 feb 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <p>TeamPlanner vs. FC Tegenstander</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Wedstrijd aanmaken</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Vul de wedstrijdgegevens in.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Annuleren</Button>
        <Button>Opslaan</Button>
      </CardFooter>
    </Card>
  ),
};

export const MatchCardExample: Story = {
  name: "Voorbeeld: Wedstrijdkaart",
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>TeamPlanner vs. FC Voorbeeld</CardTitle>
        <CardDescription>Za 22 feb · 14:30 · Sportpark Noord</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge label="Beschikbaar" variant="available" />
          <span className="text-sm text-muted-foreground">8 van 14 spelers</span>
        </div>
      </CardContent>
    </Card>
  ),
};
