import type { Meta, StoryObj } from "@storybook/react";

import UserInfo from "./UserInfo";

const meta = {
  title: "Common/Cell/UserInfo",
  component: UserInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["default", "community", "comment", "follow"],
      control: { type: "radio" },
    },
    nickname: {
      control: { type: "text" },
    },
    showHeart: {
      control: { type: "boolean" },
    },
    heartCount: {
      control: { type: "text" },
    },
    showView: {
      control: { type: "boolean" },
    },
    viewCount: {
      control: { type: "text" },
    },
    showTime: {
      control: { type: "boolean" },
    },
    timeCount: {
      control: { type: "text" },
    },
    showChatting: {
      control: { type: "boolean" },
    },
    chattingCount: {
      control: { type: "text" },
    },
    showTag: {
      control: { type: "boolean" },
    },
    followerCount: {
      control: { type: "text" },
    },
    showFollowing: {
      control: { type: "boolean" },
    },
    followingCount: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "default",
    nickname: "닉네임",
    showHeart: true,
    heartCount: "128",
    showView: true,
    viewCount: "1.2K",
    showTime: true,
    timeCount: "3시간 전",
  },
};

export const DefaultHeartOnly: Story = {
  args: {
    type: "default",
    nickname: "아티스트",
    showHeart: true,
    heartCount: "42",
  },
};

export const DefaultAllHidden: Story = {
  args: {
    type: "default",
    nickname: "닉네임만 표시",
  },
};

export const Community: Story = {
  args: {
    type: "community",
    showChatting: true,
    chattingCount: "56",
    showHeart: true,
    heartCount: "128",
    showView: true,
    viewCount: "1.2K",
    showTime: true,
    timeCount: "3시간 전",
  },
};

export const CommunityPartial: Story = {
  args: {
    type: "community",
    showChatting: true,
    chattingCount: "12",
    showHeart: true,
    heartCount: "34",
    showTime: true,
    timeCount: "1일 전",
  },
};

export const Comment: Story = {
  args: {
    type: "comment",
    nickname: "작성자닉네임",
    showTag: true,
    showTime: true,
    timeCount: "30분 전",
  },
};

export const CommentWithoutTag: Story = {
  args: {
    type: "comment",
    nickname: "일반유저",
    showTag: false,
    showTime: true,
    timeCount: "2시간 전",
  },
};

export const Follow: Story = {
  args: {
    type: "follow",
    followerCount: "1,234",
    showFollowing: true,
    followingCount: "567",
  },
};

export const FollowFollowerOnly: Story = {
  args: {
    type: "follow",
    followerCount: "89",
    showFollowing: false,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <UserInfo
        type="default"
        nickname="닉네임"
        showHeart
        heartCount="128"
        showView
        viewCount="1.2K"
        showTime
        timeCount="3시간 전"
      />
      <UserInfo
        type="community"
        showChatting
        chattingCount="56"
        showHeart
        heartCount="128"
        showView
        viewCount="1.2K"
        showTime
        timeCount="3시간 전"
      />
      <UserInfo
        type="comment"
        nickname="작성자닉네임"
        showTag
        showTime
        timeCount="30분 전"
      />
      <UserInfo
        type="comment"
        nickname="일반유저"
        showTime
        timeCount="2시간 전"
      />
      <UserInfo
        type="follow"
        followerCount="1,234"
        showFollowing
        followingCount="567"
      />
      <UserInfo type="follow" followerCount="89" />
    </div>
  ),
};
