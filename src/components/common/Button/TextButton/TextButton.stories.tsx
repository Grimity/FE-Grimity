import type { Meta, StoryObj } from "@storybook/react";

import TextButton from "./TextButton";

const meta = {
  title: "Common/Button/TextButton",
  component: TextButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["primary", "assistive"],
      control: { type: "radio" },
    },
    size: {
      options: ["large", "regular", "small"],
      control: { type: "radio" },
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Text Button",
    variant: "primary",
    size: "regular",
  },
};

export const Assistive: Story = {
  args: {
    children: "Text Button",
    variant: "assistive",
    size: "regular",
  },
};

export const Large: Story = {
  args: {
    children: "Large Text Button",
    variant: "primary",
    size: "large",
  },
};

export const Small: Story = {
  args: {
    children: "Small Text Button",
    variant: "primary",
    size: "small",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    variant: "primary",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    variant: "primary",
    loading: true,
  },
};

export const WithIcons: Story = {
  args: {
    children: "Button",
    variant: "primary",
    iconLeft: <span>+</span>,
    iconRight: <span>&rarr;</span>,
  },
};
