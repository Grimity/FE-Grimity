export type AlertVariant = "illust" | "content" | "normal";
export type AlertSize = "xl" | "md";

export interface AlertProps {
  variant?: AlertVariant;
  size?: AlertSize;
  title: string;
  contentText: string;
  primaryLabel: string;
  onPrimary: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryDisabled?: boolean;
  className?: string;
}
