export type NumberBadgeVariant = "solid" | "outline" | "text";

export interface NumberBadgeProps {
  count: number;
  variant?: NumberBadgeVariant;
  className?: string;
}
