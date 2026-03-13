import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import Img from "./Img";

const meta = {
  title: "Common/Card/Img",
  component: Img,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "160px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Main title is here Main title is here Main title is here ",
    onRepresentativeClick: fn(),
    onDeleteClick: fn(),
  },
  argTypes: {
    size: {
      options: ["lg", "md"],
      control: { type: "radio" },
    },
    isRepresentative: { control: "boolean" },
  },
} satisfies Meta<typeof Img>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lg: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "200px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    size: "lg",
  },
};

export const Md: Story = {
  args: {
    size: "md",
  },
};
