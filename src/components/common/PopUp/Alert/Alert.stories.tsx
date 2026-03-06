import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import Alert from "./Alert";

const meta = {
  title: "Common/PopUp/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: ["illust", "content", "normal"], control: { type: "radio" } },
    size: { options: ["xl", "md"], control: { type: "radio" } },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTitle = "Main text";
const defaultContentText = "상황에 대한 설명이 들어가요. 설명은 최대 2줄까지만 작성해요.";

export const IllustMd: Story = {
  args: {
    variant: "illust",
    size: "md",
    title: defaultTitle,
    contentText: defaultContentText,
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const IllustXl: Story = {
  args: {
    variant: "illust",
    size: "xl",
    title: defaultTitle,
    contentText: defaultContentText,
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const ContentMd: Story = {
  args: {
    variant: "content",
    size: "md",
    title: defaultTitle,
    contentText: defaultContentText,
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const ContentXl: Story = {
  args: {
    variant: "content",
    size: "xl",
    title: defaultTitle,
    contentText: defaultContentText,
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const NormalMd: Story = {
  args: {
    variant: "normal",
    size: "md",
    title: defaultTitle,
    contentText: defaultContentText,
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};

export const NormalXl: Story = {
  args: {
    variant: "normal",
    size: "xl",
    title: defaultTitle,
    contentText: defaultContentText,
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};
