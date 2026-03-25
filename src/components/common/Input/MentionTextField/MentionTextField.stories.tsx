import type { Meta, StoryObj } from "@storybook/react";

import MentionTextField from "./MentionTextField";
import type { MentionItem, MentionTextFieldProps } from "./MentionTextField.types";

const MOCK_USERS: MentionItem[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
  { id: "u4", name: "Diana" },
];

const meta: Meta<MentionTextFieldProps> = {
  title: "Common/Input/MentionTextField",
  component: MentionTextField,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["md", "sm"],
      control: { type: "radio" },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mentionItems: MOCK_USERS,
    placeholder: "@ 를 입력해 유저를 멘션하세요",
  },
};

export const SmallSize: Story = {
  args: {
    mentionItems: MOCK_USERS,
    placeholder: "@ 를 입력해 유저를 멘션하세요",
    size: "sm",
  },
};

export const WithOnChange: Story = {
  render: () => (
    <MentionTextField
      mentionItems={MOCK_USERS}
      placeholder="댓글을 입력하세요"
      onChange={(text, mentionIds) => {
        console.log("text:", text, "mentionIds:", mentionIds);
      }}
      onMentionSelect={(item) => {
        console.log("selected:", item);
      }}
    />
  ),
};

export const WithMaxCount: Story = {
  args: {
    mentionItems: MOCK_USERS,
    placeholder: "최대 50자",
    maxCount: 50,
  },
};
