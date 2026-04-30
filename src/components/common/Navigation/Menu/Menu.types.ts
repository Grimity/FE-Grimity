export interface MenuItem {
  label: string;
  onClick?: () => void;
  /** 아이템 하단에 구분선 표시 여부 */
  borderBottom?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}
