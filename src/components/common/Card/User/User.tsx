"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./User.module.scss";
import type {
  UserCardProps,
  UserCardImageItem,
  DefaultUserCardProps,
  SearchUserCardProps,
  TagViewUserCardProps,
} from "./User.types";

const thumbnail = "/image/thumbnail.png";

function UserCardImage({ image }: { image: UserCardImageItem }) {
  const isControlled = image.isLiked !== undefined;
  const [internalLiked, setInternalLiked] = useState(false);
  const isLiked = isControlled ? image.isLiked! : internalLiked;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalLiked((prev) => !prev);
    image.onLikeClick?.();
  };

  return (
    <div className={styles.imageItem}>
      <img src={image.url ?? thumbnail} alt="" className={styles.image} loading="lazy" />
      <button
        className={styles.likeBtn}
        onClick={handleLikeClick}
        aria-pressed={isLiked}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      >
        <Icon
          name={isLiked ? "heart-fill" : "heart"}
          size={20}
          color={isLiked ? "primary-normal" : "gray-subtle"}
        />
      </button>
    </div>
  );
}

function TagViewCard({ bannerUrl, tagText, onClick, className }: TagViewUserCardProps) {
  return (
    <article
      className={clsx(styles.tagView, className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      <div className={styles.tagViewBg}>
        <img src={bannerUrl ?? thumbnail} alt="" className={styles.tagViewBgImage} loading="lazy" />
        <div className={styles.tagViewOverlay} aria-hidden />
      </div>
      <div className={styles.tagViewBody}>
        {tagText && <p className={styles.tagViewTagText}>{tagText}</p>}
      </div>
    </article>
  );
}

function SearchCard({
  avatarUrl,
  bannerUrl,
  nickname,
  followerCount = 0,
  isFollowing: isFollowingProp,
  content,
  onClick,
  onFollowClick,
  className,
}: SearchUserCardProps) {
  const isControlled = isFollowingProp !== undefined;
  const [internalFollowing, setInternalFollowing] = useState(false);
  const isFollowing = isControlled ? isFollowingProp : internalFollowing;

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalFollowing((prev) => !prev);
    onFollowClick?.();
  };

  return (
    <article
      className={clsx(styles.search, className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      <div className={styles.searchBanner}>
        <img
          src={bannerUrl ?? thumbnail}
          alt=""
          className={styles.searchBannerImage}
          loading="lazy"
        />
      </div>
      <div className={styles.searchBody}>
        <div className={styles.searchTop}>
          <div className={styles.searchAvatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} className={styles.searchAvatarImage} />
            ) : (
              <Icon name="profile" size={40} />
            )}
          </div>
          <div className={styles.searchInfo}>
            <div className={styles.searchHeader}>
              <div className={styles.searchHeaderContent}>
                <span className={styles.searchNickname}>{nickname}</span>
                <p className={styles.searchFollowerCount}>
                  팔로워 <span className={styles.searchFollowerCountValue}>{followerCount}</span>
                </p>
              </div>
              {isFollowing ? (
                <OutlinedButton size="small" onClick={handleFollowClick}>
                  팔로잉
                </OutlinedButton>
              ) : (
                <SolidButton size="small" onClick={handleFollowClick}>
                  팔로우
                </SolidButton>
              )}
            </div>
            {content && <p className={styles.searchContent}>{content}</p>}
          </div>
        </div>
      </div>
    </article>
  );
}

function DefaultCard({
  avatarUrl,
  nickname,
  followerCount = 0,
  followingCount = 0,
  isFollowing: isFollowingProp,
  images = [],
  onClick,
  onFollowClick,
  className,
}: DefaultUserCardProps) {
  const isControlled = isFollowingProp !== undefined;
  const [internalFollowing, setInternalFollowing] = useState(false);
  const isFollowing = isControlled ? isFollowingProp : internalFollowing;

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalFollowing((prev) => !prev);
    onFollowClick?.();
  };

  return (
    <article
      className={clsx(styles.userCard, className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={nickname} className={styles.avatarImage} />
          ) : (
            <Icon name="profile" size={40} />
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.nickname}>{nickname}</span>
          <div className={styles.counts}>
            <span className={styles.countItem}>
              팔로워 <span className={styles.countItemValue}>{followerCount}</span>
            </span>
            <span className={styles.countItem}>
              팔로잉 <span className={styles.countItemValue}>{followingCount}</span>
            </span>
          </div>
        </div>
        {isFollowing ? (
          <OutlinedButton size="small" onClick={handleFollowClick}>팔로잉</OutlinedButton>
        ) : (
          <SolidButton size="small" onClick={handleFollowClick}>팔로우</SolidButton>
        )}
      </div>
      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.slice(0, 3).map((img, i) => (
            <UserCardImage key={i} image={img} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function UserCard(props: UserCardProps) {
  if (props.variant === "tagView") return <TagViewCard {...props} />;
  if (props.variant === "search") return <SearchCard {...props} />;
  return <DefaultCard {...props} />;
}
