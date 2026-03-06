import type { Meta, StoryObj } from "@storybook/react";

import Category from "./Category";

const meta = {
  title: "Common/SegmentedControl/Category",
  component: Category,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["lg", "md"],
      control: { type: "radio" },
    },
    active: {
      control: { type: "boolean" },
    },
    title: {
      control: { type: "text" },
    },
    showNumber: {
      control: { type: "boolean" },
    },
    number: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Category>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    size: "lg",
    active: true,
    title: "Text",
    showNumber: true,
    number: "NN",
  },
};

export const Inactive: Story = {
  args: {
    size: "lg",
    active: false,
    title: "Text",
    showNumber: true,
    number: "NN",
  },
};

export const IconOnly: Story = {
  args: {
    size: "lg",
    iconOnly: <span>+</span>,
    "aria-label": "Add",
  },
};
