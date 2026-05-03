import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import UserCard from "./User";
import type {
  DefaultUserCardProps,
  SearchUserCardProps,
  TagViewUserCardProps,
} from "./User.types";

const meta = {
  title: "Common/Card/User",
  component: UserCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    nickname: "Nickname",
    isFollowing: false,
  },
  argTypes: {
    variant: { table: { disable: true } },
    avatarUrl: { control: "text", description: "프로필 이미지 URL" },
    nickname: { control: "text" },
    followerCount: { control: "number" },
    followingCount: { control: "number" },
    isFollowing: { control: "boolean" },
    content: { control: "text" },
    bannerUrl: { control: "text", description: "배경 이미지 URL" },
    tagText: { control: "text" },
  },
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultWrapper(args: DefaultUserCardProps) {
  const [isFollowing, setIsFollowing] = useState(args.isFollowing ?? false);
  return (
    <div style={{ width: "320px" }}>
      <UserCard
        {...args}
        variant="default"
        isFollowing={isFollowing}
        onFollowClick={() => setIsFollowing((prev) => !prev)}
      />
    </div>
  );
}

function SearchWrapper(args: SearchUserCardProps) {
  const [isFollowing, setIsFollowing] = useState(args.isFollowing ?? false);
  return (
    <UserCard
      {...args}
      variant="search"
      isFollowing={isFollowing}
      onFollowClick={() => setIsFollowing((prev) => !prev)}
    />
  );
}

export const Default: Story = {
  args: {
    variant: "default",
    nickname: "Nickname",
    followerCount: 123,
    followingCount: 32,
    images: [{}, {}, {}],
  } as DefaultUserCardProps,
  render: (args) => <DefaultWrapper {...(args as DefaultUserCardProps)} />,
};

export const Search: Story = {
  args: {
    variant: "search",
    followerCount: 123,
    content:
      "소개글 2줄이 노출됩니다. 내용이 길지 않을 경우 한줄만 차지하게 해주세요, 넘어가면 이렇게 처리해주세요.",
  } as SearchUserCardProps,
  render: (args) => <SearchWrapper {...(args as SearchUserCardProps)} />,
};

export const TagView: Story = {
  args: {
    variant: "tagView",
    tagText: "태그 내용 태그 내용태그 내용태그 내용태그 내용",
  } as TagViewUserCardProps,
  render: (args) => <UserCard {...(args as TagViewUserCardProps)} />,
};
