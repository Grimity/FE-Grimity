import type { Meta, StoryObj } from "@storybook/react";

import Avatar from "./Avatar";

const meta = {
  title: "Common/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["photo", "default", "dark"],
      control: { type: "select" },
    },
    size: {
      control: { type: "text" },
      description: "Named size (xxl|xl|lg|ml|md|sm|xs) or number (px)",
    },
    src: { control: "text" },
    alt: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "default",
    size: "xl",
    alt: "기본 아바타",
  },
};

export const Dark: Story = {
  args: {
    type: "dark",
    size: "xl",
    alt: "다크 아바타",
  },
};

export const Photo: Story = {
  args: {
    src: "https://picsum.photos/200/200",
    size: "xl",
    alt: "프로필 이미지",
  },
};

export const AllSizes: Story = {
  args: {
    alt: "사이즈별 아바타",
  },
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {(["xxl", "xl", "lg", "ml", "md", "sm", "xs"] as const).map((size) => (
        <div
          key={size}
          style={{ textAlign: "center", fontSize: 12, color: "#9397a5" }}
        >
          <Avatar size={size} alt={`${size} 아바타`} />
          <p style={{ marginTop: 8 }}>
            {size}
          </p>
        </div>
      ))}
    </div>
  ),
};

export const AllTypes: Story = {
  args: {
    alt: "타입별 아바타",
  },
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "start" }}>
      {(["xxl", "xl", "lg", "ml", "md", "sm", "xs"] as const).map((size) => (
        <div
          key={size}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            fontSize: 12,
            color: "#9397a5",
          }}
        >
          <p>
            {size}
          </p>
          <Avatar
            src="https://picsum.photos/200/200"
            size={size}
            alt="Photo"
          />
          <Avatar type="default" size={size} alt="Default" />
          <Avatar type="dark" size={size} alt="Dark" />
        </div>
      ))}
    </div>
  ),
};

export const CustomSizes: Story = {
  args: {
    alt: "커스텀 사이즈",
  },
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {[28, 30, 50].map((size) => (
        <div
          key={size}
          style={{ textAlign: "center", fontSize: 12, color: "#9397a5" }}
        >
          <Avatar size={size} alt={`${size}px 아바타`} />
          <p style={{ marginTop: 8 }}>{size}px</p>
        </div>
      ))}
    </div>
  ),
};
