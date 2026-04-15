import type { Meta, StoryObj } from "@storybook/react";
import DmList from "./DmList";

const meta = {
  title: "DM/DmList",
  component: DmList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    showCheck: { control: "boolean" },
    showNew: { control: "boolean" },
    nickname: { control: "text" },
    text: { control: "text" },
    time: { control: "text" },
    count: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DmList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    nickname: "Nickname",
    text: "DM message DM message",
    time: "32분 전",
    showNew: true,
    count: 1,
  },
};

export const ActiveFalse: Story = {
  args: {
    active: false,
    nickname: "Nickname",
    text: "DM message DM message",
    time: "32분 전",
    showCheck: true,
    showNew: true,
    count: 1,
  },
};

export const ActiveTrue: Story = {
  args: {
    active: true,
    nickname: "Nickname",
    text: "DM message DM message",
    time: "32분 전",
    showCheck: true,
    showNew: true,
    count: 1,
  },
};

export const WithLongText: Story = {
  args: {
    active: false,
    nickname: "Nickname",
    text: "이 메시지는 매우 길어서 말줄임표가 표시되어야 합니다. 한 줄만 노출됩니다.",
    time: "32분 전",
    showNew: true,
    count: 99,
  },
};

export const EditMode: Story = {
  args: {
    active: false,
    nickname: "Nickname",
    text: "DM message",
    time: "32분 전",
    showCheck: true,
    showNew: false,
  },
};

export const BothStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <DmList
        active={false}
        nickname="Nickname"
        text="DM message DM massage"
        time="32분 전"
        showCheck
        showNew
        count={1}
      />
      <DmList
        active={true}
        nickname="Nickname"
        text="DM message DM massage"
        time="32분 전"
        showCheck
        showNew
        count={1}
      />
    </div>
  ),
};
