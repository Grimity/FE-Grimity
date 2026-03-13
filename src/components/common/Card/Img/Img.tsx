"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Img.module.scss";
import type { ImgProps } from "./Img.types";

const thumbnail = "/image/thumbnail.png";

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

export default function Img({
  size = "md",
  imageUrl,
  title,
  isRepresentative: isRepresentativeProp,
  onRepresentativeClick,
  onDeleteClick,
  className,
}: ImgProps) {
  const isControlledRepresentative = isRepresentativeProp !== undefined;
  const [internalRepresentative, setInternalRepresentative] = useState(false);
  const isRepresentative = isControlledRepresentative
    ? isRepresentativeProp
    : internalRepresentative;

  const handleRepresentativeClick = makeToggleHandler(
    isControlledRepresentative,
    setInternalRepresentative,
    onRepresentativeClick,
  );

  return (
    <div className={clsx(styles.img, styles[size], className)}>
      <div
        className={clsx(
          styles.imageWrap,
          isRepresentative && styles.representative,
        )}
      >
        <img src={imageUrl ?? thumbnail} alt="" className={styles.image} loading="lazy" />

        <button
          type="button"
          className={clsx(styles.badge, isRepresentative && styles.badgeActive, styles[size])}
          onClick={(e) => {
            e.stopPropagation();
            handleRepresentativeClick();
          }}
          aria-pressed={isRepresentative}
          aria-label={isRepresentative ? "대표 해제" : "대표 설정"}
        >
          <Icon
            name="check"
            size={size === "lg" ? 16 : 12}
            color={isRepresentative ? "white" : "gray-subtle"}
            aria-hidden
          />
          대표
        </button>

        {onDeleteClick && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
            aria-label="삭제"
          >
            <Icon name="x" size={16} color="white" aria-hidden />
          </button>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
}
