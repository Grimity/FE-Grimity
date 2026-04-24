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
    variant: {
      control: { type: "select" },
      options: ["others", "mine"],
    },
    text: { control: "text" },
    isLiked: { control: "boolean" },
    isHovered: { control: "boolean" },
    isPending: { control: "boolean" },
    showSlide: { control: "boolean" },
  },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OthersDefault: Story = {
  args: { variant: "others", text: "Hello~" },
};

export const MineDefault: Story = {
  args: { variant: "mine", text: "Hello~" },
};

export const OthersHovered: Story = {
  args: { variant: "others", text: "Hello~", isHovered: true },
};

export const OthersLiked: Story = {
  args: { variant: "others", text: "Hello~", isLiked: true },
};

export const MineLiked: Story = {
  args: { variant: "mine", text: "Hello~", isLiked: true },
};

export const OthersLikedHovered: Story = {
  args: { variant: "others", text: "Hello~", isLiked: true, isHovered: true },
};

export const OthersRightSlide: Story = {
  args: { variant: "others", text: "Hello~", showSlide: true },
};

export const OthersPending: Story = {
  args: { variant: "mine", text: "전송 중...", isPending: true },
};

export const OthersWithReply: Story = {
  args: {
    variant: "others",
    text: "넵!ㅎㅎ",
    replyTo: {
      target: "상대방",
      text: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요.",
    },
  },
};

export const MineWithReply: Story = {
  args: {
    variant: "mine",
    text: "넵!ㅎㅎ",
    replyTo: {
      target: "상대방",
      text: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요.",
    },
  },
};

export const MineWithImages: Story = {
  args: {
    variant: "mine",
    images: ["https://placehold.co/300x200/FFE6E6/FF0000?text=1"],
  },
};

export const ReplyPlusLiked: Story = {
  args: {
    variant: "others",
    text: "확인했어요",
    isLiked: true,
    replyTo: { target: "상대방", text: "이 메시지에 대해 답장합니다" },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>
      {[
        { label: "Default", props: {} },
        { label: "Hovered", props: { isHovered: true } },
        { label: "Liked", props: { isLiked: true } },
        { label: "Liked+Hovered", props: { isLiked: true, isHovered: true } },
        { label: "Slide", props: { showSlide: true } },
        { label: "Pending (mine only)", props: { isPending: true } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <span style={{ width: 140, fontSize: 12, color: "#70737e" }}>{label}</span>
          <ChatBubble variant="others" text="Hello~" {...props} />
          <ChatBubble variant="mine" text="Hello~" {...props} />
        </div>
      ))}
    </div>
  ),
};
