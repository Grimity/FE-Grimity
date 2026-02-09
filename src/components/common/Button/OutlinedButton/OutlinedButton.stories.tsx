import type { Meta, StoryObj } from "@storybook/react";

import OutlinedButton from "./OutlinedButton";

const meta = {
  title: "Common/Button/OutlinedButton",
  component: OutlinedButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["large", "regular", "small"],
      control: { type: "radio" },
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof OutlinedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    size: "regular",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "large",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "small",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    loading: true,
  },
};

export const WithIcons: Story = {
  args: {
    children: "Button",
    iconLeft: <span>+</span>,
    iconRight: <span>&rarr;</span>,
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: <span>+</span>,
    "aria-label": "Add",
  },
};
