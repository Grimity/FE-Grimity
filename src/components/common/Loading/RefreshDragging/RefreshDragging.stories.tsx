import type { Meta, StoryObj } from "@storybook/react";

import RefreshDragging from "./RefreshDragging";

const meta = {
  title: "Common/Loading/RefreshDragging",
  component: RefreshDragging,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["basic", "dark"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof RefreshDragging>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "basic",
  },
};

export const Dark: Story = {
  args: {
    type: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
