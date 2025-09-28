export type ButtonType =
  | "filled-primary"
  | "outlined-primary"
  | "outlined-secondary"
  | "outlined-assistive"
  | "text-primary"
  | "text-assistive"
  | "text-assistive-category";

export type ButtonSize = "l" | "m" | "s";

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  type: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  width?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
