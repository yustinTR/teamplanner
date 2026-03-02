import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  args: { variant: "text", className: "w-48" },
};

export const Circular: Story = {
  args: { variant: "circular", className: "size-12" },
};

export const Rectangular: Story = {
  args: { variant: "rectangular", className: "h-24 w-full" },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-64 space-y-3 rounded-xl border border-neutral-200 p-4">
      <Skeleton variant="rectangular" className="h-32 w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2">
        <Skeleton variant="circular" className="size-6" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  ),
};

export const MatchCardSkeleton: Story = {
  render: () => (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-3 w-16" />
        </div>
        <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-3 w-20" />
      </div>
    </div>
  ),
};
