import type { HTMLAttributes, ReactNode } from "react";

export type TagSize = "md" | "xs";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  size?: TagSize;
  active?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  className?: string;
}
