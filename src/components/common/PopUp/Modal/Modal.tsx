"use client";

import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./Modal.module.scss";
import type { ModalProps } from "./Modal.types";
import Icon from "../../Icon/Icon";

export default function Modal({
  title,
  showBackButton = false,
  onBack,
  headerRightAction,
  onClose,
  children,
  singleButtonVariant = "primary",
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  className,
}: ModalProps) {
  const hasFooter = primaryLabel != null && onPrimary != null;
  const hasTwoButtons = hasFooter && secondaryLabel != null && onSecondary != null;

  return (
    <div
      className={clsx(styles.overlay, className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {showBackButton && (
              <button
                type="button"
                className={styles.iconButton}
                onClick={onBack}
                aria-label="뒤로가기"
              >
                <Icon name="chevron-left" size={24} />
              </button>
            )}
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
          </div>
          <div className={styles.headerRight}>
            {headerRightAction != null && (
              <div className={styles.headerRightAction}>{headerRightAction}</div>
            )}
            <button type="button" className={styles.iconButton} onClick={onClose} aria-label="닫기">
              <Icon name="x" size={24} />
            </button>
          </div>
        </header>

        <div className={styles.content}>{children}</div>

        {hasFooter && (
          <footer className={styles.footer}>
            {hasTwoButtons ? (
              <>
                <div className={styles.buttonWrap}>
                  <OutlinedButton size="large" onClick={onSecondary}>
                    {secondaryLabel}
                  </OutlinedButton>
                </div>
                <div className={styles.buttonWrap}>
                  <SolidButton size="large" onClick={onPrimary}>
                    {primaryLabel}
                  </SolidButton>
                </div>
              </>
            ) : (
              <div className={styles.buttonWrap}>
                {singleButtonVariant === "primary" ? (
                  <SolidButton size="large" onClick={onPrimary}>
                    {primaryLabel}
                  </SolidButton>
                ) : (
                  <OutlinedButton size="large" onClick={onPrimary}>
                    {primaryLabel}
                  </OutlinedButton>
                )}
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
