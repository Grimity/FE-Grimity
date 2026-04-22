import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TextField from "./TextField";
import type { TextFieldHandle, TextFieldProps } from "./TextField.types";

const meta: Meta<TextFieldProps> = {
  title: "Common/Input/TextField",
  component: TextField,
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
    maxCount: 20,
  },
};

function SearchRenderer() {
  const ref = useRef<TextFieldHandle>(null);

  return (
    <TextField
      ref={ref}
      variant="search"
      placeholder="Search..."
      onClear={() => ref.current?.clear()}
    />
  );
}

export const SearchVariant: Story = {
  render: () => <SearchRenderer />,
};

export const TitleVariant: Story = {
  args: {
    variant: "title",
    placeholder: "Enter title",
    defaultValue: "My Title",
    maxCount: 50,
  },
};
