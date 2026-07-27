import type { HTMLAttributes, ReactNode } from "react";

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
