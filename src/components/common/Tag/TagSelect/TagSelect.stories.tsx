import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import TagSelect from "./TagSelect";

const noop = () => {};

const meta = {
  title: "Common/Tag/TagSelect",
  component: TagSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onAddTag: noop,
    onRemoveTag: noop,
  },
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["md", "xs"],
    },
    maxTags: {
      control: { type: "number" },
    },
    placeholder: {
      control: { type: "text" },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 370 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tags: [],
    size: "md",
    placeholder: "태그 추가",
  },
  render: function Render(args) {
    const [tags, setTags] = useState<string[]>(args.tags);
    return (
      <TagSelect
        {...args}
        tags={tags}
        onAddTag={(tag) => setTags((prev) => [...prev, tag])}
        onRemoveTag={(index) =>
          setTags((prev) => prev.filter((_, i) => i !== index))
        }
      />
    );
  },
};

export const Filled: Story = {
  args: {
    tags: ["태그", "태그", "태그"],
    size: "md",
  },
  render: function Render(args) {
    const [tags, setTags] = useState<string[]>(args.tags);
    return (
      <TagSelect
        {...args}
        tags={tags}
        onAddTag={(tag) => setTags((prev) => [...prev, tag])}
        onRemoveTag={(index) =>
          setTags((prev) => prev.filter((_, i) => i !== index))
        }
      />
    );
  },
};

export const Full: Story = {
  args: {
    tags: [
      "태그",
      "태그",
      "태그",
      "태그",
      "태그",
      "태그",
      "태그",
      "태그",
      "태그",
      "태그",
    ],
    size: "md",
    maxTags: 10,
  },
  render: function Render(args) {
    const [tags, setTags] = useState<string[]>(args.tags);
    return (
      <TagSelect
        {...args}
        tags={tags}
        onAddTag={(tag) => setTags((prev) => [...prev, tag])}
        onRemoveTag={(index) =>
          setTags((prev) => prev.filter((_, i) => i !== index))
        }
      />
    );
  },
};

export const Sizes: Story = {
  args: {
    tags: ["태그", "태그", "태그"],
    size: "md",
  },
  render: function Render() {
    const [mdTags, setMdTags] = useState(["태그", "태그", "태그"]);
    const [xsTags, setXsTags] = useState(["태그", "태그", "태그"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <p style={{ marginBottom: 8, fontSize: 14, color: "#888" }}>
            Size: md
          </p>
          <TagSelect
            size="md"
            tags={mdTags}
            onAddTag={(tag) => setMdTags((prev) => [...prev, tag])}
            onRemoveTag={(index) =>
              setMdTags((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>
        <div>
          <p style={{ marginBottom: 8, fontSize: 14, color: "#888" }}>
            Size: xs
          </p>
          <TagSelect
            size="xs"
            tags={xsTags}
            onAddTag={(tag) => setXsTags((prev) => [...prev, tag])}
            onRemoveTag={(index) =>
              setXsTags((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>
      </div>
    );
  },
};
