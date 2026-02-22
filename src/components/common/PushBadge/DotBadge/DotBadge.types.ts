export type DotBadgeSize = "xSmall" | "small" | "medium";
export type DotBadgePosition = "topRight" | "topLeft" | "bottomRight" | "bottomLeft";

export interface DotBadgeProps {
  size?: DotBadgeSize;
  position?: DotBadgePosition;
  children: React.ReactNode;
  className?: string;
}
