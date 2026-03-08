import type { Meta, StoryObj } from "@storybook/react";

import RadioButton from "./RadioButton";

const meta = {
  title: "Common/Control/RadioButton",
  component: RadioButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: false,
    disabled: false,
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <RadioButton selected={false} />
      <RadioButton selected={true} />
      <RadioButton selected={false} disabled />
      <RadioButton selected={true} disabled />
    </div>
  ),
};
