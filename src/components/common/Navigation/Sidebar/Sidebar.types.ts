export interface SidebarProps {
  className?: string;
  isLoggedIn?: boolean;
  /** 모바일에서 드로우로 동작할 때 열림 여부 */
  isOpen?: boolean;
  onClose?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  user?: { username: string; avatarSrc?: string; profileUrl?: string };
  profileActiveItem?: "liked" | "saved";
  onProfileLikedClick?: () => void;
  onProfileSavedClick?: () => void;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}
