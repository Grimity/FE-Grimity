import type { ButtonHTMLAttributes } from "react";

export interface RadioButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}
