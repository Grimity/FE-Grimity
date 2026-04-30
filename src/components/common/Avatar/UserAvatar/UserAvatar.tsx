import Icon from "@/components/common/Icon/Icon";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

interface UserAvatarProps {
  avatarUrl?: string;
  nickname: string;
  imageClassName: string;
  mobileSize: number;
  desktopSize: number;
  fallbackIconSize: number;
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
