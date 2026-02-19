import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchScore } from "./MatchScore";

const meta: Meta<typeof MatchScore> = {
  title: "Molecules/MatchScore",
  component: MatchScore,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MatchScore>;

export const WithScore: Story = {
  args: { scoreHome: 3, scoreAway: 1 },
};

export const Draw: Story = {
  args: { scoreHome: 2, scoreAway: 2 },
};

export const NoScore: Story = {
  args: { scoreHome: null, scoreAway: null },
};
