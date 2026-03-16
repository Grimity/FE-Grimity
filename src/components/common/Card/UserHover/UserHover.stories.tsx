import { useState } from "react";
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

function createInteractiveStory(initialHasContent: boolean): Story {
  return {
    render: (args) => {
      const [isFollowing, setIsFollowing] = useState<boolean>(
        args.isFollowing ?? false
      );

      const handleFollowClick = () => {
        setIsFollowing((prev) => !prev);
      };

      return (
        <UserHover
          {...args}
          isFollowing={isFollowing}
          onFollowClick={handleFollowClick}
          content={initialHasContent ? args.content : undefined}
        />
      );
    },
  };
}

export const Default: Story = createInteractiveStory(false);

export const WithContent: Story = {
  ...createInteractiveStory(true),
  args: {
    content:
      "소개글 2줄이 노출됩니다. 내용이 길지 않을 경우 한줄만 차지하게 해주세요, 넘어가면 이렇게 처리해주세요.",
  },
};
