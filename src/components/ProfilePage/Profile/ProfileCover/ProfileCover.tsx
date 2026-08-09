import { useRef } from "react";

import Thumbnail from "@/components/common/Thumbnail/Thumbnail";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Icon from "@/components/common/Icon/Icon";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import styles from "@/components/ProfilePage/Profile/ProfileCover/ProfileCover.module.scss";

interface ProfileCoverProps {
  userData: UserData;
  coverImage: string;
  isMyProfile: boolean;
  handleAddCover: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteImage: () => void;
}

export default function ProfileCover({
  userData,
  coverImage,
  isMyProfile,
  handleAddCover,
  handleDeleteImage,
}: ProfileCoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadCover = () => {
    inputRef.current?.click();
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  if (!userData) return null;

  return (
    <div className={styles.cover}>
      {userData.backgroundImage ? (
        <>
          <Thumbnail
            src={coverImage}
            alt="커버 이미지"
            ratio="4/1"
            className={styles.thumbnail}
          />
          {isMyProfile && (
            <div className={styles.editButtons}>
              <IconButton
                variant="solid"
                icon={<Icon name="camera" size={16} color="white" />}
                onClick={handleUploadCover}
                aria-label="커버 이미지 변경"
                className={styles.overlayBtn}
              />
              <IconButton
                variant="solid"
                icon={<Icon name="x" size={16} color="white" />}
                onClick={handleDeleteImage}
                aria-label="커버 이미지 삭제"
                className={styles.overlayBtn}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyCover}>
          {isMyProfile && (
            <SolidButton
              size="regular"
              iconLeft={<Icon name="plus" size={16} />}
              onClick={handleUploadCover}
            >
              커버 추가하기
            </SolidButton>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleAddCover}
        onClick={handleInputClick}
      />
    </div>
  );
}
