import clsx from "clsx";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { useKeyDownActivate } from "@/hooks/useCardInteraction";
import styles from "./AlbumCard.module.scss";
import type { AlbumCardProps } from "./AlbumCard.types";
import { THUMBNAIL_PATH } from "@/constants/imageUrl";

export default function AlbumCard({
  imageUrl,
  checked = false,
  count = 0,
  onClick,
  className,
}: AlbumCardProps) {
  const keyDownOnArticle = useKeyDownActivate(onClick);

  return (
    <article
      className={clsx(styles.albumCard, className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={keyDownOnArticle}
    >
      <div className={clsx(styles.imageWrap, onClick && styles.withOnClick, checked && styles.albumChecked)}>
        <ResponsiveImage
          src={imageUrl ?? THUMBNAIL_PATH}
          alt=""
          className={styles.image}
          mobileSize={400}
          desktopSize={800}
        />

        {checked && (
          <div className={styles.badge}>
            <span className={styles.badgeText}>{count}</span>
          </div>
        )}
      </div>
    </article>
  );
}
