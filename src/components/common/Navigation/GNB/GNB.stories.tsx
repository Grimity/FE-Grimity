import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/common/Icon/Icon";
import GNB from "./GNB";
import IconButton from "@/components/common/Button/IconButton/IconButton";

const meta = {
  title: "Common/Navigation/GNB",
  component: GNB,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "pc-main",
        "pc-guest",
        "guest",
        "guest-menu",
        "main",
        "depth-2",
        "three-button",
        "search",
        "text-button",
        "editor",
        "dm",
        "image-viewer",
      ],
      control: { type: "select" },
    },
    hasNotification: { control: "boolean" },
    title: { control: "text" },
    rightLabel: { control: "text" },
    dmName: { control: "text" },
    dmUsername: { control: "text" },
  },
} satisfies Meta<typeof GNB>;

export default meta;
type Story = StoryObj<typeof meta>;

/** PC · 로그인 메인 */
export const PcMain: Story = {
  name: "PC · Main",
  args: {
    variant: "pc-main",
    hasNotification: true,
  },
};

/** PC · 게스트 */
export const PcGuest: Story = {
  name: "PC · Guest",
  args: {
    variant: "pc-guest",
  },
};

export const GuestMobile: Story = {
  name: "Mobile · Guest",
  args: {
    variant: "guest",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const GuestMenuMobile: Story = {
  name: "Mobile · Guest_Menu",
  args: {
    variant: "guest-menu",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const MainMobile: Story = {
  name: "Mobile · Main",
  args: {
    variant: "main",
    hasNotification: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/** 모바일 Top Navigation · depth-2 */
export const TwoDepMobile: Story = {
  name: "Mobile · depth-2",
  args: {
    variant: "depth-2",
    title: "Title",
    hasNotification: false,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/** 모바일 · three-button */
export const ThreeButtonMobile: Story = {
  name: "Mobile · three-button",
  args: {
    variant: "three-button",
    title: "three-button",
    rightActions: [
      <IconButton key="0" icon={<Icon name="gallery" size={24} color="gray-bold" />} />,
      <IconButton key="1" icon={<Icon name="pen" size={24} color="gray-bold" />} />,
      <IconButton key="2" icon={<Icon name="trash-bin-trash" size={24} color="gray-bold" />} />,
    ],
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Search: Story = {
  name: "Mobile · Search",
  args: {
    variant: "search",
    searchValue: "Input filled",
    searchPlaceholder: "Input filled",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const TextButton: Story = {
  name: "Mobile · TextButton",
  args: {
    variant: "text-button",
    title: "Title",
    rightLabel: "Label",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/** 모바일 · Editor */
export const Editor: Story = {
  name: "Mobile · Editor",
  args: {
    variant: "editor",
    title: "Title",
    rightLabel: "Label",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const DM: Story = {
  name: "Mobile · DM",
  args: {
    variant: "dm",
    dmName: "호두마루",
    dmUsername: "@hodooo",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const ImageViewer: Story = {
  name: "Mobile · ImageViewer",
  args: {
    variant: "image-viewer",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const AllVariants: Story = {
  args: {
    variant: "pc-main",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <GNB variant="pc-main" hasNotification />
      <GNB variant="pc-guest" />
      <GNB variant="guest" />
      <GNB variant="guest-menu" />
      <GNB variant="main" hasNotification />
      <GNB variant="depth-2" title="Title" hasNotification />
      <GNB
        variant="three-button"
        title="Title"
        rightActions={[
          <IconButton key="0" icon={<Icon name="gallery" size={24} color="gray-bold" />} />,
          <IconButton key="1" icon={<Icon name="pen" size={24} color="gray-bold" />} />,
          <IconButton key="2" icon={<Icon name="trash-bin-trash" size={24} color="gray-bold" />} />,
        ]}
      />
      <GNB variant="search" searchValue="Input filled" searchPlaceholder="Input filled" />
      <GNB variant="text-button" title="Title" rightLabel="Label" />
      <GNB variant="editor" title="Title" rightLabel="Label" />
      <GNB variant="dm" dmName="호두마루" dmUsername="@hodooo" />
      <GNB variant="image-viewer" />
    </div>
  ),
};
