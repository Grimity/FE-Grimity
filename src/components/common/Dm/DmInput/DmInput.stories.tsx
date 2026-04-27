import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import DmInput from "./DmInput";
import type { DmInputAttachedImage } from "./DmInput.types";

const meta = {
  title: "DM/DmInput",
  component: DmInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    isSending: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DmInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    placeholder: "메시지 입력",
  },
};

export const Filled: Story = {
  args: {
    value: "아 네! ㅎㅎ 감사합니다",
  },
};

export const FilledLong: Story = {
  args: {
    value: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요. 감사합니다.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Reply: Story = {
  args: {
    value: "넵!ㅎㅎ",
    replyTo: {
      target: "상대방",
      text: "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요.",
    },
  },
};

export const WithImages: Story = {
  render: () => {
    const Wrapper = () => {
      const [value, setValue] = useState("이미지 첨부 테스트");
      const [images, setImages] = useState<DmInputAttachedImage[]>([
        { fileName: "a.png", fullUrl: "https://placehold.co/90" },
        { fileName: "b.png", fullUrl: "https://placehold.co/90/EDEEF0/35373C" },
        { fileName: "c.png", fullUrl: "https://placehold.co/90/FFE6E6/FF0000" },
      ]);
      return (
        <DmInput
          value={value}
          onChange={setValue}
          images={images}
          onRemoveImage={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
        />
      );
    };
    return <Wrapper />;
  },
};

export const Controlled: Story = {
  render: () => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      const [log, setLog] = useState<string[]>([]);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DmInput
            value={value}
            onChange={setValue}
            onSend={() => {
              if (!value.trim()) return;
              setLog((l) => [...l, value]);
              setValue("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!value.trim()) return;
                setLog((l) => [...l, value]);
                setValue("");
              }
            }}
          />
          <ul style={{ fontSize: 12, color: "#70737e" }}>
            {log.map((msg, i) => (
              <li key={i}>• {msg}</li>
            ))}
          </ul>
        </div>
      );
    };
    return <Wrapper />;
  },
};
