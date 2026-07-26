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

export type BottomSheetProps = ButtonConfig & {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showArrow?: boolean;
  showCloseIcon?: boolean;
  onBack?: () => void;
  exceed?: boolean;
  className?: string;
};
