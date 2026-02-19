import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AvailabilitySummary } from "./AvailabilitySummary";

const meta: Meta<typeof AvailabilitySummary> = {
  title: "Molecules/AvailabilitySummary",
  component: AvailabilitySummary,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AvailabilitySummary>;

export const Default: Story = {
  args: {
    available: 8,
    unavailable: 3,
    maybe: 2,
  },
};

export const AllAvailable: Story = {
  args: {
    available: 14,
    unavailable: 0,
    maybe: 0,
  },
};

export const NoneResponded: Story = {
  args: {
    available: 0,
    unavailable: 0,
    maybe: 0,
  },
};
