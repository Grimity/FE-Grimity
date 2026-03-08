import type { Meta, StoryObj } from "@storybook/react";

import Heart from "./Heart";

const meta = {
  title: "Common/Control/Heart",
  component: Heart,
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
} satisfies Meta<typeof Heart>;

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
      <Heart active={false} variant="default" />
      <Heart active={true} variant="default" />
      <div
        style={{
          display: "flex",
          gap: 16,
          backgroundColor: "#1a1b1e",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Heart active={false} variant="black" />
        <Heart active={true} variant="black" />
      </div>
    </div>
  ),
};
