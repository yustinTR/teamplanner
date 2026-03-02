import type { Meta, StoryObj } from "@storybook/react";
import { NumberCounter } from "./NumberCounter";

const meta: Meta<typeof NumberCounter> = {
  title: "Atoms/NumberCounter",
  component: NumberCounter,
};

export default meta;
type Story = StoryObj<typeof NumberCounter>;

export const Default: Story = {
  args: { value: 88, className: "text-3xl font-bold" },
};

export const SmallNumber: Story = {
  args: { value: 7, className: "text-lg font-semibold" },
};

export const LargeNumber: Story = {
  args: { value: 256, className: "text-4xl font-bold text-primary-600" },
};

export const RatingCounter: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <NumberCounter value={88} className="text-3xl font-bold" />
        <div className="text-xs text-muted-foreground">OVR</div>
      </div>
      <div className="text-center">
        <NumberCounter value={92} className="text-xl font-bold" />
        <div className="text-xs text-muted-foreground">SNE</div>
      </div>
      <div className="text-center">
        <NumberCounter value={78} className="text-xl font-bold" />
        <div className="text-xs text-muted-foreground">PAS</div>
      </div>
    </div>
  ),
};
