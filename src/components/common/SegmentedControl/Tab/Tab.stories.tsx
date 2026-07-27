import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Tab from "./Tab";
import styles from "./Tab.stories.module.scss";

const GROUP_TABS = [
  { title: "전체", number: 128 },
  { title: "일러스트", number: 52 },
  { title: "만화", number: 34 },
  { title: "사진", number: 12 },
];

function TabGroupDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.group}>
      {GROUP_TABS.map((tab, index) => (
        <Tab
          key={tab.title}
          size="lg"
          active={activeIndex === index}
          title={tab.title}
          number={tab.number}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}

const meta = {
  title: "Common/SegmentedControl/Tab",
  component: Tab,
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
    showNumber: {
      control: { type: "boolean" },
    },
    number: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    size: "lg",
    active: true,
    title: "Text",
    showNumber: true,
    number: "NN",
  },
};

export const Inactive: Story = {
  args: {
    size: "lg",
    active: false,
    title: "Text",
    showNumber: true,
    number: "NN",
  },
};

export const Group: Story = {
  args: {
    title: "Text",
  },
  render: () => <TabGroupDemo />,
};
