import type { Meta, StoryObj } from "@storybook/react";

import Icon from "./Icon";
import { IconColor, IconName, IconSize } from "./Icon.types";

const meta = {
  title: "Common/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: { type: "text" },
    },
    size: {
      options: [12, 16, 20, 24, 32],
      control: { type: "radio" },
    },
    color: {
      options: [
        undefined,
        "base",
        "white",
        "inverse",
        "gray-bold",
        "gray-normal",
        "gray-subtle",
        "gray-subtler",
        "gray-subtlest",
        "primary-normal",
        "primary-subtle",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "home",
    size: 24,
  },
};

const SIZES: IconSize[] = [12, 16, 20, 24, 32];

export const Sizes: Story = {
  args: {
    name: "home",
    size: 12
  },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {SIZES.map((size) => (
        <Icon key={size} name={args.name} size={size} />
      ))}
    </div>
  ),
};

const COLORS: IconColor[] = [
  "base",
  "gray-bold",
  "gray-normal",
  "gray-subtle",
  "gray-subtler",
  "gray-subtlest",
  "primary-normal",
  "primary-subtle",
];

export const Colors: Story = {
  args: {
    name: "home",
    size: 24,
  },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {COLORS.map((color) => (
        <div
          key={color}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name={args.name} size={args.size} color={color} />
          <span style={{ fontSize: 10, color: "#888" }}>{color}</span>
        </div>
      ))}
    </div>
  ),
};

const ALL_ICONS: IconName[] = [
  "chevron-double-left",
  "chevron-double-right",
  "chevron-down",
  "chevron-up",
  "chevron-left",
  "chevron-right",
  "arrow-to-top-left",
  "arrow-to-top-right",
  "arrow-to-down-left",
  "arrow-to-down-right",
  "reply",
  "reply-2",
  "forward",
  "forward-2",
  "sort-horizontal",
  "plus",
  "minus",
  "x",
  "check",
  "magnifer",
  "eye",
  "heart",
  "like",
  "dislike",
  "bookmark",
  "bell",
  "camera",
  "chat-round",
  "dotmenu",
  "hamburger",
  "pen",
  "pen-1",
  "person",
  "folder-edit",
  "gallery",
  "gallery-edit",
  "gallery-wide",
  "inbox",
  "keyboard",
  "link",
  "settings",
  "share",
  "siren-rounded",
  "trash-bin-trash",
  "undo",
  "redo",
  "add-circle",
  "add-square",
  "check-circle",
  "check-square",
  "close-circle",
  "close-square",
  "minus-circle",
  "info-circle",
  "question-circle",
  "danger-circle",
  "danger-triangle",
  "in",
  "out",
  "down",
  "bold",
  "italic",
  "underline",
  "strikeout",
  "head",
  "fontbg",
  "fontcolor",
  "google",
  "apple",
  "xtwitter",
  "facebook",
  "kakao",
  "instagram",
  "thread",
  "pixiv",
  "youtube",
  "email",
  "home",
  "paint",
  "following",
  "board",
  "message",
];

export const AllIcons: Story = {
  args: {
    name: "home",
    size: 24,
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: 16,
      }}
    >
      {ALL_ICONS.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 8,
          }}
        >
          <Icon name={name} size={24} />
          <span style={{ fontSize: 10, color: "#888", textAlign: "center" }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
