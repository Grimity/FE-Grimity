export type TextAreaVariant = "default" | "underline" | "text" | "sm";
export type TextAreaStatus = "default" | "error" | "disabled";

export interface TextAreaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "children"
  > {
  variant?: TextAreaVariant;
  status?: TextAreaStatus;
  currentCount?: number;
  maxCount?: number;
  autoResize?: boolean;
  className?: string;
}
