import type { ButtonHTMLAttributes } from "react";

export type CheckBoxSize = "medium" | "small";

export interface CheckBoxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  disabled?: boolean;
  size?: CheckBoxSize;
  className?: string;
}
