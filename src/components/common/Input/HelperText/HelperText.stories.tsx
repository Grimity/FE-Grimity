import type { Meta, StoryObj } from "@storybook/react";
import HelperText from "./HelperText";

const meta = {
  title: "Common/Input/HelperText",
  component: HelperText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: ["default", "error", "success"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof HelperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Helper text message",
    status: "default",
  },
};

export const Error: Story = {
  args: {
    message: "This field is required",
    status: "error",
  },
};

export const Success: Story = {
  args: {
    message: "Looks good!",
    status: "success",
  },
};

export const WithCount: Story = {
  args: {
    currentCount: 12,
    maxCount: 100,
    status: "default",
  },
};

export const MessageAndCount: Story = {
  args: {
    message: "Keep it short",
    currentCount: 45,
    maxCount: 50,
    status: "default",
  },
};

export const ErrorWithCount: Story = {
  args: {
    message: "Too many characters",
    currentCount: 55,
    maxCount: 50,
    status: "error",
  },
};
