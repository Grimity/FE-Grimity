import { ButtonHTMLAttributes } from "react";

export type TabSize = "sm" | "md" | "lg";

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: TabSize;
  active?: boolean;
  title: string;
  showNumber?: boolean;
  number?: string | number;
  className?: string;
}
