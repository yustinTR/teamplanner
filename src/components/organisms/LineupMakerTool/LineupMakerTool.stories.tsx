import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { LineupMakerTool } from "./LineupMakerTool";

const meta: Meta<typeof LineupMakerTool> = {
  title: "Organisms/LineupMakerTool",
  component: LineupMakerTool,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LineupMakerTool>;

export const Empty: Story = {};

export const SeniorsWithBench: Story = {
  args: {
    initialFormat: "senioren",
    initialNames: "Jan\nPieter\nKlaas\nWillem\nHenk\nTom\nBas\nSander\nMarco\nAhmed\nDennis\nRik\nJoost",
  },
};

export const SixVersusSix: Story = {
  args: {
    initialFormat: "jo10",
    initialNames: "Sem\nDaan\nLuuk\nFinn\nNoah\nMilan\nLucas",
  },
};

export const SwapPlayers: Story = {
  args: SixVersusSix.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const keeper = canvas.getByLabelText(/speler op positie K \(1\)/i);
    await userEvent.selectOptions(keeper, "Lucas");
    await expect(keeper).toHaveValue("Lucas");
    await expect(canvas.getByText(/1 op de bank/i)).toBeInTheDocument();
  },
};
