"use client";

import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./UserHover.module.scss";
import type { UserHoverProps } from "./UserHover.types";
import Icon from "@/components/common/Icon/Icon";

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
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt=""
            className={styles.bannerImage}
            loading="lazy"
          />
        ) : (
          <img
            src="/image/thumbnail.png"
            alt=""
            className={styles.bannerImage}
            loading="lazy"
          />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} className={styles.avatarImage} />
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
