import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Filter from "./Filter";

const SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "좋아요순", value: "popular" },
];

const TITLE_OPTIONS = [
  { label: "제목", value: "title" },
  { label: "작성자", value: "author" },
  { label: "내용", value: "content" },
];

const meta = {
  title: "Common/Filter",
  component: Filter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
  argTypes: {
    variant: {
      options: ["outline", "text"],
      control: { type: "radio" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  args: {
    variant: "outline",
    options: TITLE_OPTIONS,
    value: "title",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

export const OutlineDisabled: Story = {
  args: {
    variant: "outline",
    options: TITLE_OPTIONS,
    value: "title",
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    options: SORT_OPTIONS,
    value: "latest",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

export const TextDisabled: Story = {
  args: {
    variant: "text",
    options: SORT_OPTIONS,
    value: "latest",
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Filter {...args} value={value} onChange={setValue} />;
  },
};

// renderDropdown이 주어지면 기본 옵션 리스트 대신 임의의 커스텀 본문을 드롭다운에 렌더한다.
export const CustomDropdown: Story = {
  args: {
    variant: "outline",
    options: TITLE_OPTIONS,
    value: "title",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <Filter
        {...args}
        value={value}
        onChange={setValue}
        renderDropdown={(close) => (
          <div
            style={{
              width: 200,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "var(--surface-base)",
              borderRadius: 12,
              boxShadow: "0 0 12px rgba(0,0,0,0.15)",
            }}
          >
            {TITLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setValue(option.value);
                  close();
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      />
    );
  },
};
