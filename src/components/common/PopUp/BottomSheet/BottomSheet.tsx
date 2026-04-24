"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Icon from "@/components/common/Icon/Icon";
import styles from "./BottomSheet.module.scss";
import type { BottomSheetProps } from "./BottomSheet.types";

export default function BottomSheet(props: BottomSheetProps) {
  const {
    isOpen,
    onClose,
    children,
    title,
    showArrow = false,
    showCloseIcon = false,
    onBack,
    exceed = false,
    className,
  } = props;

  usePreventScroll(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasHeader = showArrow || !!title || showCloseIcon;
  const hasFooter =
    !exceed &&
    (props.buttonType === "primary" ||
      props.buttonType === "secondary" ||
      props.buttonType === "double");

  return (
    <div
      className={clsx(styles.overlay, className)}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "bottomsheet-title" : undefined}
    >
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {hasHeader && (
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              {showArrow && onBack != null && (
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={onBack}
                  aria-label="뒤로가기"
                >
                  <Icon name="chevron-left-tight-thick" size={24} />
                </button>
              )}
              {title && (
                <h2 id="bottomsheet-title" className={styles.title}>
                  {title}
                </h2>
              )}
            </div>
            {showCloseIcon && (
              <div className={styles.headerRight}>
                <button
                  type="button"
                  className={clsx(styles.iconButton, styles.closeButton)}
                  onClick={onClose}
                  aria-label="닫기"
                >
                  <Icon name="x-thick" size={24} />
                </button>
              </div>
            )}
          </header>
        )}

        <div className={styles.content}>{children}</div>

        {hasFooter && (
          <footer className={styles.footer}>
            {props.buttonType === "double" && (
              <>
                <div className={styles.buttonWrap}>
                  <OutlinedButton size="large" onClick={props.onSecondary}>
                    {props.secondaryLabel}
                  </OutlinedButton>
                </div>
                <div className={styles.buttonWrap}>
                  <SolidButton size="large" onClick={props.onPrimary}>
                    {props.primaryLabel}
                  </SolidButton>
                </div>
              </>
            )}
            {props.buttonType === "primary" && (
              <div className={styles.buttonWrap}>
                <SolidButton size="large" onClick={props.onPrimary}>
                  {props.primaryLabel}
                </SolidButton>
              </div>
            )}
            {props.buttonType === "secondary" && (
              <div className={styles.buttonWrap}>
                <OutlinedButton size="large" onClick={props.onSecondary}>
                  {props.secondaryLabel}
                </OutlinedButton>
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
