import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import UserHover from "./UserHover";

const meta = {
  title: "Common/Card/UserHover",
  component: UserHover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    nickname: "Nickname",
    isFollowing: false,
  },
  argTypes: {
    isFollowing: { control: "boolean" },
    content: { control: "text" },
  },
} satisfies Meta<typeof UserHover>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveWrapper(
  args: React.ComponentProps<typeof UserHover>
) {
  const [isFollowing, setIsFollowing] = useState(args.isFollowing ?? false);
  return (
    <UserHover
      {...args}
      isFollowing={isFollowing}
      onFollowClick={() => setIsFollowing((prev) => !prev)}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
};

export const WithContent: Story = {
  args: {
    content:
      "소개글 2줄이 노출됩니다. 내용이 길지 않을 경우 한줄만 차지하게 해주세요, 넘어가면 이렇게 처리해주세요.",
  },
  render: (args) => <InteractiveWrapper {...args} />,
};
