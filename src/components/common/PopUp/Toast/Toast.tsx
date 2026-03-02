"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import type { IconName } from "@/components/common/Icon/Icon.types";
import styles from "./Toast.module.scss";
import type { ToastProps } from "./Toast.types";

const TOAST_ICON_MAP = {
  Positive: "check-circle-fill",
  Negative: "danger-circle-fill",
  Cautionary: "danger-triangle-fill",
  Info: "info-circle-fill",
} as const;

const TOAST_DURATION = 2000;
const ANIMATION_MS = 200;

export default function Toast({
  type = "Default",
  text,
  duration = TOAST_DURATION,
  onClose,
  className,
}: ToastProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const delay = phase === "visible" ? duration : ANIMATION_MS;
    const timer = setTimeout(() => {
      if (phase === "enter") setPhase("visible");
      else if (phase === "visible") setPhase("exit");
      else onClose?.();
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, duration, onClose]);

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
