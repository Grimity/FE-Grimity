export interface TextFieldHandle {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getElement: () => HTMLInputElement | null;
}

export type TextFieldVariant = "default" | "count" | "search" | "title";
export type TextFieldSize = "md" | "sm";
export type TextFieldStatus = "default" | "error" | "success" | "disabled";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children"> {
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  status?: TextFieldStatus;
  maxCount?: number;
  onClear?: () => void;
}
