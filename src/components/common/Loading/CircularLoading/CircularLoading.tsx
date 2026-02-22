import clsx from "clsx";
import styles from "./CircularLoading.module.scss";
import { CircularLoadingProps } from "./CircularLoading.types";

export default function CircularLoading({ type = "basic", className }: CircularLoadingProps) {
  return (
    <span
      className={clsx(styles.spinner, styles[type], className)}
      role="status"
      aria-label="로딩 중"
    />
  );
}
