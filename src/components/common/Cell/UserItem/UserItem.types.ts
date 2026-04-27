import type { ReactNode } from "react";

export type UserItemType =
  | "default"
  | "id"
  | "iconId"
  | "radio"
  | "follow"
  | "notification"
  | "link"
  | "linkMain"
  | "bookMark"
  | "communityTitle"
  | "title"
  | "image"
  | "comment"
  | "commentxs"
  | "commentPlus"
  | "commentPlusxs"
  | "commentDeleted";

export interface UserItemProps {
  type?: UserItemType;
  className?: string;
  children?: ReactNode;

  /** Profile */
  profileImage?: string;
  nickname?: string;
  userId?: string;

  /** Follow info */
  followerCount?: string;
  followingCount?: string;

  /** Radio */
  selected?: boolean;

  /** Notification */
  category?: string;
  message?: string;
  time?: string;
  onClose?: () => void;

  /** Link */
  brandIcon?: ReactNode;
  siteName?: string;
  url?: string;

  /** Post content */
  tag?: string;
  showTag?: boolean;
  postTitle?: string;
  body?: string;
  commentCount?: number;
  thumbnailUrl?: string;
  showBookmark?: boolean;
  bookmarkActive?: boolean;
  onBookmarkClick?: () => void;

  /** UserInfo props */
  heartCount?: string;
  viewCount?: string;
  timeCount?: string;
  chattingCount?: string;

  /** Comment props */
  commentText?: string;
  mentionName?: string;
  likeCount?: string;
  isAuthor?: boolean;
  onLikeClick?: () => void;
  onReplyClick?: () => void;
  onMenuClick?: () => void;

  onClick?: () => void;
}
