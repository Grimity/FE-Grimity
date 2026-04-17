import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/common/Icon/Icon";
import GNB from "./GNB";
import IconButton from "../Button/IconButton/IconButton";

const meta = {
  title: "Common/GNB",
  component: GNB,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "main-desktop",
        "guest-desktop",
        "guest",
        "guest-menu",
        "main",
        "2dep",
        "3button",
        "search",
        "text-button",
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

export const MainDesktop: Story = {
  args: {
    variant: "main-desktop",
    hasNotification: true,
  },
};

export const GuestDesktop: Story = {
  args: {
    variant: "guest-desktop",
  },
};

export const GuestMobile: Story = {
  args: {
    variant: "guest",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const GuestMenuMobile: Story = {
  args: {
    variant: "guest-menu",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const MainMobile: Story = {
  args: {
    variant: "main",
    hasNotification: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const TwoDep: Story = {
  name: "2dep",
  args: {
    variant: "2dep",
    title: "Title",
    hasNotification: false,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const ThreeButton: Story = {
  name: "3button",
  args: {
    variant: "3button",
    title: "Title",
    rightActions: [
      <IconButton key="0" icon={<Icon name="gallery" size={24} color="gray-bold"/>} />,
      <IconButton key="1" icon={<Icon name="pen" size={24} color="gray-bold"/>} />,
      <IconButton key="2" icon={<Icon name="trash-bin-trash" size={24} color="gray-bold" />} />,
      ],
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Search: Story = {
  args: {
    variant: "search",
    searchValue: "Input filled",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const TextButton: Story = {
  args: {
    variant: "text-button",
    title: "Title",
    rightLabel: "Label",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const DM: Story = {
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
  args: {
    variant: "image-viewer",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const AllVariants: Story = {
  args: {
    variant: "main-desktop",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <GNB variant="main-desktop" hasNotification />
      <GNB variant="guest-desktop" />
      <GNB variant="guest" />
      <GNB variant="guest-menu" />
      <GNB variant="main" hasNotification />
      <GNB variant="2dep" title="Title" hasNotification />
      <GNB
        variant="3button"
        title="Title"
        rightActions={[
          <IconButton key="0" icon={<Icon name="gallery" size={24} color="gray-bold"/>} />,
          <IconButton key="1" icon={<Icon name="pen" size={24} color="gray-bold"/>} />,
          <IconButton key="2" icon={<Icon name="trash-bin-trash" size={24} color="gray-bold" />} /> 
        ]}
      />
      <GNB variant="search" searchValue="Input filled" />
      <GNB variant="text-button" title="Title" rightLabel="Label" />
      <GNB variant="dm" dmName="호두마루" dmUsername="@hodooo" />
      <GNB variant="image-viewer" />
    </div>
  ),
};
