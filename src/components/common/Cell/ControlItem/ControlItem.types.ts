import type { HTMLAttributes } from "react";

export type ControlItemVariant = "bold" | "normal";
export type ControlItemType = "toggle" | "checkBox" | "radio" | "checkMark";

export interface ControlItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  variant?: ControlItemVariant;
  type?: ControlItemType;
  text?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}
