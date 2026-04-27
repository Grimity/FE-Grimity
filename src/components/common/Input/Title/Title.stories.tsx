import type { Meta, StoryObj } from "@storybook/react";
import Title from "./Title";

const meta = {
  title: "Common/Input/Title",
  component: Title,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showEssential: { control: "boolean" },
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Label",
  },
};

export const WithEssential: Story = {
  args: {
    text: "Label",
    showEssential: true,
  },
};

export const AsLabel: Story = {
  args: {
    text: "Label",
    htmlFor: "sample-input",
    showEssential: true,
  },
};
