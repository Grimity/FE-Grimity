import type { Meta, StoryObj } from "@storybook/react";
import FloatingActionButton from "./FloatingActionButton";

const meta = {
  title: "Common/Navigation/FloatingActionButton",
  component: FloatingActionButton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: "그림 업로드",
    onClick: () => {},
  },
  render: (args) => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "100vh" }}>
      <FloatingActionButton {...args} />
    </div>
  ),
};
