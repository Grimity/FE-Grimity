import type { Meta, StoryObj } from "@storybook/react";

import Tab from "./Tab";

const meta = {
  title: "Common/SegmentedControl/Tab",
  component: Tab,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
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
} satisfies Meta<typeof Tab>;

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
