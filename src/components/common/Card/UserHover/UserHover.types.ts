export interface UserHoverProps {
  isFollowing?: boolean;
  bannerUrl?: string;
  avatarUrl?: string;
  nickname: string;
  content?: string;
  onFollowClick?: () => void;
  onMessageClick?: () => void;
  className?: string;
}
