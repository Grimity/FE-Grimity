import type { ButtonHTMLAttributes } from "react";

export type HeartVariant = "default" | "black";

export interface HeartProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: HeartVariant;
  className?: string;
}
