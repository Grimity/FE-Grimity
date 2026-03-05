import type { ReactNode } from "react";
import type { IconName } from "@/components/common/Icon/Icon.types";

export type EmptySize = "xl" | "md";

export type EmptyButtonVariant = "solid" | "outline";

export interface EmptyProps {
  size?: EmptySize;
  icon?: ReactNode;
  iconName?: IconName;
  title: string;
  content?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonVariant?: EmptyButtonVariant;
  className?: string;
}
