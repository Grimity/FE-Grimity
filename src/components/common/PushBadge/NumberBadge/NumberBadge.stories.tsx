import type { Meta, StoryObj } from "@storybook/react";

import NumberBadge from "./NumberBadge";

const meta = {
  title: "Common/PushBadge/NumberBadge",
  component: NumberBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["solid", "outline", "text"],
      control: { type: "radio" },
    },
    count: {
      control: { type: "number" },
    },
  },
} satisfies Meta<typeof NumberBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    count: 5,
    variant: "solid",
  },
};

export const Outline: Story = {
  args: {
    count: 12,
    variant: "outline",
  },
};

export const Text: Story = {
  args: {
    count: 99,
    variant: "text",
  },
};

export const Default: Story = {
  args: {
    count: 3,
    variant: "solid",
  },
};

export const OverNinetyNine: Story = {
  args: {
    count: 100,
    variant: "solid",
  },
};
