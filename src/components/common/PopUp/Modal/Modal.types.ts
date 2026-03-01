import type { ReactNode } from "react";

export interface ModalProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  headerRightAction?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  singleButtonVariant?: "primary" | "secondary";
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}
