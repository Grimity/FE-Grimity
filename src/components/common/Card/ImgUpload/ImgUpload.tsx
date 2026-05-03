import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./ImgUpload.module.scss";
import type { ImgUploadProps } from "./ImgUpload.types";

export default function ImgUpload({
  size = "md",
  description,
  onClick,
  className,
}: ImgUploadProps) {
  return (
    <button
      type="button"
      className={clsx(styles.imgUpload, styles[size], className)}
      onClick={onClick}
    >
      <Icon
        name="gallery-fill"
        size={size === "lg" ? 40 : 32}
        color="gray-subtle"
        aria-hidden
      />
      {description && description.length > 0 && (
        <span className={styles.uploadText}>
          {description.map((line, index) => (
            <span key={`${index}-${line}`} className={clsx(styles.uploadTextLabel, styles[size])}>
              {line}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}
