import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import CommissionTab from "./CommissionTab";
import styles from "./CommissionTab.stories.module.scss";

const GROUP_TABS = ["정보", "포트폴리오", "후기"];

function CommissionTabGroupDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.group}>
      {GROUP_TABS.map((title, index) => (
        <CommissionTab
          key={title}
          size="lg"
          active={activeIndex === index}
          title={title}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}

const meta = {
  title: "Common/SegmentedControl/CommissionTab",
  component: CommissionTab,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "radio" },
    },
    active: {
      control: { type: "boolean" },
    },
    title: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof CommissionTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    size: "lg",
    active: true,
    title: "Text",
  },
};

export const Inactive: Story = {
  args: {
    size: "lg",
    active: false,
    title: "Text",
  },
};

export const Group: Story = {
  args: {
    title: "Text",
  },
  render: () => <CommissionTabGroupDemo />,
};
