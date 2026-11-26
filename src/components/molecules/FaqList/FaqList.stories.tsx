import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FaqList } from "./FaqList";

const meta: Meta<typeof FaqList> = {
  title: "Molecules/FaqList",
  component: FaqList,
  tags: ["autodocs"],
  args: {
    items: [
      { question: "Hoeveel spelers heb je nodig voor een rondo 4 tegen 2?", answer: "Zes spelers per vak. Met meer spelers zet je een tweede vak naast het eerste." },
      { question: "Is een rondo geschikt voor JO10?", answer: "Ja, maak het vak dan wat groter zodat de spelers meer tijd hebben om de bal aan te nemen." },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FaqList>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/hoeveel spelers/i)).toBeInTheDocument();
  },
};

export const CustomTitle: Story = {
  args: { title: "Vragen over deze oefening" },
};

/** No questions: renders nothing. */
export const Empty: Story = {
  args: { items: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("section")).toBeNull();
  },
};
