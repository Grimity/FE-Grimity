import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import Album from "./Album";

const meta = {
  title: "Common/Card/Album",
  component: Album,
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
    title: "Main title is here Main title is here Main title is here",
    nickname: "Nickname",
    likeCount: 32,
    viewCount: 123,
  },
  argTypes: {
    variant: {
      options: ["mainTitle", "check", "rank"],
      control: { type: "radio" },
    },
    checked: { control: "boolean" },
    rank: { options: [1, 2, 3, 4], control: { type: "radio" } },
    isLiked: { control: "boolean" },
  },
} satisfies Meta<typeof Album>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MainTitle: Story = {
  args: {
    variant: "mainTitle",
    onLikeClick: fn(),
  },
};

export const Check: Story = {
  args: {
    variant: "check",
    onCheckClick: fn(),
  },
};

export const Rank: Story = {
  args: {
    variant: "rank",
    rank: 1,
    onLikeClick: fn(),
  },
};
