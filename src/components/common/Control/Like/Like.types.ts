import type { ButtonHTMLAttributes } from "react";

export type LikeVariant = "default" | "black";

export interface LikeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: LikeVariant;
  className?: string;
}
