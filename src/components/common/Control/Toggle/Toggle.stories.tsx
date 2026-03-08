import type { Meta, StoryObj } from "@storybook/react";

import Toggle from "./Toggle";

const meta = {
  title: "Common/Control/Toggle",
  component: Toggle,
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
} satisfies Meta<typeof Toggle>;

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
      <Toggle checked={false} />
      <Toggle checked={true} />
      <Toggle checked={false} disabled />
      <Toggle checked={true} disabled />
    </div>
  ),
};
