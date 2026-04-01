import clsx from "clsx";
import styles from "./Avatar.module.scss";
import { AvatarProps } from "./Avatar.types";

const SPRITE_PATH = "/sprites/icons.svg";

export default function Avatar({
  src,
  alt,
  type = "default",
  size = "md",
  className,
}: AvatarProps) {
  const resolvedType = src ? "photo" : type;

  return (
    <div
      className={clsx(
        styles.avatar,
        styles[`size-${size}`],
        styles[`type-${resolvedType}`],
        className
      )}
      role="img"
      aria-label={alt || "아바타"}
    >
      {resolvedType === "photo" ? (
        <img
          src={src}
          alt={alt || ""}
          className={styles.image}
          draggable={false}
        />
      ) : (
        <svg
          className={styles.logo}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <use href={`${SPRITE_PATH}#logo-g`} />
        </svg>
      )}
    </div>
  );
}
