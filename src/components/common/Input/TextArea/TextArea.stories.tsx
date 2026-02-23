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
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "Error state",
    status: "error",
    defaultValue: "Invalid content",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    status: "disabled",
  },
};

export const WithCount: Story = {
  args: {
    placeholder: "Type something...",
    currentCount: 45,
    maxCount: 200,
  },
};

export const UnderlineVariant: Story = {
  args: {
    variant: "underline",
    placeholder: "Underline style",
  },
};

export const TextVariant: Story = {
  args: {
    variant: "text",
    placeholder: "No border style",
  },
};

export const SmallVariant: Story = {
  args: {
    variant: "sm",
    placeholder: "Small textarea",
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: "Auto-resize textarea",
  },
};
