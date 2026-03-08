import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

const meta = {
  title: "Common/Input/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    inputType: {
      options: ["textfield", "textarea"],
      control: { type: "radio" },
    },
    layout: {
      options: ["default", "horizontal"],
      control: { type: "radio" },
    },
    helperStatus: {
      options: ["default", "error", "success"],
      control: { type: "radio" },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    textFieldProps: {
      placeholder: "Placeholder",
    },
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    showEssential: true,
    textFieldProps: {
      placeholder: "Enter value",
    },
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Username",
    textFieldProps: {
      placeholder: "Enter username",
    },
    helperMessage: "Must be at least 3 characters",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    showEssential: true,
    textFieldProps: {
      placeholder: "Enter email",
      defaultValue: "invalid-email",
    },
    helperMessage: "Please enter a valid email",
    helperStatus: "error",
  },
};

export const WithSuccess: Story = {
  args: {
    label: "Nickname",
    textFieldProps: {
      placeholder: "Enter nickname",
      defaultValue: "goodname",
    },
    helperMessage: "Available!",
    helperStatus: "success",
  },
};

export const WithCount: Story = {
  args: {
    label: "Title",
    textFieldProps: {
      variant: "count",
      placeholder: "Enter title",
    },
    currentCount: 12,
    maxCount: 50,
  },
};

export const TextAreaInput: Story = {
  args: {
    label: "Description",
    inputType: "textarea",
    textAreaProps: {
      placeholder: "Enter description...",
      maxCount: 500,
    },
    helperMessage: "Max 500 characters",
  },
};

export const HorizontalWithButton: Story = {
  args: {
    label: "Tag",
    layout: "horizontal",
    textFieldProps: {
      placeholder: "Enter tag",
      size: "sm",
    },
    button: (
      <button
        type="button"
        style={{
          height: 42,
          padding: "0 16px",
          borderRadius: 8,
          border: "none",
          background: "#1a1b1e",
          color: "#fff",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Add
      </button>
    ),
  },
};
