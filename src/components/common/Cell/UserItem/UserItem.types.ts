import type { ReactNode, Ref } from "react";

import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";
import type { ActionMenuDisplayMode } from "@/components/common/Navigation/ActionMenu/ActionMenu.types";

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
  /** 읽음 상태 (notification 전용): true 면 카테고리·메시지를 흐리게 표시 */
  read?: boolean;
  onClose?: () => void;

  /** Link */
  brandIcon?: ReactNode;
  siteName?: string;
  url?: string;

  /** Post content */
  tag?: string;
  showTag?: boolean;
  postTitle?: ReactNode;
  body?: ReactNode;
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
  commentText?: ReactNode;
  mentionName?: string;
  likeCount?: string;
  isLiked?: boolean;
  isAuthor?: boolean;
  onLikeClick?: () => void;
  onReplyClick?: () => void;
  /** 댓글 변형: 프로필(아바타+닉네임) 클릭 시 호출 */
  onProfileClick?: () => void;
  onMenuClick?: () => void;

  /**
   * comment 계열 전용. 항목을 넘기면 더보기 버튼에 직접 붙은 메뉴가 열린다.
   * (넘기지 않으면 `onMenuClick`만 호출하고 메뉴는 호출하는 쪽에서 그린다)
   */
  menuItems?: MenuItem[];
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  menuDisplayMode?: ActionMenuDisplayMode;

  onClick?: () => void;

  /** `default` 전용: 프로필(아바타+닉네임) 영역에 붙는 ref/hover 핸들러 (호버 프로필 카드용) */
  profileRef?: Ref<HTMLDivElement>;
  onProfileMouseEnter?: () => void;
  onProfileMouseLeave?: () => void;

  /** `title` · `image` 전용: 카드 하단 Divider 표시 여부 (기본 true) */
  showTrailingDivider?: boolean;
}
