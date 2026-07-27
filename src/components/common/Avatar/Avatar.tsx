import clsx from "clsx";
import styles from "./Avatar.module.scss";
import { AvatarProps } from "./Avatar.types";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import Icon from "@/components/common/Icon/Icon";

export default function Avatar({
  src,
  alt,
  type = "default",
  size = "md",
  className,
}: AvatarProps) {
  const resolvedType = src ? "photo" : type;
  const isNamedSize = typeof size === "string";

  return (
    <div
      className={clsx(
        styles.avatar,
        isNamedSize && styles[`size-${size}`],
        styles[`type-${resolvedType}`],
        className,
      )}
      style={!isNamedSize ? { width: size, height: size } : undefined}
      role="img"
      aria-label={alt || "아바타"}
    >
      {resolvedType === "photo" ? (
        <ResponsiveImage
          src={src!}
          alt={alt || ""}
          className={styles.image}
          draggable={false}
          desktopSize={300}
          mobileSize={300}
        />
      ) : (
        <Icon name="logo-g" size={32} className={styles.logo} />
      )}
    </div>
  );
}
