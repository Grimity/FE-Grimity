import type { Meta, StoryObj } from "@storybook/react";

import RefreshLoading from "./RefreshLoading";

const meta = {
  title: "Common/Loading/RefreshLoading",
  component: RefreshLoading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["basic", "dark"],
      control: { type: "radio" },
    },
    size: {
      control: { type: "number" },
    },
  },
} satisfies Meta<typeof RefreshLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "basic",
    size: 24,
  },
};

export const Large: Story = {
  args: {
    type: "basic",
    size: 40,
  },
};

export const Dark: Story = {
  args: {
    type: "dark",
    size: 40,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
