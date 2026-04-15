import type { Meta, StoryObj } from "@storybook/react";
import DmInput from "./DmInput";

const meta = {
  title: "DM/DmInput",
  component: DmInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["Default", "Focused", "Filled", "Filled_log", "Disabled", "Answer"],
    },
    replyText: { control: "text" },
    replyTarget: { control: "text" },
  },
} satisfies Meta<typeof DmInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "Default",
  },
};

export const Focused: Story = {
  args: {
    type: "Focused",
  },
};

export const Filled: Story = {
  args: {
    type: "Filled",
  },
};

export const FilledLog: Story = {
  args: {
    type: "Filled_log",
  },
};

export const Disabled: Story = {
  args: {
    type: "Disabled",
  },
};

export const Answer: Story = {
  args: {
    type: "Answer",
    replyText: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요.",
    replyTarget: "상대방",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["Default", "Focused", "Filled", "Filled_log", "Disabled", "Answer"] as const).map((type) => (
        <div key={type}>
          <p style={{ fontSize: 12, color: "#70737e", marginBottom: 4 }}>State={type}</p>
          <DmInput
            type={type}
            replyText="감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요."
            replyTarget="상대방"
          />
        </div>
      ))}
    </div>
  ),
};
