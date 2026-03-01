"use client";

import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./Alert.module.scss";
import type { AlertProps } from "./Alert.types";

function AlertIllustIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
      <path
        d="M58.3328 34.1825C56.4146 48.7552 41.1487 58.0166 25.8755 56.0062C10.6022 53.9959 -0.22424 40.5527 1.6939 25.98C3.61203 11.4073 17.5484 1.22346 32.8217 3.23381C48.0949 5.24415 60.2509 19.6098 58.3328 34.1825Z"
        fill="#35373C"
      />
      <path
        d="M23.5 42.5L16.2613 33.6527C15.2957 32.4725 15.4918 30.7286 16.6955 29.7924C17.9401 28.8244 19.7448 29.1172 20.6194 30.4291L24 35.5L40.0346 20.8016C41.1336 19.7942 42.8311 19.8311 43.8853 20.8853C45.028 22.028 44.9612 23.9003 43.74 24.9587L23.5 42.5Z"
        fill="#00C950"
      />
    </svg>
  );
}

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
          <AlertIllustIcon className={styles.illustIcon} />
        </div>
      )}
      <h2 id="alert-main" className={styles.mainText}>
        {title}
      </h2>
      <p id="alert-desc" className={styles.description}>
        {contentText}
      </p>
      <div className={styles.buttons}>
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
