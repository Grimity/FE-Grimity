import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import Empty from "./Empty";

const meta = {
  title: "Common/Empty",
  component: Empty,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["xl", "md"], control: { type: "radio" } },
    buttonVariant: { options: ["solid", "outline"], control: { type: "radio" } },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultContent =
  "상황에 대한 설명이 들어가요. 설명은 최대 2줄까지만 작성해요.상황에 대한 설명이 들어가요. 설명은 최대 2줄까지만 작성해요.상황에 대한 설명이 들어가요.설명은 최대 2줄까지만 작성해요.상황에 대한 설명이 들어가요. 설명은 최대 2줄까지만 작성해요.";

export const TitleOnly: Story = {
  args: {
    size: "md",
    title: "Title",
  },
};

export const WithContent: Story = {
  args: {
    size: "md",
    title: "Title",
    content: defaultContent,
  },
};

export const WithSolidButton: Story = {
  args: {
    size: "md",
    title: "Title",
    content: defaultContent,
    buttonLabel: "label",
    onButtonClick: action("button-click"),
    buttonVariant: "solid",
  },
};

export const WithOutlineButton: Story = {
  args: {
    size: "md",
    title: "Title",
    content: defaultContent,
    buttonLabel: "Label",
    onButtonClick: action("button-click"),
    buttonVariant: "outline",
  },
};
