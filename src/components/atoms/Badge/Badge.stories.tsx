import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "available", "unavailable", "maybe"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Aanvaller",
    variant: "default",
  },
};

export const Available: Story = {
  args: {
    label: "Beschikbaar",
    variant: "available",
  },
};

export const Unavailable: Story = {
  args: {
    label: "Afwezig",
    variant: "unavailable",
  },
};

export const Maybe: Story = {
  args: {
    label: "Misschien",
    variant: "maybe",
  },
};

export const AllVariants: Story = {
  args: {
    label: "Beschikbaar",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge label="Beschikbaar" variant="available" />
      <Badge label="Afwezig" variant="unavailable" />
      <Badge label="Misschien" variant="maybe" />
      <Badge label="Aanvaller" variant="default" />
    </div>
  ),
};
