export type ButtonSize = "large" | "regular" | "small";

export interface ButtonBaseProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean | "menu" | "dialog" | "listbox" | "tree" | "grid";
}
