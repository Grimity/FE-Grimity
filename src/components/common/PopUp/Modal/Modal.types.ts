import type { ReactNode } from "react";

type ButtonConfig =
  | {
      buttonType: "primary";
      primaryLabel: string;
      onPrimary: () => void;
      primaryDisabled?: boolean;
    }
  | {
      buttonType: "secondary";
      secondaryLabel: string;
      onSecondary: () => void;
      secondaryDisabled?: boolean;
    }
  | { buttonType: "tertiary" }
  | {
      buttonType: "double";
      primaryLabel: string;
      onPrimary: () => void;
      primaryDisabled?: boolean;
      secondaryLabel: string;
      onSecondary: () => void;
      secondaryDisabled?: boolean;
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
