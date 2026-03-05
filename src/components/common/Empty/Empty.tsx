"use client";

import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import { IconSize } from "@/components/common/Icon/Icon.types";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./Empty.module.scss";
import type { EmptyProps } from "./Empty.types";

const DEFAULT_ICON_NAME = "illust-upload-success";

export default function Empty({
  size = "md",
  icon,
  iconName = DEFAULT_ICON_NAME,
  title,
  content,
  buttonLabel,
  onButtonClick,
  buttonVariant = "solid",
  className,
}: EmptyProps) {
  const buttonSize = size === "xl" ? "large" : "regular";

  return (
    <div className={clsx(styles.empty, styles[size], className)} role="status">
      <div className={styles.iconWrap} aria-hidden>
        {icon ?? <Icon name={iconName} size={60 as IconSize} />}
      </div>
      <h2 className={styles.title}>{title}</h2>
      {content != null && content !== "" && <p className={styles.content}>{content}</p>}
      {buttonLabel && onButtonClick && (
        <div className={styles.buttonWrap}>
          {buttonVariant === "outline" ? (
            <OutlinedButton size={buttonSize} onClick={onButtonClick}>
              {buttonLabel}
            </OutlinedButton>
          ) : (
            <SolidButton size={buttonSize} onClick={onButtonClick}>
              {buttonLabel}
            </SolidButton>
          )}
        </div>
      )}
    </div>
  );
}
