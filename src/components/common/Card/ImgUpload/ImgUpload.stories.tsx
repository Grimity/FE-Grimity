import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import ImgUpload from "./ImgUpload";

const meta = {
  title: "Common/Card/ImgUpload",
  component: ImgUpload,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["lg", "md"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof ImgUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lg: Story = {
  args: {
    size: "lg",
    onClick: fn(),
  },
};

export const Md: Story = {
  args: {
    size: "md",
    onClick: fn(),
  },
};
