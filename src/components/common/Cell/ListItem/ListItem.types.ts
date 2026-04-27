import type { ReactNode } from "react";

export type ListItemType =
  | "section"
  | "rightIcon"
  | "optionCard"
  | "icon"
  | "pickerCard"
  | "textLg"
  | "textMd"
  | "checkBox"
  | "radio"
  | "checkMark";

export interface ListItemProps {
  type?: ListItemType;
  text?: string;
  subText?: string;
  icon?: ReactNode;
  showIcon?: boolean;
  showSubText?: boolean;
  active?: boolean;
  negative?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}
