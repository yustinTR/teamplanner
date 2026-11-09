import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FollowLinkPrompt } from "./FollowLinkPrompt";

const meta: Meta<typeof FollowLinkPrompt> = {
  title: "Molecules/FollowLinkPrompt",
  component: FollowLinkPrompt,
  tags: ["autodocs"],
  args: { onEnable: fn(async () => {}), onDismiss: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FollowLinkPrompt>;

export const Off: Story = {
  args: { shareToken: null },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /volglink aanzetten/i }));
    await expect(args.onEnable).toHaveBeenCalled();
  },
};

export const Pending: Story = {
  args: { shareToken: null, pending: true },
};

export const On: Story = {
  args: { shareToken: "3f9a1c2b7d8e4f60a1b2c3d4e5f60718" },
};
