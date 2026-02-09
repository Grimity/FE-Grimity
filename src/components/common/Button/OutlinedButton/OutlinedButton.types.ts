import { ButtonBaseProps, ButtonSize } from "../Button.types";

export interface OutlinedButtonProps extends ButtonBaseProps {
  size?: ButtonSize;
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: React.ReactNode;
}
