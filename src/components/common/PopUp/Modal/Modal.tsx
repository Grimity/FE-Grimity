"use client";

import clsx from "clsx";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import styles from "./Modal.module.scss";
import type { ModalProps } from "./Modal.types";
import Icon from "@/components/common/Icon/Icon";

export default function Modal(props: ModalProps) {
  const { title, onBack, headerRightAction, onClose, children, className } = props;
  const hasFooter =
    props.buttonType === "primary" ||
    props.buttonType === "secondary" ||
    props.buttonType === "double";

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
            {onBack != null && (
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
