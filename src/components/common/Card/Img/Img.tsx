import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { useToggleWithCallback } from "@/hooks/useCardInteraction";
import styles from "./Img.module.scss";
import type { ImgProps } from "./Img.types";
import { THUMBNAIL_PATH } from "@/constants/imageUrl";

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

  const handleRepresentativeClick = useToggleWithCallback(
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
        <ResponsiveImage
          src={imageUrl ?? THUMBNAIL_PATH}
          alt=""
          className={styles.image}
          mobileSize={400}
          desktopSize={800}
        />

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
