export interface MentionItem {
  id: string;
  name: string;
}

export interface MentionTextFieldHandle {
  insertMention: (mention: MentionItem) => void;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getElement: () => HTMLDivElement | null;
}

export type MentionTextFieldSize = "md" | "sm";
export type MentionTextFieldStatus = "default" | "error" | "success" | "disabled";

export interface MentionTextFieldProps {
  size?: MentionTextFieldSize;
  status?: MentionTextFieldStatus;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  className?: string;
  maxCount?: number;
  mentionItems: MentionItem[];
  onMentionSelect?: (item: MentionItem) => void;
  onChange?: (value: string, mentionIds: string[]) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}
