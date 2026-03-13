"use client";

import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./ImgUpload.module.scss";
import type { ImgUploadProps } from "./ImgUpload.types";

export default function ImgUpload({ size = "md", onClick, className }: ImgUploadProps) {
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
      <span className={styles.uploadText}>
        <span className={clsx(styles.uploadTextLabel, styles[size])}>JPG / PNG</span>
        <span className={clsx(styles.uploadTextLabel, styles[size])}>1장 당 10MB 이내</span>
        <span className={clsx(styles.uploadTextLabel, styles[size])}>최대 10장까지 업로드</span>
      </span>
    </button>
  );
}
