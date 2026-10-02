import type { ReactNode } from "react";

export interface ResponsiveMenuItem {
  label: string;
  onClick: () => void;
  selected?: boolean;
}

export interface ResponsiveMenuProps {
  trigger: ReactNode;
  items: ResponsiveMenuItem[];
  mobileTitle?: string;
  /** 모바일 바텀시트 항목 형태. option은 선택 상태가 체크로 표시되는 카드형 */
  mobileItemType?: "text" | "option";
  align?: "left" | "right";
  disabled?: boolean;
}
