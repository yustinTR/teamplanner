import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ToolHandoffNotice } from "./ToolHandoffNotice";

const meta: Meta<typeof ToolHandoffNotice> = {
  title: "Molecules/ToolHandoffNotice",
  component: ToolHandoffNotice,
  tags: ["autodocs"],
  args: { onCheckedChange: fn(), checked: true },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToolHandoffNotice>;

export const FromScheduleTool: Story = {
  args: {
    tool: "wisselschema",
    names: ["Sem", "Daan", "Luuk", "Finn", "Noah", "Milan", "Lucas", "Bram", "Jesse", "Thijs"],
  },
};

export const FewPlayers: Story = {
  args: { tool: "opstelling", names: ["Sem", "Daan", "Luuk"] },
};

export const Unchecking: Story = {
  args: { tool: "opstelling", names: ["Sem", "Daan"] },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("checkbox", { name: /voeg ze toe/i }));
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};
