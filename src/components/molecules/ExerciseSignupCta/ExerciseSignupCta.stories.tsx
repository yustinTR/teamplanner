import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExerciseSignupCta } from "./ExerciseSignupCta";

const meta: Meta<typeof ExerciseSignupCta> = {
  title: "Molecules/ExerciseSignupCta",
  component: ExerciseSignupCta,
  tags: ["autodocs"],
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExerciseSignupCta>;

export const Default: Story = {
  args: {
    exerciseId: "a2a70e89-0c79-4313-934d-5488ba973b56",
    exerciseSlug: "rondo-4-tegen-2",
  },
};
