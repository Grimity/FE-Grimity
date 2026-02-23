import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TextField from "./TextField";
import type { MentionItem, MentionTextFieldHandle, TextFieldBaseProps } from "./TextField.types";

const meta: Meta<TextFieldBaseProps> = {
  title: "Common/Input/TextField",
  component: TextField as React.ComponentType<TextFieldBaseProps>,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "count", "search", "title"],
      control: { type: "radio" },
    },
    size: {
      options: ["md", "sm"],
      control: { type: "radio" },
    },
    status: {
      options: ["default", "error", "success", "disabled"],
      control: { type: "radio" },
    },
  },
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
    placeholder: "Placeholder",
    variant: "default",
    size: "md",
  },
};

export const SmallSize: Story = {
  args: {
    placeholder: "Small field",
    size: "sm",
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "Error field",
    status: "error",
    defaultValue: "Invalid value",
  },
};

export const SuccessState: Story = {
  args: {
    placeholder: "Success field",
    status: "success",
    defaultValue: "Valid value",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled field",
    status: "disabled",
  },
};

export const WithCount: Story = {
  args: {
    variant: "count",
    placeholder: "Type something",
    currentCount: 5,
    maxCount: 20,
  },
};

export const SearchVariant: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
    );
  },
  args: {
    variant: "search",
    placeholder: "Search...",
  },
};

export const TitleVariant: Story = {
  args: {
    variant: "title",
    placeholder: "Enter title",
    defaultValue: "My Title",
    currentCount: 8,
    maxCount: 50,
  },
};

const MOCK_USERS: MentionItem[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
  { id: "u4", name: "Diana" },
];

export const MentionVariant: StoryObj = {
  render: () => {
    const ref = useRef<MentionTextFieldHandle>(null);
    const [query, setQuery] = useState<string | null>(null);

    const filtered =
      query !== null ? MOCK_USERS.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())) : [];

    return (
      <div style={{ position: "relative", width: 360 }}>
        <TextField
          variant="mention"
          ref={ref}
          placeholder="@ 를 입력해 유저를 멘션하세요"
          onMentionSearch={setQuery}
        />

        {query !== null && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            {filtered.map((user) => (
              <button
                key={user.id}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#111",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  ref.current?.insertMention(user);
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                }}
              >
                @{user.name}
              </button>
            ))}
          </div>
        )}

      </div>
    );
  },
};

export const WithMention: StoryObj = {
  render: () => {
    const ref = useRef<MentionTextFieldHandle>(null);
    const seeded = useRef(false);

    useEffect(() => {
      if (seeded.current || !ref.current) return;
      seeded.current = true;

      const el = ref.current.getElement();
      if (!el) return;

      // Seed initial text node with "@" so insertMention can find it
      el.focus();
      const textNode = document.createTextNode("안녕하세요 @");
      el.appendChild(textNode);

      // Position cursor at end of text node
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(textNode, textNode.length);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);

      // insertMention will find the "@" and replace it with the chip
      ref.current.insertMention({ id: "user-1", name: "Alice" });
    }, []);

    return (
      <TextField
        variant="mention"
        ref={ref}
        placeholder="Type @ to mention"
        onChange={() => {}}
      />
    );
  },
};
