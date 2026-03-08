import type { Meta, StoryObj } from "@storybook/react";

import CheckMark from "./CheckMark";

const meta = {
  title: "Common/Control/CheckMark",
  component: CheckMark,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof CheckMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <CheckMark checked={false} />
      <CheckMark checked={true} />
      <CheckMark checked={false} disabled />
      <CheckMark checked={true} disabled />
    </div>
  ),
};
