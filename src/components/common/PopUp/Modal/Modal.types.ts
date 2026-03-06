import type { ReactNode } from "react";

type ButtonConfig =
  | {
      buttonType: "primary";
      primaryLabel: string;
      onPrimary: () => void;
    }
  | {
      buttonType: "secondary";
      secondaryLabel: string;
      onSecondary: () => void;
    }
  | { buttonType: "tertiary" }
  | {
      buttonType: "double";
      primaryLabel: string;
      onPrimary: () => void;
      secondaryLabel: string;
      onSecondary: () => void;
    }
  | { buttonType?: never };

export type ModalProps = ButtonConfig & {
  title: string;
  onBack?: () => void;
  headerRightAction?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};
