import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import BottomSheet from "./BottomSheet";

const meta = {
  title: "Common/PopUp/BottomSheet",
  component: BottomSheet,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    buttonType: {
      options: ["primary", "secondary", "tertiary", "double", undefined],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultChildren = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      minHeight: 200,
      backgroundColor: "var(--surface-gray-subtler, #edeef0)",
    }}
  >
    <p style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Hug로 내용물 감싸기</p>
  </div>
);

export const Primary: Story = {
  args: {
    isOpen: true,
    title: "제목",
    showArrow: true,
    showCloseIcon: true,
    onBack: action("back"),
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "primary",
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};

export const Secondary: Story = {
  args: {
    isOpen: true,
    title: "제목",
    showArrow: true,
    showCloseIcon: true,
    onBack: action("back"),
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "secondary",
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const Tertiary: Story = {
  args: {
    isOpen: true,
    title: "제목",
    showArrow: true,
    showCloseIcon: true,
    onBack: action("back"),
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "tertiary",
  },
};

export const TwoButtons: Story = {
  args: {
    isOpen: true,
    title: "제목",
    showArrow: true,
    showCloseIcon: true,
    onBack: action("back"),
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "double",
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const MinimalChildren: Story = {
  args: {
    isOpen: true,
    onClose: action("close"),
    children: <p style={{ margin: 0 }}>기존 children-only 패턴 호환</p>,
  },
};

export const Exceed: Story = {
  args: {
    isOpen: true,
    title: "제목",
    showArrow: true,
    showCloseIcon: true,
    onBack: action("back"),
    onClose: action("close"),
    exceed: true,
    children: defaultChildren,
    buttonType: "primary",
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};
