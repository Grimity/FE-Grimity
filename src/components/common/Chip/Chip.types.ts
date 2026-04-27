import type { HTMLAttributes } from "react";

export type ChipVariant = "primary" | "assistive";

export type ChipSize = "xl" | "md";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
}
