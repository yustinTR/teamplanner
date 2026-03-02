import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedList, AnimatedListItem } from "./AnimatedList";

const meta: Meta<typeof AnimatedList> = {
  title: "Atoms/AnimatedList",
  component: AnimatedList,
};

export default meta;
type Story = StoryObj<typeof AnimatedList>;

export const Default: Story = {
  render: () => (
    <AnimatedList className="space-y-2">
      {Array.from({ length: 6 }, (_, i) => (
        <AnimatedListItem key={i}>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            Item {i + 1}
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
};

export const SlowStagger: Story = {
  render: () => (
    <AnimatedList staggerDelay={0.1} className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <AnimatedListItem key={i}>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            Slow item {i + 1}
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
};
