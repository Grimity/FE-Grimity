import type { ReactNode } from "react";

import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";

export type ActionMenuDisplayMode = "menu" | "bottomSheet";

export interface ActionMenuProps {
  items: MenuItem[];
  /** 메뉴를 여는 트리거. open 토글은 호출하는 쪽에서 처리한다. */
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `menu` 모드에서 드롭다운 정렬 방향 */
  align?: "left" | "right";
  /** `menu`는 드롭다운, `bottomSheet`는 하단 시트로 노출 */
  displayMode?: ActionMenuDisplayMode;
  className?: string;
}
