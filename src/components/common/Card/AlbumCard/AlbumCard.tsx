"use client";

import clsx from "clsx";
import styles from "./AlbumCard.module.scss";
import type { AlbumCardProps } from "./AlbumCard.types";

const createKeyDownHandler = (handler: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handler();
  }
};

const thumbnail = "/image/thumbnail.png";

export default function AlbumCard({
  imageUrl,
  checked = false,
  count = 0,
  onClick,
  className,
}: AlbumCardProps) {

  return (
    <article
      className={clsx(styles.albumCard, className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? createKeyDownHandler(onClick) : undefined}
    >
      <div className={clsx(styles.imageWrap, onClick && styles.withOnClick, checked && styles.albumChecked)}>
        <img src={imageUrl ?? thumbnail} alt="" className={styles.image} loading="lazy" />

        {checked && (
          <div className={styles.badge}>
            <span className={styles.badgeText}>{count}</span>
          </div>
        )}
      </div>
    </article>
  );
}
