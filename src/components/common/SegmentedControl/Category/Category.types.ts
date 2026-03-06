import type { ButtonHTMLAttributes, ReactNode } from "react";

export type CategorySize = "lg" | "md";

export interface CategoryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: CategorySize;
  active?: boolean;
  title?: string;
  showNumber?: boolean;
  number?: string | number;
  iconOnly?: ReactNode;
  className?: string;
}
