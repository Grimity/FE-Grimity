import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "./Sidebar";
import type { SidebarProps } from "./Sidebar.types";

function InteractiveSidebar(props: SidebarProps) {
  const [activeRoute, setActiveRoute] = useState("/");
  const [profileActiveItem, setProfileActiveItem] = useState<"liked" | "saved" | undefined>();
  return (
    <Sidebar
      {...props}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      profileActiveItem={profileActiveItem}
      onProfileLikedClick={() => setProfileActiveItem((p) => (p === "liked" ? undefined : "liked"))}
      onProfileSavedClick={() => setProfileActiveItem((p) => (p === "saved" ? undefined : "saved"))}
    />
  );
}

const userData = { username: "체리마루", avatarSrc: undefined };

const meta = {
  title: "Common/Navigation/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  render: (args: SidebarProps) => <InteractiveSidebar {...args} />,
  args: {
    onClose: () => {},
    onLoginClick: () => {},
    onLogoutClick: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: "responsive" } },
};

export const DesktopLoggedIn: Story = {
  parameters: { viewport: { defaultViewport: "responsive" } },
  args: { isLoggedIn: true, user: userData },
};

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: "tablet" } },
};

export const TabletLoggedIn: Story = {
  parameters: { viewport: { defaultViewport: "tablet" } },
  args: { isLoggedIn: true, user: userData },
};

export const MobileGuest: Story = {
  parameters: { viewport: { defaultViewport: "mobile2" } },
};

export const MobileLoggedIn: Story = {
  parameters: { viewport: { defaultViewport: "mobile2" } },
  args: { isLoggedIn: true, user: userData },
};
