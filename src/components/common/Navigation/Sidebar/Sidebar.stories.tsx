import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "./Sidebar";
import type { SidebarActiveItem, SidebarProps } from "./Sidebar.types";

const meta = {
  title: "Common/Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["lg", "md"],
      control: { type: "radio" },
    },
    activeItem: {
      options: [undefined, "liked", "saved"],
      control: { type: "radio" },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "60vh", background: "gray", padding: 32, display: "flex", gap: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  username: "체리마루",
  handle: "CherryMaru",
  followerCount: 123,
  followingCount: 32,
  onLogoutClick: () => {},
  onTermsClick: () => {},
  onPrivacyClick: () => {},
  onBusinessClick: () => {},
};

type SidebarStoryProps = SidebarProps;

function SidebarStory({ size = "lg", activeItem: initialActiveItem, ...rest }: SidebarStoryProps) {
  const [activeItem, setActiveItem] = useState<SidebarActiveItem | undefined>(initialActiveItem);
  useEffect(() => {
    setActiveItem(initialActiveItem);
  }, [initialActiveItem]);

  return (
    <Sidebar
      {...rest}
      size={size}
      activeItem={activeItem}
      onLikedClick={() => setActiveItem("liked")}
      onSavedClick={() => setActiveItem("saved")}
    />
  );
}

export const Default: Story = {
  args: { ...defaultArgs, size: "lg", activeItem: undefined },
  render: (args) => <SidebarStory {...args} />,
};

export const Medium: Story = {
  args: { ...defaultArgs, size: "md", activeItem: undefined },
  render: (args) => <SidebarStory {...args} />,
};

export const LikedActive: Story = {
  args: { ...defaultArgs, size: "lg", activeItem: "liked" },
  render: (args) => <SidebarStory {...args} />,
};

export const SavedActive: Story = {
  args: { ...defaultArgs, size: "lg", activeItem: "saved" },
  render: (args) => <SidebarStory {...args} />,
};
