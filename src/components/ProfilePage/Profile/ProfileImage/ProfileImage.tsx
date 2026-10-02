import { useRef } from "react";
import clsx from "clsx";

import Avatar from "@/components/common/Avatar/Avatar";
import IconButton from "@/components/common/Button/IconButton/IconButton";
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

  // 모바일 Figma에는 편집 뱃지가 없어 아바타 자체를 눌러 이미지를 바꾼다
  return (
    <div className={clsx(styles.profileImageContainer, !isMobile && styles.withBadge)}>
      {isMobile ? (
        <button
          type="button"
          className={styles.avatarButton}
          onClick={handleUploadImage}
          aria-label="프로필 이미지 변경"
        >
          {avatar}
        </button>
      ) : (
        <>
          {avatar}
          <IconButton
            variant="solid"
            icon={<Icon name="pen-1" size={16} color="white" />}
            onClick={handleUploadImage}
            aria-label="프로필 이미지 변경"
            className={styles.editBtn}
          />
        </>
      )}
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
