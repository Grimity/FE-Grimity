import type { ReactNode } from "react";

export interface ResponsiveMenuItem {
  label: string;
  onClick: () => void;
  selected?: boolean;
}

export interface ResponsiveMenuProps {
  trigger: ReactNode;
  items: ResponsiveMenuItem[];
  mobileTitle?: string;
  align?: "left" | "right";
}
