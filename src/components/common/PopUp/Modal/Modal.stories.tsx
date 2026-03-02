import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";
import Icon from "@/components/common/Icon/Icon";

const meta = {
  title: "Common/PopUp/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    buttonType: {
      options: ["primary", "secondary", "tertiary", "double"],
      control: { type: "radio" },
    },
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
    title: "제목",
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "secondary",
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const Tertiary: Story = {
  args: {
    title: "제목",
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "tertiary",
  },
};

export const TwoButtons: Story = {
  args: {
    title: "제목",
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "double",
    primaryLabel: "label",
    onPrimary: action("primary"),
    secondaryLabel: "Label",
    onSecondary: action("secondary"),
  },
};

export const WithHeaderAction: Story = {
  args: {
    title: "제목",
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
        <Icon name="plus" size={24} />
      </button>
    ),
    onClose: action("close"),
    children: defaultChildren,
    buttonType: "primary",
    primaryLabel: "label",
    onPrimary: action("primary"),
  },
};
