import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./DmInput.module.scss";
import type { DmInputProps } from "./DmInput.types";

const PLACEHOLDER_TEXT: Record<string, string> = {
  Default: "메시지 입력",
  Focused: "아 네!",
  Filled: "아 네! ㅎㅎ 감사합니다",
  Filled_log:
    "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요. 감사합니다.",
  Disabled: "더 이상 채팅이 불가능해요",
  Answer: "넵!ㅎㅎ",
};

export default function DmInput({
  type = "Default",
  value,
  replyText,
  replyTarget,
  onCancelReply,
  onChange,
  onSend,
  onImageClick,
  className,
}: DmInputProps) {
  const isDisabled = type === "Disabled";
  const isActive = ["Focused", "Filled", "Filled_log", "Answer"].includes(type);
  const isAnswer = type === "Answer";
  const isFilledLog = type === "Filled_log";
  const displayValue = value ?? PLACEHOLDER_TEXT[type] ?? "";
  const isEmpty = type === "Default";

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.divider} />

      {isAnswer && (
        <div className={styles.replyContainer}>
          <div className={styles.replyHeader}>
            <Icon name="reply-2" size={16} className={styles.replyIcon} />
            <span className={styles.replyTarget}>
              {replyTarget ? `${replyTarget}님에게 답장` : "[user]님에게 답장"}
            </span>
          </div>
          <p className={styles.replyPreviewText}>
            {replyText ?? "감사합니다. 이 부분도 1줄만 노출되고 길게 나오면 말줄임표를 해주세요."}
          </p>
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

      <div className={styles.inputContainer}>
        {!isDisabled && (
          <button
            type="button"
            className={styles.cameraBtn}
            onClick={onImageClick}
            aria-label="이미지 첨부"
          >
            <Icon name="camera" size={24} />
          </button>
        )}

        {isDisabled && (
          <span className={styles.cameraBtnDisabled} aria-hidden="true">
            <Icon name="camera" size={24} className={styles.cameraIconDisabled} />
          </span>
        )}

        {isFilledLog ? (
          <textarea
            className={clsx(styles.textarea, styles.field)}
            value={displayValue}
            disabled={isDisabled}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="메시지 입력"
            rows={1}
          />
        ) : (
          <input
            type="text"
            className={clsx(
              styles.textField,
              styles.field,
              isDisabled && styles.fieldDisabled,
            )}
            value={isEmpty ? "" : displayValue}
            placeholder={isEmpty ? displayValue : undefined}
            disabled={isDisabled}
            readOnly={!onChange}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}

        <button
          type="button"
          className={clsx(styles.sendBtn, isActive && styles.sendBtnActive)}
          disabled={isDisabled || isEmpty}
          onClick={onSend}
          aria-label="전송"
        >
          전송
        </button>
      </div>
    </div>
  );
}
