export interface DmListProps {
  active?: boolean;
  nickname?: string;
  avatarUrl?: string;
  showCheck?: boolean;
  checked?: boolean;
  text?: string;
  hasImage?: boolean;
  date?: Date | string;
  searchKeyword?: string;
  showNew?: boolean;
  count?: number;
  onCheck?: (checked: boolean) => void;
  onClick?: () => void;
  className?: string;
}
