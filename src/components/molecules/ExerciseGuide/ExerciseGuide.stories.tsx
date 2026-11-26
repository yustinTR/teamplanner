import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ExerciseGuide } from "./ExerciseGuide";

const meta: Meta<typeof ExerciseGuide> = {
  title: "Molecules/ExerciseGuide",
  component: ExerciseGuide,
  tags: ["autodocs"],
  args: {
    guide: {
      slug: "rondo-4-tegen-2",
      metaDescription: "",
      goal: "Een rondo traint snel passen en aannemen onder druk. Gebruik hem na de warming-up, als de spelers warm zijn maar nog fris.",
      coachingPoints: [
        "Kijk voordat de bal komt waar je hem heen speelt",
        "Speel op de voet die het verst van de verdediger staat",
        "Maak de hoek groot, sta niet achter een verdediger",
        "Verdedigers: zet samen druk, sluit de pass door het midden af",
      ],
      mistakes: [
        "Spelers staan stil: laat ze na elke pass een stap opzij zetten",
        "De bal wordt hoog gespeeld: eis passes over de grond",
        "Verdedigers jagen allebei op de bal: laat de tweede de passlijn dichtzetten",
      ],
      easier: "Maak het vak groter of laat maar één verdediger meedoen.",
      harder: "Speel met twee keer raken of maak het vak kleiner.",
      ageTip: "Bij JO10 een vak van 10 bij 10 meter, bij senioren 7 bij 7.",
      faq: [],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExerciseGuide>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: /coachingspunten/i })).toBeInTheDocument();
    await expect(canvas.getByText("Spelers staan stil")).toBeInTheDocument();
  },
};

/** A mistake without a colon is shown as one line. */
export const MistakeWithoutFix: Story = {
  args: {
    guide: {
      ...meta.args!.guide!,
      mistakes: ["Te lange uitleg vooraf"],
    },
  },
};
