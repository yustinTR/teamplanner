import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Naam invoeren...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Jan de Vries",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "E-mailadres...",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Wachtwoord...",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Speler zoeken...",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Rugnummer...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Uitgeschakeld",
    disabled: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <Input placeholder="Tekst..." />
      <Input type="email" placeholder="E-mailadres..." />
      <Input type="password" placeholder="Wachtwoord..." />
      <Input type="number" placeholder="Rugnummer..." />
      <Input type="search" placeholder="Zoeken..." />
      <Input disabled placeholder="Uitgeschakeld" />
    </div>
  ),
};
