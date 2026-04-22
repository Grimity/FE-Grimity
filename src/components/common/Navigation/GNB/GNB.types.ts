export type GNBVariant =
  | "pc-main"
  | "pc-guest"
  | "guest"
  | "guest-menu"
  | "main"
  | "2dep"
  | "3button"
  | "search"
  | "text-button"
  | "editor"
  | "dm"
  | "image-viewer";

export interface GNBProps {
  variant: GNBVariant;
  title?: string;
  onBack?: () => void;
  onSearch?: () => void;
  onBell?: () => void;
  onProfile?: () => void;
  onClose?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onLogin?: () => void;
  onMenu?: () => void;
  /** editor: 제목 옆 드롭다운 클릭 */
  onTitleMenuClick?: () => void;
  /** 알림 dot 표시 여부 (bell 아이콘에 적용) */
  hasNotification?: boolean;
  /** 프로필 이미지 URL - 없으면 default image로 대체 */
  profileImageUrl?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  /** icon-button 변형의 우측 아이콘 슬롯 */
  rightActions?: React.ReactNode[];
  /** text-button / editor 변형의 우측 텍스트 레이블 */
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
