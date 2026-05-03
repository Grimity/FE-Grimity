export interface UserCardImageItem {
  url?: string;
  isLiked?: boolean;
  onLikeClick?: () => void;
}

export type UserCardImages = [
  UserCardImageItem?,
  UserCardImageItem?,
  UserCardImageItem?,
];

interface BaseUserCardProps {
  onClick?: () => void;
  className?: string;
}

export interface DefaultUserCardProps extends BaseUserCardProps {
  variant?: "default";
  nickname: string;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  onFollowClick?: () => void;
  images?: UserCardImages;
}

export interface SearchUserCardProps extends BaseUserCardProps {
  variant: "search";
  avatarUrl?: string;
  bannerUrl?: string;
  nickname: string;
  followerCount?: number;
  isFollowing?: boolean;
  onFollowClick?: () => void;
  content?: string;
}

export interface TagViewUserCardProps extends BaseUserCardProps {
  variant: "tagView";
  bannerUrl?: string;
  tagText?: string;
}

export type UserCardProps =
  | DefaultUserCardProps
  | SearchUserCardProps
  | TagViewUserCardProps;
