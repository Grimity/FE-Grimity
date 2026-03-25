import type { Meta, StoryObj } from "@storybook/react";

import Tag from "./Tag";

const meta = {
  title: "Common/Tag/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["md", "xs"],
    },
    active: {
      control: { type: "boolean" },
    },
    children: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Text",
    size: "md",
    active: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#888" }}>Default</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tag size="md" active>
            Text
          </Tag>
          <Tag size="md" active={false}>
            Text
          </Tag>
          <Tag size="xs" active>
            Text
          </Tag>
          <Tag size="xs" active={false}>
            Text
          </Tag>
        </div>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#888" }}>Icon</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tag size="md" active onRemove={() => {}}>
            Text
          </Tag>
          <Tag size="md" active={false} onRemove={() => {}}>
            Text
          </Tag>
          <Tag size="xs" active onRemove={() => {}}>
            Text
          </Tag>
          <Tag size="xs" active={false} onRemove={() => {}}>
            Text
          </Tag>
        </div>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#888" }}>
          Custom Icon
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tag
            size="md"
            active
            icon={<span style={{ fontSize: 12 }}>+</span>}
          >
            Text
          </Tag>
          <Tag
            size="xs"
            active
            icon={<span style={{ fontSize: 12 }}>+</span>}
          >
            Text
          </Tag>
        </div>
      </div>
    </div>
  ),
};
