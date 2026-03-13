import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import UserHover from "./UserHover";

const meta = {
  title: "Common/Card/UserHover",
  component: UserHover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    nickname: "Nickname",
    bio: "Main title is here Main title is here Main title is here",
    onFollowClick: fn(),
    onMessageClick: fn(),
  },
  argTypes: {
    concent: { control: "boolean" },
    isFollowing: { control: "boolean" },
  },
} satisfies Meta<typeof UserHover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    concent: false,
    isFollowing: false,
  },
};

export const DefaultWithConcent: Story = {
  name: "Default (concent=True)",
  args: {
    concent: true,
    isFollowing: false,
  },
};

export const Following: Story = {
  name: "Follow (concent=False)",
  args: {
    concent: false,
    isFollowing: true,
  },
};

export const FollowingWithConcent: Story = {
  name: "Follow (concent=True)",
  args: {
    concent: true,
    isFollowing: true,
  },
};
