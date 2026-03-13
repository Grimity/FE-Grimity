"use client";

import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./UserHover.module.scss";
import type { UserHoverProps } from "./UserHover.types";

const bannerPlaceholder = "/image/thumbnail.png";

export default function UserHover({
  concent = false,
  isFollowing = false,
  bannerUrl,
  avatarUrl,
  nickname,
  bio,
  onFollowClick,
  onMessageClick,
  className,
}: UserHoverProps) {
  return (
    <div className={clsx(styles.userHover, className)}>
      <div className={styles.banner}>
        <img
          src={bannerUrl ?? bannerPlaceholder}
          alt=""
          className={styles.bannerImage}
          loading="lazy"
        />
      </div>

      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={nickname} className={styles.avatarImage} />
          ) : (
            <span className={styles.avatarInitial} aria-hidden>
              {nickname[0].toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.nickname}>{nickname}</p>

        {concent && bio && (
          <p className={styles.bio}>{bio}</p>
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
  );
}
