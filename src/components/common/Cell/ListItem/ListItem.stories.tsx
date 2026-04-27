import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/common/Icon/Icon";
import ListItem from "./ListItem";

const meta = {
  title: "Common/Cell/ListItem",
  component: ListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: [
        "section",
        "rightIcon",
        "optionCard",
        "icon",
        "pickerCard",
        "textLg",
        "textMd",
        "checkBox",
        "radio",
        "checkMark",
      ],
      control: { type: "select" },
    },
    text: { control: { type: "text" } },
    subText: { control: { type: "text" } },
    showIcon: { control: { type: "boolean" } },
    showSubText: { control: { type: "boolean" } },
    active: { control: { type: "boolean" } },
    negative: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Default
// ============================================

export const Default: Story = {
  args: {
    type: "textLg",
    text: "List Item",
    active: false,
    disabled: false,
  },
};

// ============================================
// Section
// ============================================

export const Section: Story = {
  args: {
    type: "section",
    text: "Section Header",
  },
};

// ============================================
// RightIcon
// ============================================

export const RightIcon: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem type="rightIcon" text="Menu Item" />
      <ListItem type="rightIcon" text="With SubText" subText="Detail" />
      <ListItem
        type="rightIcon"
        text="SubText Hidden"
        subText="Detail"
        showSubText={false}
      />
      <ListItem type="rightIcon" text="Disabled" disabled />
    </div>
  ),
};

// ============================================
// OptionCard
// ============================================

export const OptionCard: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <ListItem type="optionCard" text="Option A" />
      <ListItem
        type="optionCard"
        text="With Icon"
        icon={<Icon name="gallery" size={24} />}
      />
      <ListItem type="optionCard" text="Active Option" active />
      <ListItem
        type="optionCard"
        text="Active With Icon"
        icon={<Icon name="gallery" size={24} />}
        active
      />
      <ListItem type="optionCard" text="Disabled" disabled />
      <ListItem
        type="optionCard"
        text="Icon Hidden"
        icon={<Icon name="gallery" size={24} />}
        showIcon={false}
      />
    </div>
  ),
};

// ============================================
// Icon type
// ============================================

export const IconType: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem
        type="icon"
        text="Icon Item"
        icon={<Icon name="settings" size={24} />}
      />
      <ListItem
        type="icon"
        text="Active"
        icon={<Icon name="settings" size={24} />}
        active
      />
      <ListItem
        type="icon"
        text="Disabled"
        icon={<Icon name="settings" size={24} />}
        disabled
      />
      <ListItem
        type="icon"
        text="No Icon"
        icon={<Icon name="settings" size={24} />}
        showIcon={false}
      />
    </div>
  ),
};

// ============================================
// PickerCard
// ============================================

export const PickerCard: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <ListItem type="pickerCard" text="Mon" />
      <ListItem type="pickerCard" text="Tue" active />
      <ListItem type="pickerCard" text="Wed" />
      <ListItem type="pickerCard" text="Thu" disabled />
    </div>
  ),
};

// ============================================
// TextLg
// ============================================

export const TextLg: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem type="textLg" text="Text Large" />
      <ListItem type="textLg" text="Active" active />
      <ListItem type="textLg" text="Negative" negative />
      <ListItem type="textLg" text="Disabled" disabled />
    </div>
  ),
};

// ============================================
// TextMd
// ============================================

export const TextMd: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem type="textMd" text="Text Medium" />
      <ListItem type="textMd" text="Active" active />
      <ListItem type="textMd" text="Negative" negative />
      <ListItem type="textMd" text="Disabled" disabled />
    </div>
  ),
};

// ============================================
// CheckBox
// ============================================

export const CheckBoxType: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem type="checkBox" text="CheckBox Item" />
      <ListItem type="checkBox" text="Active" active />
      <ListItem type="checkBox" text="Disabled" disabled />
      <ListItem type="checkBox" text="Active Disabled" active disabled />
    </div>
  ),
};

// ============================================
// Radio
// ============================================

export const RadioType: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem type="radio" text="Radio Item" />
      <ListItem type="radio" text="Selected" active />
      <ListItem type="radio" text="Disabled" disabled />
      <ListItem type="radio" text="Selected Disabled" active disabled />
    </div>
  ),
};

// ============================================
// CheckMark
// ============================================

export const CheckMarkType: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ListItem type="checkMark" text="CheckMark Item" />
      <ListItem type="checkMark" text="Checked" active />
      <ListItem type="checkMark" text="Disabled" disabled />
      <ListItem type="checkMark" text="Checked Disabled" active disabled />
    </div>
  ),
};

// ============================================
// All Types Overview
// ============================================

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <ListItem type="section" text="Section Header" />
      <ListItem type="rightIcon" text="Right Icon" subText="Detail" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ListItem
          type="optionCard"
          text="Option Card"
          icon={<Icon name="gallery" size={24} />}
        />
        <ListItem
          type="optionCard"
          text="Option Active"
          icon={<Icon name="gallery" size={24} />}
          active
        />
      </div>
      <ListItem
        type="icon"
        text="Icon Type"
        icon={<Icon name="settings" size={24} />}
      />
      <div style={{ display: "flex", gap: 8, padding: "8px 0" }}>
        <ListItem type="pickerCard" text="Mon" />
        <ListItem type="pickerCard" text="Tue" active />
      </div>
      <ListItem type="textLg" text="Text Large" />
      <ListItem type="textMd" text="Text Medium" />
      <ListItem type="checkBox" text="CheckBox" active />
      <ListItem type="radio" text="Radio" active />
      <ListItem type="checkMark" text="CheckMark" active />
    </div>
  ),
};

// ============================================
// Playground (Interactive)
// ============================================

function OptionCardPlayground() {
  const [selected, setSelected] = useState(0);
  const options = ["갤러리", "일러스트", "사진", "디자인"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
        OptionCard — 클릭하여 선택
      </p>
      {options.map((option, i) => (
        <ListItem
          key={option}
          type="optionCard"
          text={option}
          icon={<Icon name="gallery" size={24} />}
          active={selected === i}
          onClick={() => setSelected(i)}
        />
      ))}
    </div>
  );
}

function PickerCardPlayground() {
  const [selected, setSelected] = useState<Set<number>>(new Set([1]));
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
        PickerCard — 다중 선택
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {days.map((day, i) => (
          <ListItem
            key={day}
            type="pickerCard"
            text={day}
            active={selected.has(i)}
            onClick={() => toggle(i)}
          />
        ))}
      </div>
    </div>
  );
}

function TextPlayground() {
  const [activeLg, setActiveLg] = useState<number | null>(null);
  const [activeMd, setActiveMd] = useState<number | null>(null);
  const lgItems = ["최신순", "인기순", "댓글순"];
  const mdItems = ["전체", "팔로잉", "추천"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#888" }}>
          TextLg — 단일 선택
        </p>
        {lgItems.map((item, i) => (
          <ListItem
            key={item}
            type="textLg"
            text={item}
            active={activeLg === i}
            onClick={() => setActiveLg(i)}
          />
        ))}
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#888" }}>
          TextMd — 단일 선택
        </p>
        {mdItems.map((item, i) => (
          <ListItem
            key={item}
            type="textMd"
            text={item}
            active={activeMd === i}
            onClick={() => setActiveMd(i)}
          />
        ))}
      </div>
    </div>
  );
}

function ControlPlayground() {
  const [checks, setChecks] = useState<Set<number>>(new Set());
  const [radioIdx, setRadioIdx] = useState<number | null>(null);
  const [marks, setMarks] = useState<Set<number>>(new Set());

  const checkItems = ["이용약관 동의", "개인정보 수집 동의", "마케팅 수신 동의"];
  const radioItems = ["공개", "팔로워만", "비공개"];
  const markItems = ["알림 받기", "자동 저장", "다크 모드"];

  const toggleCheck = (i: number) => {
    setChecks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleMark = (i: number) => {
    setMarks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#888" }}>
          CheckBox — 다중 선택
        </p>
        {checkItems.map((item, i) => (
          <ListItem
            key={item}
            type="checkBox"
            text={item}
            active={checks.has(i)}
            onClick={() => toggleCheck(i)}
          />
        ))}
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#888" }}>
          Radio — 단일 선택
        </p>
        {radioItems.map((item, i) => (
          <ListItem
            key={item}
            type="radio"
            text={item}
            active={radioIdx === i}
            onClick={() => setRadioIdx(i)}
          />
        ))}
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#888" }}>
          CheckMark — 다중 선택
        </p>
        {markItems.map((item, i) => (
          <ListItem
            key={item}
            type="checkMark"
            text={item}
            active={marks.has(i)}
            onClick={() => toggleMark(i)}
          />
        ))}
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <OptionCardPlayground />
      <PickerCardPlayground />
      <TextPlayground />
      <ControlPlayground />
    </div>
  ),
};
