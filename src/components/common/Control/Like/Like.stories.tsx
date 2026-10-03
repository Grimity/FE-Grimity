import type { Meta, StoryObj } from "@storybook/react";

import Like from "./Like";

const meta = {
  title: "Common/Control/Like",
  component: Like,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: { type: "boolean" },
    },
    variant: {
      options: ["default", "black"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Like>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    variant: "default",
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Like active={false} variant="default" />
      <Like active={true} variant="default" />
      <div
        style={{
          display: "flex",
          gap: 16,
          backgroundColor: "#1a1b1e",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Like active={false} variant="black" />
        <Like active={true} variant="black" />
      </div>
    </div>
  ),
};
