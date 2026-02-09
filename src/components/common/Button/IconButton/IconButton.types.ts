import { ButtonBaseProps } from "../Button.types";

export type IconButtonVariant = "sm" | "normal" | "outlined" | "solid";

export interface IconButtonProps extends ButtonBaseProps {
  variant?: IconButtonVariant;
  icon: React.ReactNode;
  badge?: boolean;
}
