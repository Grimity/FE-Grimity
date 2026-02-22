export type DividerSize = "normal" | "bold" | "vertical";
export type DividerVariant = "brand" | "primary" | "secondary";

export interface DividerProps {
  size?: DividerSize;
  variant?: DividerVariant;
  className?: string;
}
