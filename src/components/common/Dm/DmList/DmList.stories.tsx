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
    checked: { control: "boolean" },
    showNew: { control: "boolean" },
    hasImage: { control: "boolean" },
    nickname: { control: "text" },
    avatarUrl: { control: "text" },
    text: { control: "text" },
    searchKeyword: { control: "text" },
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

const thirtyMinutesAgo = new Date(Date.now() - 32 * 60 * 1000);

export const Default: Story = {
  args: {
    active: false,
    nickname: "Nickname",
    text: "DM message DM message",
    date: thirtyMinutesAgo,
    showNew: true,
    count: 1,
  },
};

export const ActiveTrue: Story = {
  args: {
    active: true,
    nickname: "Nickname",
    text: "DM message DM message",
    date: thirtyMinutesAgo,
    showCheck: true,
    showNew: true,
    count: 1,
  },
};

export const WithLongText: Story = {
  args: {
    nickname: "Nickname",
    text: "이 메시지는 매우 길어서 말줄임표가 표시되어야 합니다. 한 줄만 노출됩니다.",
    date: thirtyMinutesAgo,
    showNew: true,
    count: 99,
  },
};

export const EditMode: Story = {
  args: {
    nickname: "Nickname",
    text: "DM message",
    date: thirtyMinutesAgo,
    showCheck: true,
    checked: true,
  },
};

export const ImageOnlyLastMessage: Story = {
  args: {
    nickname: "Nickname",
    hasImage: true,
    date: thirtyMinutesAgo,
    showNew: true,
    count: 2,
  },
};

export const SearchHighlight: Story = {
  args: {
    nickname: "이름으로 검색",
    text: "메시지 본문에도 검색 매칭이 적용됩니다",
    date: thirtyMinutesAgo,
    searchKeyword: "검색",
  },
};

export const LongTimeAgo: Story = {
  args: {
    nickname: "Nickname",
    text: "한 달 전 대화",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
};

export const BothStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
      <DmList
        active={false}
        nickname="Nickname"
        text="DM message DM massage"
        date={thirtyMinutesAgo}
        showCheck
        showNew
        count={1}
      />
      <DmList
        active={true}
        nickname="Nickname"
        text="DM message DM massage"
        date={thirtyMinutesAgo}
        showCheck
        checked
        showNew
        count={1}
      />
    </div>
  ),
};
