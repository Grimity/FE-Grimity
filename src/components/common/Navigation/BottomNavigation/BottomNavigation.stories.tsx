import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import BottomNavigation from "./BottomNavigation";
import type { BottomNavTab } from "./BottomNavigation.types";

const meta = {
  title: "Common/Navigation/BottomNavigation",
  component: BottomNavigation,
  parameters: {
    layout: "mobile",
  },
  tags: ["autodocs"],
  argTypes: {
    activeTab: {
      options: ["home", "rank", "following", "board", "dm"],
      control: { type: "radio" },
    },
    hasDmBadge: { control: "boolean" },
    showPlus: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { activeTab: "home", onTabChange: () => {} },
  render: () => {
    const [activeTab, setActiveTab] = useState<BottomNavTab>("home");
    return (
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    );
  },
};

export const WithDmBadge: Story = {
  args: { activeTab: "dm", onTabChange: () => {} },
  render: () => {
    const [activeTab, setActiveTab] = useState<BottomNavTab>("dm");
    return (
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasDmBadge
      />
    );
  },
};

export const WithPlus: Story = {
  args: { activeTab: "home", onTabChange: () => {}, hasDmBadge: true },
  render: () => {
    const [activeTab, setActiveTab] = useState<BottomNavTab>("home");
    return (
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasDmBadge
        showPlus
        onPlusClick={() => {}}
      />
    );
  },
};
