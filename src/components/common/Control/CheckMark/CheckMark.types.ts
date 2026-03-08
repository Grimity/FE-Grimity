import type { ButtonHTMLAttributes } from "react";

export interface CheckMarkProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}
