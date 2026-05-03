import Icon from "@/components/common/Icon/Icon";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import type { IconSize } from "@/components/common/Icon/Icon.types";

interface UserAvatarProps {
  avatarUrl?: string;
  nickname: string;
  imageClassName: string;
  mobileSize: number;
  desktopSize: number;
  fallbackIconSize: IconSize;
}

export default function UserAvatar({
  avatarUrl,
  nickname,
  imageClassName,
  mobileSize,
  desktopSize,
  fallbackIconSize,
}: UserAvatarProps) {
  if (!avatarUrl) {
    return <Icon name="profile" size={fallbackIconSize} />;
  }

  return (
    <ResponsiveImage
      src={avatarUrl}
      alt={nickname}
      className={imageClassName}
      mobileSize={mobileSize}
      desktopSize={desktopSize}
    />
  );
}
