export type AvatarType = "photo" | "default" | "dark";

export type AvatarNamedSize = "xxl" | "xl" | "lg" | "ml" | "md" | "sm" | "xs";

export type AvatarSize = AvatarNamedSize | number;

export interface AvatarProps {
  src?: string;
  alt?: string;
  type?: AvatarType;
  size?: AvatarSize;
  className?: string;
}
