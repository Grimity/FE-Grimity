import type { Meta, StoryObj } from "@storybook/react";

import Thumbnail from "./Thumbnail";

const meta = {
  title: "Common/Thumbnail",
  component: Thumbnail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    ratio: {
      options: [
        "1/1",
        "5/4",
        "4/3",
        "3/2",
        "16/10",
        "16/9",
        "2/1",
        "21/9",
        "4/1",
        "3/4",
      ],
      control: { type: "select" },
    },
    src: { control: "text" },
    alt: { control: "text" },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "썸네일",
    ratio: "1/1",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithImage: Story = {
  args: {
    src: "https://picsum.photos/400/400",
    alt: "샘플 이미지",
    ratio: "1/1",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const Ratio5_4: Story = {
  args: {
    alt: "5:4 비율",
    ratio: "5/4",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const Ratio4_3: Story = {
  args: {
    alt: "4:3 비율",
    ratio: "4/3",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const Ratio16_9: Story = {
  args: {
    alt: "16:9 비율",
    ratio: "16/9",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const Ratio3_4: Story = {
  args: {
    alt: "3:4 비율",
    ratio: "3/4",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllRatios: Story = {
  args: {
    alt: "전체 비율",
  },
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "start" }}>
      {(
        ["1/1", "5/4", "4/3", "3/2", "16/10", "16/9", "2/1", "21/9", "4/1", "3/4"] as const
      ).map((ratio) => (
        <div key={ratio} style={{ width: 120, textAlign: "center" }}>
          <p style={{ marginBottom: 8, fontSize: 14 }}>{ratio}</p>
          <Thumbnail alt={`${ratio} 비율`} ratio={ratio} />
        </div>
      ))}
    </div>
  ),
};
