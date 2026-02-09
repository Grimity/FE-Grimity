import { ButtonBaseProps, ButtonSize } from "../Button.types";

export type TextButtonVariant = "primary" | "assistive";

export interface TextButtonProps extends ButtonBaseProps {
  variant?: TextButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}
