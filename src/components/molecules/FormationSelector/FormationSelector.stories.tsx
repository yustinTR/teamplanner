import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FormationSelector } from "./FormationSelector";

const meta: Meta<typeof FormationSelector> = {
  title: "Molecules/FormationSelector",
  component: FormationSelector,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormationSelector>;

export const Default: Story = {
  args: {
    value: "4-3-3",
    onChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("4-3-3");
    return <FormationSelector value={value} onChange={setValue} />;
  },
};
