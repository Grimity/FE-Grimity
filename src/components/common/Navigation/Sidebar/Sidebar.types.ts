export type SidebarSize = "lg" | "md";
export type SidebarActiveItem = "liked" | "saved";

export interface SidebarProps {
  size?: SidebarSize;
  username: string;
  handle: string;
  avatarSrc?: string;
  followerCount: number;
  followingCount: number;
  activeItem?: SidebarActiveItem;
  onLikedClick?: () => void;
  onSavedClick?: () => void;
  onLogoutClick?: () => void;
  onTermsClick?: () => void;
  onBusinessClick?: () => void;
  className?: string;
}
