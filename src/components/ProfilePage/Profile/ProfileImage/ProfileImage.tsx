import { useRef } from "react";

import Avatar from "@/components/common/Avatar/Avatar";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";

import styles from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage.module.scss";

const AVATAR_SIZE = 80;
const DEFAULT_IMAGE = "/image/default.svg";

interface ProfileImageProps {
  profileImage: string;
  isMyProfile: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileImage({
  profileImage,
  isMyProfile,
  handleFileChange,
}: ProfileImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.profileImageContainer}>
      <Avatar
        src={profileImage === DEFAULT_IMAGE ? undefined : profileImage}
        size={AVATAR_SIZE}
        alt="프로필 이미지"
      />
      {isMyProfile && (
        <>
          <IconButton
            variant="solid"
            icon={<Icon name="pen-1" size={16} color="white" />}
            onClick={handleUploadImage}
            aria-label="프로필 이미지 변경"
            className={styles.editBtn}
          />
          <input
            ref={inputRef}
            id="upload-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
