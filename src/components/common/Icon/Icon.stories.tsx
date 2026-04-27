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
    size: 12,
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

const ICON_CATEGORIES: { label: string; icons: IconName[] }[] = [
  {
    label: "Normal",
    icons: [
      "chevron-double-left",
      "chevron-double-left-thick",
      "chevron-double-right",
      "chevron-double-right-thick",
      "chevron-down",
      "chevron-down-thick",
      "chevron-up",
      "chevron-up-thick",
      "chevron-left",
      "chevron-left-thick",
      "chevron-left-tight",
      "chevron-left-tight-thick",
      "chevron-right",
      "chevron-right-thick",
      "chevron-right-tight",
      "chevron-right-tight-thick",
      "arrow-to-top-left",
      "arrow-to-top-right",
      "arrow-to-down-left",
      "arrow-to-down-right",
      "reply",
      "reply-2",
      "reply-branch",
      "forward",
      "forward-2",
      "sort-horizontal",
      "plus",
      "plus-thick",
      "minus",
      "minus-thick",
      "x",
      "x-thick",
      "check",
      "magnifer",
      "magnifer-fill",
      "eye",
      "eye-off",
      "heart",
      "heart-fill",
      "like",
      "like-fill",
      "dislike",
      "dislike-fill",
      "bookmark",
      "bookmark-fill",
      "bell",
      "bell-fill",
      "camera",
      "camera-fill",
      "chat-round",
      "dotmenu",
      "dotmenu-vertical",
      "hamburger",
      "pen",
      "pen-fill",
      "pen-1",
      "pen-1-fill",
      "person",
      "person-fill",
      "folder-edit",
      "gallery",
      "gallery-fill",
      "gallery-edit",
      "gallery-wide",
      "gallery-wide-fill",
      "inbox",
      "keyboard",
      "keyboard-on",
      "link",
      "settings",
      "share",
      "siren-rounded",
      "siren-rounded-fill",
      "trash-bin-trash",
      "undo",
      "redo",
      "add-circle",
      "add-circle-fill",
      "add-square",
      "add-square-fill",
      "check-circle",
      "check-circle-fill",
      "check-square",
      "check-square-fill",
      "close-circle",
      "close-circle-fill",
      "close-square",
      "close-square-fill",
      "minus-circle",
      "minus-circle-fill",
      "info-circle",
      "info-circle-fill",
      "question-circle",
      "question-circle-fill",
      "danger-circle",
      "danger-circle-fill",
      "danger-triangle",
      "danger-triangle-fill",
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
      "dot",
    ],
  },
  {
    label: "Brand",
    icons: [
      "google",
      "apple",
      "xtwitter",
      "xtwitter-fill",
      "facebook",
      "facebook-fill",
      "kakao",
      "kakao-fill",
      "instagram",
      "instagram-fill",
      "thread",
      "thread-fill",
      "pixiv",
      "pixiv-fill",
      "youtube",
      "youtube-fill",
      "email",
    ],
  },
  {
    label: "Navigation",
    icons: ["home", "paint", "following", "board", "message"],
  },
  {
    label: "Logo",
    icons: ["logo", "logo-g-square", "logo-g", "logo-g-circle", "profile"],
  },
  {
    label: "Graphic",
    icons: ["rank-1", "rank-2", "rank-3", "rank-4"],
  },
  {
    label: "Illust",
    icons: [
      "illust-upload-success",
      "illust-result-null",
      "illust-user",
      "illust-alarm",
      "illust-replay",
      "illust",
      "illust-success",
      "illust-warning",
    ],
  },
];

export const AllIcons: Story = {
  args: {
    name: "home",
    size: 24,
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {ICON_CATEGORIES.map((category) => (
        <div key={category.label}>
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: 14,
              fontWeight: 600,
              color: "#333",
              borderBottom: "1px solid #eee",
              paddingBottom: 8,
            }}
          >
            {category.label}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 16,
            }}
          >
            {category.icons.map((name) => (
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
                <span style={{ fontSize: 10, color: "#888", textAlign: "center" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
