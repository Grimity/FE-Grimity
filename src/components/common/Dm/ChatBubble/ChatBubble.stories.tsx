import type { Meta, StoryObj } from "@storybook/react";
import ChatBubble from "./ChatBubble";

const meta = {
  title: "DM/ChatBubble",
  component: ChatBubble,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["Others", "Default"],
    },
    state: {
      control: { type: "select" },
      options: ["Default", "Sand", "Hovered", "Heart", "RightSlide", "Answer1", "Answer2", "images"],
    },
    text: { control: "text" },
    replyText: { control: "text" },
    replyTarget: { control: "text" },
  },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OthersDefault: Story = {
  args: {
    type: "Others",
    state: "Default",
    text: "Hello~",
  },
};

export const MineDefault: Story = {
  args: {
    type: "Default",
    state: "Default",
    text: "Hello~",
  },
};

export const OthersHovered: Story = {
  args: {
    type: "Others",
    state: "Hovered",
    text: "Hello~",
  },
};

export const MineHovered: Story = {
  args: {
    type: "Default",
    state: "Hovered",
    text: "Hello~",
  },
};

export const OthersHeart: Story = {
  args: {
    type: "Others",
    state: "Heart",
    text: "Hello~",
  },
};

export const MineHeart: Story = {
  args: {
    type: "Default",
    state: "Heart",
    text: "Hello~",
  },
};

export const OthersRightSlide: Story = {
  args: {
    type: "Others",
    state: "RightSlide",
    text: "Hello~",
  },
};

export const MineRightSlide: Story = {
  args: {
    type: "Default",
    state: "RightSlide",
    text: "Hello~",
  },
};

export const OthersAnswer1: Story = {
  args: {
    type: "Others",
    state: "Answer1",
    text: "넵!ㅎㅎ",
    replyText: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요.",
    replyTarget: "상대방",
  },
};

export const MineAnswer1: Story = {
  args: {
    type: "Default",
    state: "Answer1",
    text: "넵!ㅎㅎ",
    replyText: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요.",
    replyTarget: "상대방",
  },
};

export const MineImages: Story = {
  args: {
    type: "Default",
    state: "images",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>
      {(["Default", "Sand", "Hovered", "Heart", "RightSlide", "Answer1", "Answer2", "images"] as const).map((state) => (
        <div key={state} style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <span style={{ width: 100, fontSize: 12, color: "#70737e" }}>State={state}</span>
          <ChatBubble
            type="Others"
            state={state}
            text="Hello~"
            replyText="인용된 메시지입니다."
            replyTarget="상대방"
          />
          <ChatBubble
            type="Default"
            state={state}
            text="Hello~"
            replyText="인용된 메시지입니다."
            replyTarget="상대방"
          />
        </div>
      ))}
    </div>
  ),
};
