export type ChipType =
  | "filled-primary"
  | "filled-secondary"
  | "filled-assistive"
  | "outlined-primary"
  | "outlined-secondary"
  | "outlined-assistive";

export type ChipSize = "m" | "s";

export interface ChipProps {
  children: React.ReactNode;
  type: ChipType;
  size: ChipSize;
  unselected?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
