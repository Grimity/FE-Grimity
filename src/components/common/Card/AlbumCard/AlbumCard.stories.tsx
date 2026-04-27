import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import AlbumCard from "./AlbumCard";

const meta = {
  title: "Common/Card/AlbumCard",
  component: AlbumCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "160px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    checked: false,
    count: 0,
    onClick: fn(),
  },
  argTypes: {
    checked: { control: "boolean" },
    count: { control: "number" },
  },
} satisfies Meta<typeof AlbumCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    count: 0,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    count: 1,
  },
};
