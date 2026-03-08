import type { Meta, StoryObj } from "@storybook/react";

import Bookmark from "./Bookmark";

const meta = {
  title: "Common/Control/Bookmark",
  component: Bookmark,
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
} satisfies Meta<typeof Bookmark>;

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
      <Bookmark active={false} variant="default" />
      <Bookmark active={true} variant="default" />
      <div
        style={{
          display: "flex",
          gap: 16,
          backgroundColor: "#1a1b1e",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Bookmark active={false} variant="black" />
        <Bookmark active={true} variant="black" />
      </div>
    </div>
  ),
};
