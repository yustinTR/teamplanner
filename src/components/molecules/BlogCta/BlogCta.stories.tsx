import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BlogCta } from "./BlogCta";
import { ShareSubstitutionPlan } from "@/components/molecules/ShareSubstitutionPlan";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import {
  DEMO_FORMATION,
  DEMO_MATCH_DATE,
  DEMO_OPPONENT,
  DEMO_TEAM,
  demoBench,
  demoLineupPlayers,
  demoLineupSubstitutions,
  demoSubstitutionPlan,
} from "@/lib/blog-cta-demo";

const meta: Meta<typeof BlogCta> = {
  title: "Molecules/BlogCta",
  component: BlogCta,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BlogCta>;

export const WithSubstitutionPlan: Story = {
  args: {
    slug: "wisselschema-jeugdvoetbal",
    placement: "inline",
    heading: "Maak dit wisselschema in 2 minuten",
    text: "Sleep je spelers op het veld, kies de wisselmomenten en zie direct hoeveel minuten iedereen speelt. Delen in de groepsapp met één tik.",
    buttonLabel: "Maak je wisselschema",
    preview: (
      <ShareSubstitutionPlan
        teamName={DEMO_TEAM}
        opponent={DEMO_OPPONENT}
        matchDate={DEMO_MATCH_DATE}
        plan={demoSubstitutionPlan}
      />
    ),
  },
};

export const WithLineup: Story = {
  args: {
    slug: "opstelling-maken-voetbal",
    placement: "inline",
    heading: "Zo ziet je opstelling eruit in de groepsapp",
    text: "Kies een formatie, sleep je spelers op hun plek en deel de opstelling als afbeelding.",
    buttonLabel: "Maak je opstelling",
    preview: (
      <ShareLineupCard
        teamName={DEMO_TEAM}
        opponent={DEMO_OPPONENT}
        matchDate={DEMO_MATCH_DATE}
        formation={DEMO_FORMATION}
        players={demoLineupPlayers}
        benchNames={demoBench}
        substitutions={demoLineupSubstitutions}
      />
    ),
  },
};

export const EndOfArticle: Story = {
  args: {
    slug: "voetbal-training-oefeningen",
    placement: "end",
    heading: "Probeer MyTeamPlanner gratis",
    text: "In 2 minuten je team aangemaakt. Plan je trainingen met kant-en-klare oefeningen.",
    buttonLabel: "Gratis starten",
    secondaryHref: "/features/trainingen",
    secondaryLabel: "Oefeningen bekijken",
  },
};

export const TracksClick: Story = {
  args: {
    ...EndOfArticle.args,
  },
  play: async ({ canvasElement }) => {
    const pushed: Record<string, unknown>[] = [];
    window.dataLayer = { push: fn((e: Record<string, unknown>) => pushed.push(e)) } as unknown as Record<string, unknown>[];
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: /gratis starten/i });
    link.addEventListener("click", (e) => e.preventDefault(), { once: true });
    await userEvent.click(link);
    await expect(pushed[0]).toEqual({
      event: "blog_cta_click",
      slug: "voetbal-training-oefeningen",
      placement: "end",
      target: "register",
    });
  },
};
