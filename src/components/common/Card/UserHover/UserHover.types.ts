export interface UserHoverProps {
  /** 소개글(bio) 표시 여부 */
  concent?: boolean;
  /** 팔로잉 상태 — true면 "메시지 보내기 + 팔로잉 중" */
  isFollowing?: boolean;
  bannerUrl?: string;
  avatarUrl?: string;
  nickname: string;
  bio?: string;
  onFollowClick?: () => void;
  onMessageClick?: () => void;
  className?: string;
}
