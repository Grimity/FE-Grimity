export type UserInfoType = "default" | "community" | "comment" | "follow";

export interface UserInfoProps {
  type?: UserInfoType;
  nickname?: string;
  /** default & community */
  showHeart?: boolean;
  heartCount?: string;
  showView?: boolean;
  viewCount?: string;
  showTime?: boolean;
  timeCount?: string;
  /** community only */
  showChatting?: boolean;
  chattingCount?: string;
  /** comment only */
  showTag?: boolean;
  /** follow only */
  followerCount?: string;
  showFollowing?: boolean;
  followingCount?: string;
  className?: string;
}
