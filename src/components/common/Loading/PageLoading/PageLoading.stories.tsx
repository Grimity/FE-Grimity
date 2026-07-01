import type { Meta, StoryObj } from "@storybook/react";

import PageLoading from "./PageLoading";

const meta = {
  title: "Common/Loading/PageLoading",
  component: PageLoading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof PageLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "로딩 중이에요",
  },
};

export const WithDescription: Story = {
  args: {
    title: "로딩 중이에요",
    description: "잠시만 기다려 주세요.",
  },
};
