"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Icon from "../../Icon/Icon";
import { IconName } from "../../Icon/Icon.types";
import styles from "./Toast.module.scss";
import type { ToastProps } from "./Toast.types";

const TOAST_ICON_MAP = {
  Positive: "success",
  Negative: "error",
  Cautionary: "warning",
  Info: "information",
} as const;

const TOAST_DURATION = 2000;
const EXIT_ANIMATION_MS = 200;

export default function Toast({
  type = "Default",
  text,
  duration = TOAST_DURATION,
  onClose,
  className,
}: ToastProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const visibleTimer = setTimeout(() => {
      setPhase("exit");
    }, duration);

    return () => clearTimeout(visibleTimer);
  }, [duration]);

  useEffect(() => {
    if (phase !== "exit") return;
    const exitTimer = setTimeout(() => {
      onClose?.();
    }, EXIT_ANIMATION_MS);
    return () => clearTimeout(exitTimer);
  }, [phase, onClose]);

  const showIcon = type !== "Default";

  return (
    <div
      className={clsx(
        styles.toast,
        type !== "Default" && styles[type.toLowerCase()],
        styles[phase],
        className,
      )}
      role="alert"
    >
      {showIcon && type in TOAST_ICON_MAP && (
        <span className={styles.iconWrap} aria-hidden>
          <Icon
            name={TOAST_ICON_MAP[type as keyof typeof TOAST_ICON_MAP] as IconName}
            size={16}
            className={styles.icon}
          />
        </span>
      )}
      <span className={styles.text}>{text}</span>
    </div>
  );
}
