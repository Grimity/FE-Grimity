import clsx from "clsx";
import { useCallback, useLayoutEffect, useRef } from "react";

import Icon from "@/components/common/Icon/Icon";

import styles from "./DmInput.module.scss";
import type { DmInputProps } from "./DmInput.types";

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 88;
const BORDER_Y = 2;

export default function DmInput({
  value = "",
  onChange,
  onSend,
  onImageClick,
  onKeyDown,
  inputRef,
  images,
  onRemoveImage,
  replyTo,
  onCancelReply,
  disabled = false,
  isSending = false,
  placeholder = "메시지 입력",
  className,
}: DmInputProps) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      if (typeof inputRef === "function") {
        inputRef(el);
      } else if (inputRef) {
        (inputRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      }
    },
    [inputRef],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value),
    [onChange],
  );

  useLayoutEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    el.style.height = "auto";
    const total = el.scrollHeight + BORDER_Y;
    const next = Math.min(Math.max(total, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${next}px`;
    el.style.overflowY = total > MAX_HEIGHT ? "auto" : "hidden";
  }, [value]);

  const hasImages = !!images && images.length > 0;
  const isAnswer = !!replyTo;
  const canSend = !disabled && !isSending && (value.trim().length > 0 || hasImages);
  const resolvedPlaceholder = disabled ? "더 이상 채팅이 불가능해요" : placeholder;

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.divider} />

      {isAnswer && (
        <div className={styles.replyContainer}>
          <div className={styles.replyHeader}>
            <Icon name="reply-2" size={16} className={styles.replyIcon} />
            <span className={styles.replyTarget}>{`${replyTo.target}님에게 답장`}</span>
          </div>
          <p className={styles.replyPreviewText}>{replyTo.text}</p>
          {onCancelReply && (
            <button
              type="button"
              className={styles.cancelReply}
              onClick={onCancelReply}
              aria-label="답장 취소"
            >
              <Icon name="close-circle-fill" size={16} />
            </button>
          )}
        </div>
      )}

      {hasImages && (
        <div className={styles.imageList}>
          {images!.map((image, index) => (
            <div key={`${image.fileName}-${index}`} className={styles.imageItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.fullUrl} alt={image.fileName} className={styles.imageThumb} />
              {onRemoveImage && (
                <button
                  type="button"
                  className={styles.imageRemove}
                  onClick={() => onRemoveImage(index)}
                  aria-label={`이미지 ${index + 1} 삭제`}
                >
                  <Icon name="close-circle-fill" size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputContainer}>
        {disabled ? (
          <span className={styles.cameraBtnDisabled} aria-hidden="true">
            <Icon name="camera" size={24} className={styles.cameraIconDisabled} />
          </span>
        ) : (
          <button
            type="button"
            className={styles.cameraBtn}
            onClick={onImageClick}
            aria-label="이미지 첨부"
          >
            <Icon name="camera" size={24} />
          </button>
        )}

        <textarea
          ref={setRef}
          className={clsx(styles.field, styles.textarea, disabled && styles.fieldDisabled)}
          value={value}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          rows={1}
        />

        <button
          type="button"
          className={clsx(styles.sendBtn, canSend && styles.sendBtnActive)}
          disabled={!canSend}
          onClick={onSend}
          aria-label="전송"
        >
          전송
        </button>
      </div>
    </div>
  );
}
