export interface MentionItem {
  id: string;
  name: string;
}

export interface MentionTextFieldHandle {
  insertMention: (mention: MentionItem) => void;
  focus: () => void;
  getElement: () => HTMLDivElement | null;
}

export type TextFieldVariant = "default" | "count" | "search" | "title" | "mention";
export type TextFieldSize = "md" | "sm";
export type TextFieldStatus = "default" | "error" | "success" | "disabled";

export type TextFieldRef = HTMLInputElement | MentionTextFieldHandle;

interface TextFieldMentionProps {
  variant: "mention";
  placeholder?: string;
  disabled?: boolean;
  status?: TextFieldStatus;
  size?: TextFieldSize;
  className?: string;
  onMentionSearch?: (query: string | null) => void;
  onChange?: (value: string, mentionIds: string[]) => void;
}

export interface TextFieldBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: Exclude<TextFieldVariant, "mention">;
  size?: TextFieldSize;
  status?: TextFieldStatus;
  currentCount?: number;
  maxCount?: number;
  onClear?: () => void;
  className?: string;
}

export type TextFieldProps = TextFieldMentionProps | TextFieldBaseProps;
