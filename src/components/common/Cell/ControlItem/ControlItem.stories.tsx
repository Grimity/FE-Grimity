import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ControlItem from "./ControlItem";

const meta = {
  title: "Common/Cell/ControlItem",
  component: ControlItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["bold", "normal"],
      control: { type: "radio" },
    },
    type: {
      options: ["toggle", "checkBox", "radio", "checkMark"],
      control: { type: "radio" },
    },
    text: {
      control: { type: "text" },
    },
    active: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof ControlItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "normal",
    type: "toggle",
    text: "Label",
    active: false,
    disabled: false,
  },
};

export const BoldToggle: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="bold" type="toggle" text="Toggle Off" />
      <ControlItem variant="bold" type="toggle" text="Toggle On" active />
      <ControlItem
        variant="bold"
        type="toggle"
        text="Toggle Disabled"
        disabled
      />
      <ControlItem
        variant="bold"
        type="toggle"
        text="Toggle On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const NormalToggle: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="normal" type="toggle" text="Toggle Off" />
      <ControlItem variant="normal" type="toggle" text="Toggle On" active />
      <ControlItem
        variant="normal"
        type="toggle"
        text="Toggle Disabled"
        disabled
      />
      <ControlItem
        variant="normal"
        type="toggle"
        text="Toggle On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const BoldCheckBox: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="bold" type="checkBox" text="CheckBox Off" />
      <ControlItem variant="bold" type="checkBox" text="CheckBox On" active />
      <ControlItem
        variant="bold"
        type="checkBox"
        text="CheckBox Disabled"
        disabled
      />
      <ControlItem
        variant="bold"
        type="checkBox"
        text="CheckBox On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const NormalCheckBox: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="normal" type="checkBox" text="CheckBox Off" />
      <ControlItem
        variant="normal"
        type="checkBox"
        text="CheckBox On"
        active
      />
      <ControlItem
        variant="normal"
        type="checkBox"
        text="CheckBox Disabled"
        disabled
      />
      <ControlItem
        variant="normal"
        type="checkBox"
        text="CheckBox On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const BoldRadio: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="bold" type="radio" text="Radio Off" />
      <ControlItem variant="bold" type="radio" text="Radio On" active />
      <ControlItem
        variant="bold"
        type="radio"
        text="Radio Disabled"
        disabled
      />
      <ControlItem
        variant="bold"
        type="radio"
        text="Radio On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const NormalRadio: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="normal" type="radio" text="Radio Off" />
      <ControlItem variant="normal" type="radio" text="Radio On" active />
      <ControlItem
        variant="normal"
        type="radio"
        text="Radio Disabled"
        disabled
      />
      <ControlItem
        variant="normal"
        type="radio"
        text="Radio On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const BoldCheckMark: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="bold" type="checkMark" text="CheckMark Off" />
      <ControlItem variant="bold" type="checkMark" text="CheckMark On" active />
      <ControlItem
        variant="bold"
        type="checkMark"
        text="CheckMark Disabled"
        disabled
      />
      <ControlItem
        variant="bold"
        type="checkMark"
        text="CheckMark On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const NormalCheckMark: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="normal" type="checkMark" text="CheckMark Off" />
      <ControlItem
        variant="normal"
        type="checkMark"
        text="CheckMark On"
        active
      />
      <ControlItem
        variant="normal"
        type="checkMark"
        text="CheckMark Disabled"
        disabled
      />
      <ControlItem
        variant="normal"
        type="checkMark"
        text="CheckMark On Disabled"
        active
        disabled
      />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <ControlItem variant="bold" type="toggle" text="Toggle" active />
      <ControlItem variant="bold" type="checkBox" text="CheckBox" active />
      <ControlItem variant="bold" type="radio" text="Radio" active />
      <ControlItem variant="bold" type="checkMark" text="CheckMark" active />
    </div>
  ),
};

// ============================================
// Playground (Interactive)
// ============================================

function ControlItemPlayground() {
  const [toggle, setToggle] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [radio, setRadio] = useState(false);
  const [checkMark, setCheckMark] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 320 }}>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
          Bold 스타일
        </p>
        <ControlItem
          variant="bold"
          type="toggle"
          text="알림 수신"
          active={toggle}
          onClick={() => setToggle((v) => !v)}
        />
        <ControlItem
          variant="bold"
          type="checkBox"
          text="이용약관 동의"
          active={checkBox}
          onClick={() => setCheckBox((v) => !v)}
        />
        <ControlItem
          variant="bold"
          type="radio"
          text="공개 설정"
          active={radio}
          onClick={() => setRadio((v) => !v)}
        />
        <ControlItem
          variant="bold"
          type="checkMark"
          text="자동 저장"
          active={checkMark}
          onClick={() => setCheckMark((v) => !v)}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
          Normal 스타일
        </p>
        <ControlItem
          variant="normal"
          type="toggle"
          text="다크 모드"
          active={toggle}
          onClick={() => setToggle((v) => !v)}
        />
        <ControlItem
          variant="normal"
          type="checkBox"
          text="마케팅 수신"
          active={checkBox}
          onClick={() => setCheckBox((v) => !v)}
        />
        <ControlItem
          variant="normal"
          type="radio"
          text="비공개"
          active={radio}
          onClick={() => setRadio((v) => !v)}
        />
        <ControlItem
          variant="normal"
          type="checkMark"
          text="읽음 표시"
          active={checkMark}
          onClick={() => setCheckMark((v) => !v)}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
          Disabled 상태
        </p>
        <ControlItem variant="bold" type="toggle" text="비활성 Toggle" disabled />
        <ControlItem
          variant="bold"
          type="checkBox"
          text="비활성 CheckBox"
          active
          disabled
        />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <ControlItemPlayground />,
};
