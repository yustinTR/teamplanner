import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SubstitutionScheduleTool } from "./SubstitutionScheduleTool";

const meta: Meta<typeof SubstitutionScheduleTool> = {
  title: "Organisms/SubstitutionScheduleTool",
  component: SubstitutionScheduleTool,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubstitutionScheduleTool>;

export const Empty: Story = {};

export const JO11EightVersusEight: Story = {
  args: {
    initialFormat: "jo12_jo11",
    initialNames: "Sem\nDaan\nLuuk\nFinn\nNoah\nMilan\nLucas\nBram\nJesse\nThijs",
  },
};

export const SixVersusSixWithoutBench: Story = {
  args: {
    initialFormat: "jo10",
    initialNames: "Sem\nDaan\nLuuk\nFinn\nNoah\nMilan",
  },
};

export const TooFewPlayers: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/spelers, één per regel/i), "Sem{enter}Daan");
    await expect(canvas.getByText(/nog 6 nodig voor 8 tegen 8/i)).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /maak wisselschema/i })).toBeDisabled();
  },
};

export const GeneratesSchedule: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText(/spelers, één per regel/i),
      "Sem{enter}Daan{enter}Luuk{enter}Finn{enter}Noah{enter}Milan{enter}Lucas{enter}Bram{enter}Jesse"
    );
    await userEvent.click(canvas.getByRole("button", { name: /maak wisselschema/i }));
    await expect(canvas.getByRole("heading", { name: /jouw wisselschema/i })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /deel als afbeelding/i })).toBeEnabled();
  },
};
