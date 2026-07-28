export interface MenuItem {
  label: string;
  onClick?: () => void;
  borderBottom?: boolean;
  selected?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  /**
   * 커스텀 드롭다운 본문. 제공되면 기본 `items` 리스트 대신 이 내용이 렌더된다.
   */
  content?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  wrapperClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}
