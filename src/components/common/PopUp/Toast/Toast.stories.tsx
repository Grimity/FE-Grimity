import type { Meta, StoryObj } from "@storybook/react";
import Toast from "./Toast";

const meta = {
  title: "Common/PopUp/Toast",
  component: Toast,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["Positive", "Negative", "Cautionary", "Info", "Default"],
      control: { type: "radio" },
    },
    text: { control: "text" },
    duration: { control: { type: "number", min: 500 } },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    type: "Positive",
    text: "안내 메시지",
    duration: 5000,
  },
};

export const Default: Story = {
  args: {
    type: "Default",
    text: "안내 메시지",
    duration: 5000,
  },
};

export const Negative: Story = {
  args: {
    type: "Negative",
    text: "안내 메시지",
    duration: 5000,
  },
};

export const Cautionary: Story = {
  args: {
    type: "Cautionary",
    text: "안내 메시지",
    duration: 5000,
  },
};

export const Info: Story = {
  args: {
    type: "Info",
    text: "안내 메시지",
    duration: 5000,
  },
};
