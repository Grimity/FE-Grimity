import type { Meta, StoryObj } from "@storybook/react";

import Chip from "./Chip";

const meta = {
  title: "Common/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "assistive"],
    },
    size: {
      control: { type: "select" },
      options: ["xl", "md"],
    },
    children: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Chip",
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Chip variant="primary">Primary</Chip>
      <Chip variant="assistive">Assistive</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Chip size="xl">XL</Chip>
      <Chip size="md">MD</Chip>
    </div>
  ),
};
