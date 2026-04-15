export interface DmListProps {
  active?: boolean;
  nickname?: string;
  showCheck?: boolean;
  showNew?: boolean;
  text?: string;
  time?: string;
  count?: number;
  onCheck?: () => void;
  onClick?: () => void;
  className?: string;
}
