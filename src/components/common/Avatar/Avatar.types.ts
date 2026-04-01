export type AvatarType = "photo" | "default" | "dark";

export type AvatarSize = "xxl" | "xl" | "lg" | "ml" | "md" | "sm" | "xs";

export interface AvatarProps {
  src?: string;
  alt?: string;
  type?: AvatarType;
  size?: AvatarSize;
  className?: string;
}
