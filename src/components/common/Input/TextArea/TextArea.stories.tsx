import type { Meta, StoryObj } from "@storybook/react";
import TextArea from "./TextArea";

const meta = {
  title: "Common/Input/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "underline", "text", "sm"],
      control: { type: "radio" },
    },
    status: {
      options: ["default", "error", "disabled"],
      control: { type: "radio" },
    },
    autoResize: { control: "boolean" },
    maxCount: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    maxCount: 500,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "Error state",
    status: "error",
    defaultValue: "Invalid content",
    maxCount: 500,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    status: "disabled",
    maxCount: 500,
  },
};

export const UnderlineVariant: Story = {
  args: {
    variant: "underline",
    placeholder: "Underline style",
    maxCount: 500,
  },
};

export const TextVariant: Story = {
  args: {
    variant: "text",
    placeholder: "No border style",
    maxCount: 500,
  },
};

export const SmallVariant: Story = {
  args: {
    variant: "sm",
    placeholder: "Small textarea",
    maxCount: 500,
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: "Auto-resize textarea",
    maxCount: 500,
  },
};
