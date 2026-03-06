"use client";

import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Alert.module.scss";
import type { AlertProps } from "./Alert.types";

export default function Alert({
  variant = "content",
  size = "md",
  title,
  contentText,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  className,
}: AlertProps) {
  const showSecondary =
    (variant === "illust" || variant === "content") &&
    secondaryLabel != null &&
    onSecondary != null;

  return (
    <div
      className={clsx(styles.alert, styles[variant], styles[size], className)}
      role="alertdialog"
      aria-labelledby="alert-main"
      aria-describedby="alert-desc"
    >
      {variant === "illust" && (
        <div className={styles.iconWrap}>
          <Icon name="illust-success" size={32} className={styles.illustIcon} />
        </div>
      )}
      <h2 id="alert-main" className={styles.mainText}>
        {title}
      </h2>
      <p id="alert-desc" className={styles.description}>
        {contentText}
      </p>
      <div className={styles.buttonContainer}>
        {showSecondary && (
          <div className={styles.buttonWrap}>
            <OutlinedButton size="large" onClick={onSecondary}>
              {secondaryLabel}
            </OutlinedButton>
          </div>
        )}
        <div className={styles.buttonWrap}>
          <SolidButton size="large" onClick={onPrimary}>
            {primaryLabel}
          </SolidButton>
        </div>
      </div>
    </div>
  );
}
