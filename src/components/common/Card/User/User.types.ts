import type { ReactNode } from "react";

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
  avatarUrl?: string;
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
  nickname: ReactNode;
  followerCount?: number;
  isFollowing?: boolean;
  onFollowClick?: () => void;
  content?: ReactNode;
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
