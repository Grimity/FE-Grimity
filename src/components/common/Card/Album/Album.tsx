"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Album.module.scss";
import type { AlbumProps, AlbumRank } from "./Album.types";

const RANK_ICON_MAP: Record<AlbumRank, "rank-1" | "rank-2" | "rank-3" | "rank-4"> = {
  1: "rank-1",
  2: "rank-2",
  3: "rank-3",
  4: "rank-4",
};

const thumbnail = "/image/thumbnail.png";

const createKeyDownHandler = (handler: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handler();
  }
};

const makeToggleHandler =
  (
    isControlled: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    callback?: () => void,
  ) =>
  () => {
    if (!isControlled) setter((prev) => !prev);
    callback?.();
  };

export default function Album({
  variant = "mainTitle",
  checked: checkedProp,
  rank,
  imageUrl,
  title,
  nickname,
  likeCount,
  viewCount,
  isLiked: isLikedProp,
  onClick,
  onCheckClick,
  onLikeClick,
  className,
}: AlbumProps) {
  const isControlledChecked = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = isControlledChecked ? checkedProp : internalChecked;

  const isControlledLiked = isLikedProp !== undefined;
  const [internalLiked, setInternalLiked] = useState(false);
  const isLiked = isControlledLiked ? isLikedProp : internalLiked;

  const handleCheckClick = makeToggleHandler(isControlledChecked, setInternalChecked, onCheckClick);
  const handleLikeClick = makeToggleHandler(isControlledLiked, setInternalLiked, onLikeClick);

  const isCheck = variant === "check";
  const isRank = variant === "rank" && rank != null && rank in RANK_ICON_MAP;
  const isMainOrRank = variant === "mainTitle" || variant === "rank";

  const Tag = onClick ? "div" : "article";

  return (
    <Tag
      className={clsx(styles.album, className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? createKeyDownHandler(onClick) : undefined}
    >
      <div
        className={clsx(
          styles.imageWrap,
          isMainOrRank && styles.mainTitleRankOverlay,
          isCheck && !checked && styles.checkDefault,
          isCheck && checked && styles.checked,
          isCheck && onCheckClick && styles.imageWrapClickable,
        )}
        role={isCheck && onCheckClick ? "button" : undefined}
        tabIndex={isCheck && onCheckClick ? 0 : undefined}
        onClick={
          isCheck && onCheckClick
            ? (e) => {
                e.stopPropagation();
                handleCheckClick();
              }
            : undefined
        }
        onKeyDown={
          isCheck && onCheckClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCheckClick();
                }
              }
            : undefined
        }
      >
        <img src={imageUrl ?? thumbnail} alt="" className={styles.image} loading="lazy" />

        {isRank && (
          <span className={styles.iconTopLeft} aria-hidden>
            <Icon name={RANK_ICON_MAP[rank!]} size={24} />
          </span>
        )}

        {isCheck && (
          <span
            className={styles.iconTopRight}
            aria-pressed={checked}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <Icon
              name={checked ? "check-square-fill" : "check-square"}
              size={24}
              color={checked ? "primary-normal" : "gray-subtler"}
            />
          </span>
        )}

        {isMainOrRank && (
          <span
            className={clsx(styles.iconBottomRight, onLikeClick && styles.iconBottomRightClickable)}
            role={onLikeClick ? "button" : undefined}
            tabIndex={onLikeClick ? 0 : undefined}
            aria-pressed={onLikeClick ? isLiked : undefined}
            aria-label={onLikeClick ? (isLiked ? "좋아요 취소" : "좋아요") : undefined}
            onClick={
              onLikeClick
                ? (e) => {
                    e.stopPropagation();
                    handleLikeClick();
                  }
                : undefined
            }
            onKeyDown={
              onLikeClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLikeClick();
                    }
                  }
                : undefined
            }
          >
            <Icon
              name={isLiked ? "heart-fill" : "heart"}
              size={24}
              color={isLiked ? "primary-normal" : "gray-subtle"}
            />
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.metaItem}>{nickname}</span>
          <Icon name="dot" size={2} color="gray-subtler" aria-hidden />
          <span className={styles.metaItem}>
            <Icon name="heart" size={16} color="gray-subtle" aria-hidden />
            {likeCount}
          </span>
          <Icon name="dot" size={2} color="gray-subtler" aria-hidden />
          <span className={styles.metaItem}>
            <Icon name="eye" size={16} color="gray-subtle" aria-hidden />
            {viewCount}
          </span>
        </div>
      </div>
    </Tag>
  );
}
