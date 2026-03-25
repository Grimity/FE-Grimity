import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Filter from "./Filter";

const SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "좋아요순", value: "popular" },
];

const TITLE_OPTIONS = [
  { label: "제목", value: "title" },
  { label: "작성자", value: "author" },
  { label: "내용", value: "content" },
];

const meta = {
  title: "Common/Filter",
  component: Filter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
  argTypes: {
    variant: {
      options: ["outline", "text"],
      control: { type: "radio" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  args: {
    variant: "outline",
    options: TITLE_OPTIONS,
    value: "title",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

export const OutlineDisabled: Story = {
  args: {
    variant: "outline",
    options: TITLE_OPTIONS,
    value: "title",
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    options: SORT_OPTIONS,
    value: "latest",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

export const TextDisabled: Story = {
  args: {
    variant: "text",
    options: SORT_OPTIONS,
    value: "latest",
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};
