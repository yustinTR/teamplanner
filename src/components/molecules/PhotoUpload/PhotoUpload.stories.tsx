import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhotoUpload } from "./PhotoUpload";

const meta: Meta<typeof PhotoUpload> = {
  title: "Molecules/PhotoUpload",
  component: PhotoUpload,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PhotoUpload>;

export const NoPhoto: Story = {
  args: {
    playerName: "Jan de Vries",
    onUpload: (file) => {
      console.log("Upload:", file.name);
    },
  },
};

export const WithPhoto: Story = {
  args: {
    currentPhotoUrl: "https://i.pravatar.cc/150?u=jan",
    playerName: "Jan de Vries",
    onUpload: (file) => {
      console.log("Upload:", file.name);
    },
  },
};

export const Uploading: Story = {
  args: {
    playerName: "Jan de Vries",
    onUpload: () => {},
    isUploading: true,
  },
};
