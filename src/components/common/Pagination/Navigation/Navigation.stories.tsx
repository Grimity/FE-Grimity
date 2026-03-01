import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/Asset/IconTemp";
import Navigation from "./Navigation";

const meta = {
  title: "Common/Pagination/Navigation",
  component: Navigation,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    maxVisiblePages: { control: { type: "number", min: 1 } },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: action("page-change"),
  },
};

export const FivePages: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: action("page-change"),
  },
};

export const PageIconOnly: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: action("page-change"),
  },
  render: (args) => <Navigation {...args} />,
};
