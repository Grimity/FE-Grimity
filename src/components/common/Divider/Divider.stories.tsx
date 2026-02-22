import type { Meta, StoryObj } from "@storybook/react";

import Divider from "./Divider";

const meta = {
  title: "Common/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["normal", "bold", "vertical"],
      control: { type: "radio" },
    },
    variant: {
      options: ["brand", "primary", "secondary"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "normal",
    variant: "primary",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Bold: Story = {
  args: {
    size: "bold",
    variant: "primary",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    size: "vertical",
    variant: "primary",
  },
  decorators: [
    (Story) => (
      <div style={{ height: 80, display: "flex" }}>
        <Story />
      </div>
    ),
  ],
};

export const Brand: Story = {
  args: {
    size: "normal",
    variant: "brand",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Secondary: Story = {
  args: {
    size: "normal",
    variant: "secondary",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};
