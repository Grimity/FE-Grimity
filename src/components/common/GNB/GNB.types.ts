export type GNBVariant =
  | "main-desktop"
  | "guest-desktop"
  | "guest"
  | "guest-menu"
  | "main"
  | "2dep"
  | "3button"
  | "search"
  | "text-button"
  | "dm"
  | "image-viewer";

export interface GNBProps {
  variant: GNBVariant;
  title?: string;
  onLogoClick?: () => void;
  onBack?: () => void;
  onSearch?: () => void;
  onBell?: () => void;
  onProfile?: () => void;
  onClose?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onLogin?: () => void;
  onMenu?: () => void;
  /** 알림 dot 표시 여부 (bell 아이콘에 적용) */
  hasNotification?: boolean;
  /** 프로필 이미지 URL - 없으면 default image로 대체 */
  profileImageUrl?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** 3button 변형의 우측 아이콘 슬롯 (최대 3개) */
  rightActions?: React.ReactNode[];
  /** text-button 변형의 우측 텍스트 레이블 */
  rightLabel?: string;
  onRightLabelClick?: () => void;
  /** DM 변형에서 표시되는 상대방 이름 */
  dmName?: string;
  /** DM 변형에서 표시되는 상대방 아이디 */
  dmUsername?: string;
  /** DM 변형에서 표시되는 상대방 프로필 이미지 URL */
  dmProfileImageUrl?: string;
  onDMReport?: () => void;
  onDMExit?: () => void;
  className?: string;
}
