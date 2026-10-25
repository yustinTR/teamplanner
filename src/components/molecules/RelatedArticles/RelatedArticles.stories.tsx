import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RelatedArticles } from "./RelatedArticles";

const meta: Meta<typeof RelatedArticles> = {
  title: "Molecules/RelatedArticles",
  component: RelatedArticles,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof RelatedArticles>;

const posts = [
  {
    slug: "opstelling-maken-voetbal",
    title: "Opstelling maken voor je voetbalteam",
    description: "Stap voor stap een opstelling maken die past bij je spelers, met wissels die eerlijk verdeeld zijn.",
    readingTime: "6 min",
  },
  {
    slug: "wisselschema-jeugdvoetbal",
    title: "Wisselschema voor jeugdvoetbal",
    description: "Zo zorg je dat iedereen evenveel speelt, zonder gedoe langs de lijn.",
    readingTime: "5 min",
  },
  {
    slug: "opstelling-7-tegen-7-voetbal",
    title: "Opstelling 7 tegen 7",
    description: "De beste formaties voor 7 tegen 7 en wanneer je welke kiest.",
    readingTime: "4 min",
  },
];

export const Default: Story = {
  args: { posts },
};

export const SinglePost: Story = {
  args: { posts: posts.slice(0, 1), title: "Verder lezen" },
};

export const Empty: Story = {
  args: { posts: [] },
};
