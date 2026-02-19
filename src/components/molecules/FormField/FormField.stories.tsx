import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormField } from "./FormField";
import { Input } from "@/components/atoms/Input";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
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
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: "Naam",
    htmlFor: "name",
    children: <Input id="name" placeholder="Je naam" />,
  },
};

export const WithError: Story = {
  args: {
    label: "E-mailadres",
    htmlFor: "email",
    error: "Voer een geldig e-mailadres in.",
    children: <Input id="email" type="email" placeholder="je@email.nl" />,
  },
};
