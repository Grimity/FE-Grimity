import clsx from "clsx";
import styles from "./HelperText.module.scss";
import { HelperTextProps } from "./HelperText.types";
import Icon from "@/components/common/Icon/Icon";

export default function HelperText({
  message,
  status = "default",
  currentCount,
  maxCount,
  id,
  className,
}: HelperTextProps) {
  const hasMessage = !!message;
  const hasCount = currentCount !== undefined && maxCount !== undefined;

  if (!hasMessage && !hasCount) return null;

  const isError = status === "error";

  return (
    <div
      id={id}
      className={clsx(styles.helperText, styles[status], className)}
      {...(isError && { "aria-live": "polite" as const, role: "alert" })}
    >
      <div className={styles.messageWrapper}>
        {status !== "default" && <Icon name="x" size={16} className={styles.icon} />}
        {hasMessage && <span className={styles.message}>{message}</span>}
      </div>
      {hasCount && (
        <div className={styles.count}>
          <span className={styles.currentCount}>{currentCount}</span>
          <span className={styles.maxCount}>/{maxCount}</span>
        </div>
      )}
    </div>
  );
}
