import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import type { MentionItem } from "../MentionTextField/MentionTextField.types";

const MOCK_USERS: MentionItem[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
];

const meta = {
  title: "Common/Input/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    inputType: {
      options: ["textfield", "textarea", "mention"],
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
      placeholder: "Enter title",
    },
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

export const WithButton: Story = {
  name: "Type=button",
  args: {
    label: "Title",
    showEssential: true,
    textFieldProps: {
      placeholder: "Input filled",
    },
    helperMessage: "Helper text",
    button: <SolidButton size="large">label</SolidButton>,
  },
};

export const Community: Story = {
  name: "Type=Community",
  args: {
    textFieldProps: {
      placeholder: "댓글 입력",
      size: "sm",
    },
    button: <SolidButton size="regular">등록</SolidButton>,
  },
};

export const CommunityAnswer: Story = {
  name: "Type=CommunityAnswer",
  args: {
    inputType: "mention",
    mentionTextFieldProps: {
      placeholder: "댓글 입력",
      size: "sm",
      mentionItems: MOCK_USERS,
    },
    replyTo: { id: "u1", nickname: "user" },
    button: <SolidButton size="regular">등록</SolidButton>,
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
    button: <SolidButton size="regular">Add</SolidButton>,
  },
};
