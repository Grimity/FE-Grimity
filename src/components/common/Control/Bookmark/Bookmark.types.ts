import type { ButtonHTMLAttributes } from "react";

export type BookmarkVariant = "default" | "black";

export interface BookmarkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: BookmarkVariant;
  className?: string;
}
