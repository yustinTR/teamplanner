import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SeasonSelect } from "./SeasonSelect";

const meta: Meta<typeof SeasonSelect> = {
  title: "Molecules/SeasonSelect",
  component: SeasonSelect,
  tags: ["autodocs"],
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-xs p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SeasonSelect>;

export const SeveralSeasons: Story = {
  args: { seasons: [2026, 2025, 2024], value: 2026 },
};

export const OnlyCurrentSeason: Story = {
  args: { seasons: [2026], value: 2026 },
};

export const EarlierSeasonSelected: Story = {
  args: { seasons: [2026, 2025], value: 2025 },
};
