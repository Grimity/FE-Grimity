import type { Meta, StoryObj } from "@storybook/react";

import DotBadge from "./DotBadge";

const meta = {
  title: "Common/PushBadge/DotBadge",
  component: DotBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xSmall", "small", "medium"],
      control: { type: "radio" },
    },
    position: {
      options: ["topRight", "topLeft", "bottomRight", "bottomLeft"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof DotBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

const ExampleIcon = () => (
  <div
    style={{
      width: 40,
      height: 40,
      backgroundColor: "#e0e0e0",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
    }}
  >
    🔔
  </div>
);

export const Default: Story = {
  args: {
    size: "small",
    position: "topRight",
    children: <ExampleIcon />,
  },
};

export const XSmall: Story = {
  args: {
    size: "xSmall",
    position: "topRight",
    children: <ExampleIcon />,
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    position: "topRight",
    children: <ExampleIcon />,
  },
};

export const TopLeft: Story = {
  args: {
    size: "small",
    position: "topLeft",
    children: <ExampleIcon />,
  },
};

export const BottomRight: Story = {
  args: {
    size: "small",
    position: "bottomRight",
    children: <ExampleIcon />,
  },
};

export const BottomLeft: Story = {
  args: {
    size: "small",
    position: "bottomLeft",
    children: <ExampleIcon />,
  },
};
