import type { Meta, StoryObj } from "@storybook/react";

import CheckBox from "./CheckBox";

const meta = {
  title: "Common/Control/CheckBox",
  component: CheckBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    size: {
      options: ["medium", "small"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    disabled: false,
    size: "medium",
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <CheckBox active={false} />
      <CheckBox active={true} />
      <CheckBox active={false} disabled />
      <CheckBox active={true} disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <CheckBox size="medium" active={false} />
      <CheckBox size="medium" active={true} />
      <CheckBox size="small" active={false} />
      <CheckBox size="small" active={true} />
    </div>
  ),
};
