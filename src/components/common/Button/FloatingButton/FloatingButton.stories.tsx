import type { Meta, StoryObj } from "@storybook/react";

import FloatingButton from "./FloatingButton";

const meta = {
  title: "Common/Button/FloatingButton",
  component: FloatingButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof FloatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "그림 올리기",
  },
};

export const Disabled: Story = {
  args: {
    "aria-label": "그림 올리기",
    disabled: true,
  },
};
