import type { ButtonHTMLAttributes } from "react";

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}
