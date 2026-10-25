import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AndroidAppHint } from "./AndroidAppHint";

const meta: Meta<typeof AndroidAppHint> = {
  title: "Molecules/AndroidAppHint",
  component: AndroidAppHint,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      localStorage.clear();
      return (
        <div className="max-w-md p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof AndroidAppHint>;

/** Platform detection bypassed so the hint renders in every browser. */
export const Default: Story = {
  args: { forceVisible: true },
};

/** Renders nothing on iOS or after dismissal; here detection is left on. */
export const PlatformDetected: Story = {
  args: { forceVisible: false },
};
