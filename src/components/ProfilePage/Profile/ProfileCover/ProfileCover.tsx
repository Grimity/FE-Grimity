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
  onEditCover: () => void;
  handleDeleteImage: () => void;
}

export default function ProfileCover({
  userData,
  coverImage,
  isMyProfile,
  onEditCover,
  handleDeleteImage,
}: ProfileCoverProps) {
  return (
    <div className={styles.cover}>
      {userData.backgroundImage ? (
        <>
          <Thumbnail src={coverImage} alt="커버 이미지" ratio="4/1" className={styles.thumbnail} />
          {isMyProfile && (
            <div className={styles.editButtons}>
              <IconButton
                variant="solid"
                icon={<Icon name="camera" size={16} color="white" />}
                onClick={onEditCover}
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
      ) : isMyProfile ? (
        <div className={styles.emptyCover}>
          <SolidButton
            size="regular"
            iconLeft={<Icon name="plus" size={16} />}
            onClick={onEditCover}
          >
            커버 추가하기
          </SolidButton>
        </div>
      ) : (
        // 커버가 없는 타 유저는 Thumbnail 기본 상태(로고 플레이스홀더)를 보여준다
        <Thumbnail alt="" ratio="4/1" className={styles.thumbnail} />
      )}
    </div>
  );
}
