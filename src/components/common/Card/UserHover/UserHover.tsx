import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import Icon from "@/components/common/Icon/Icon";
import styles from "./UserHover.module.scss";
import type { UserHoverProps } from "./UserHover.types";
import { THUMBNAIL_PATH } from "@/constants/imageUrl";

export default function UserHover({
  isFollowing = false,
  bannerUrl,
  avatarUrl,
  nickname,
  content,
  onFollowClick,
  onMessageClick,
  className,
}: UserHoverProps) {
  return (
    <div className={clsx(styles.userHover, className)}>
      <div className={styles.banner}>
        <ResponsiveImage
          src={bannerUrl ?? THUMBNAIL_PATH}
          alt=""
          className={styles.bannerImage}
          mobileSize={560}
          desktopSize={1120}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <ResponsiveImage
                src={avatarUrl}
                alt={nickname}
                className={styles.avatarImage}
                mobileSize={128}
                desktopSize={256}
              />
            ) : (
              <Icon name="profile" size={64} />
            )}
          </div>
        </div>

        <div className={styles.bio}>
          <p className={styles.nickname}>{nickname}</p>

          {content && (
            <p className={styles.content}>{content}</p>
          )}

          <div className={styles.actions}>
            {isFollowing ? (
              <>
                <SolidButton size="regular" className={styles.actionBtn} onClick={onMessageClick}>
                  메시지 보내기
                </SolidButton>
                <OutlinedButton size="regular" className={styles.actionBtn} onClick={onFollowClick}>
                  팔로잉 중
                </OutlinedButton>
              </>
            ) : (
              <SolidButton size="regular" className={styles.actionFull} onClick={onFollowClick}>
                팔로우
              </SolidButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
