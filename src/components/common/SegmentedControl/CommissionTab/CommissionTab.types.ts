import { ButtonHTMLAttributes } from "react";

export type CommissionTabSize = "lg" | "md" | "sm";

export interface CommissionTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: CommissionTabSize;
  active?: boolean;
  title: string;
  className?: string;
}
