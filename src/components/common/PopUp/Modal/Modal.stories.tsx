import { useState } from "react";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";
import Icon from "@/components/Asset/IconTemp";

const meta = {
  title: "Common/PopUp/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    showBackButton: { control: "boolean" },
    singleButtonVariant: { options: ["primary", "secondary"], control: { type: "radio" } },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultChildren = (
  <p style={{ margin: 0 }}>
    Hug로 내용물 감싸기. 사용자가 특정 작업을 수행할 때 화면에 잠깐 나타나는 작은 창으로, 크기가 큰
    스크린에서 사용합니다. Hug로 내용물 감싸기. 사용자가 특정 작업을 수행할 때 화면에 잠깐 나타나는
    작은 창으로, 크기가 큰 스크린에서 사용합니다. Hug로 내용물 감싸기. 사용자가 특정 작업을 수행할
    때 화면에 잠깐 나타나는 작은 창으로, 크기가 큰 스크린에서 사용합니다.
  </p>
);

export const Primary: Story = {
  args: {
    title: "제목",
    showBackButton: true,
    onClose: action("close"),
    children: defaultChildren,
    singleButtonVariant: "primary",
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};

export const Secondary: Story = {
  args: {
    title: "제목",
    showBackButton: false,
    onClose: action("close"),
    children: defaultChildren,
    singleButtonVariant: "secondary",
    primaryLabel: "Label",
    onPrimary: action("primary"),
  },
};

export const Tertiary: Story = {
  args: {
    title: "제목",
    showBackButton: false,
    onClose: action("close"),
    children: defaultChildren,
  },
};

export const TwoButtons: Story = {
  args: {
    title: "제목",
    showBackButton: false,
    onClose: action("close"),
    children: defaultChildren,
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const WithHeaderAction: Story = {
  args: {
    title: "제목",
    showBackButton: true,
    onBack: action("back"),
    headerRightAction: (
      <button
        type="button"
        onClick={action("header-action")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
        aria-label="헤더 액션"
      >
        <Icon icon="plus" size="2xl" />
      </button>
    ),
    onClose: action("close"),
    children: defaultChildren,
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};
