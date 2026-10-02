import { useRef } from "react";
import clsx from "clsx";

import Avatar from "@/components/common/Avatar/Avatar";
import Icon from "@/components/common/Icon/Icon";

import styles from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage.module.scss";

const AVATAR_SIZE = 80;
const MOBILE_AVATAR_SIZE = 48;
const DEFAULT_IMAGE = "/image/default.svg";

interface ProfileImageProps {
  profileImage: string;
  isMyProfile: boolean;
  isMobile: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileImage({
  profileImage,
  isMyProfile,
  isMobile,
  handleFileChange,
}: ProfileImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    inputRef.current?.click();
  };

  const avatar = (
    <Avatar
      src={profileImage === DEFAULT_IMAGE ? undefined : profileImage}
      size={isMobile ? MOBILE_AVATAR_SIZE : AVATAR_SIZE}
      alt="프로필 이미지"
    />
  );

  if (!isMyProfile) {
    return <div className={styles.profileImageContainer}>{avatar}</div>;
  }

  // 아바타와 뱃지 어디를 눌러도 이미지 수정 모달로 이어진다(모바일 Figma에는 뱃지가 없다)
  return (
    <div className={clsx(styles.profileImageContainer, !isMobile && styles.withBadge)}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={handleUploadImage}
        aria-label="프로필 이미지 변경"
      >
        {avatar}
        {!isMobile && (
          <span className={styles.editBadge} aria-hidden>
            <Icon name="pen-1" size={16} color="white" />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        id="upload-image"
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
