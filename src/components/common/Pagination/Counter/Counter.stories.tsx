import type { Meta, StoryObj } from "@storybook/react";
import Counter from "./Counter";

const meta = {
  title: "Common/Pagination/Counter",
  component: Counter,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["lg", "md"], control: { type: "radio" } },
    current: { control: { type: "number", min: 1 } },
    total: { control: { type: "number", min: 1 } },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { current: 1, total: 10, size: "lg" },
};

export const Large: Story = {
  args: { current: 1, total: 10, size: "lg" },
};

export const Medium: Story = {
  args: { current: 5, total: 10, size: "md" },
};
