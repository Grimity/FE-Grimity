export type AlertVariant = "illust" | "content" | "normal";
export type AlertSize = "xl" | "md";

export interface AlertProps {
  variant?: AlertVariant;
  size?: AlertSize;
  title: string;
  contentText: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}
