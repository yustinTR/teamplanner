import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AvailabilityReminder } from "./AvailabilityReminder";

const meta: Meta<typeof AvailabilityReminder> = {
  title: "Molecules/AvailabilityReminder",
  component: AvailabilityReminder,
  tags: ["autodocs"],
  args: {
    names: ["Tom", "Sem", "Daan"],
    opponent: "VV Oost",
    matchDate: "2026-11-14T09:00:00Z",
    homeAway: "away",
    matchPath: "/matches/m1",
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AvailabilityReminder>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: /herinner wie nog niet reageerde \(3\)/i }),
    ).toBeInTheDocument();
  },
};

export const OnePlayer: Story = {
  args: { names: ["Tom"] },
};

/** Everyone answered: nothing to remind. */
export const EveryoneAnswered: Story = {
  args: { names: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button")).not.toBeInTheDocument();
  },
};
