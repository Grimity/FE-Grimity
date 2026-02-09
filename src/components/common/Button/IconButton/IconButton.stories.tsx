import type { Meta, StoryObj } from "@storybook/react";

import IconButton from "./IconButton";

const meta = {
  title: "Common/Button/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["sm", "normal", "outlined", "solid"],
      control: { type: "radio" },
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    badge: { control: "boolean" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    icon: <span>+</span>,
    variant: "normal",
    "aria-label": "Add",
  },
};

export const Sm: Story = {
  args: {
    icon: <span>+</span>,
    variant: "sm",
    "aria-label": "Add",
  },
};

export const Outlined: Story = {
  args: {
    icon: <span>+</span>,
    variant: "outlined",
    "aria-label": "Add",
  },
};

export const Solid: Story = {
  args: {
    icon: <span>+</span>,
    variant: "solid",
    "aria-label": "Add",
  },
};

export const WithBadge: Story = {
  args: {
    icon: <span>🔔</span>,
    variant: "normal",
    badge: true,
    "aria-label": "Notifications",
  },
};

export const Disabled: Story = {
  args: {
    icon: <span>+</span>,
    variant: "normal",
    disabled: true,
    "aria-label": "Add",
  },
};

export const Loading: Story = {
  args: {
    icon: <span>+</span>,
    variant: "normal",
    loading: true,
    "aria-label": "Add",
  },
};
