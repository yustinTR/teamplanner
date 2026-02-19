import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Users, Calendar, ClipboardList } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/atoms/Button";

const meta: Meta<typeof EmptyState> = {
  title: "Atoms/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "Geen resultaten",
    description: "Er zijn nog geen items om weer te geven.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: Users,
    title: "Geen spelers",
    description: "Voeg spelers toe aan je team om te beginnen.",
  },
};

export const WithAction: Story = {
  args: {
    icon: Calendar,
    title: "Geen wedstrijden",
    description: "Plan je eerste wedstrijd om te beginnen.",
    action: <Button>Wedstrijd toevoegen</Button>,
  },
};

export const MinimalNoDescription: Story = {
  args: {
    icon: ClipboardList,
    title: "Geen opstellingen",
  },
};
