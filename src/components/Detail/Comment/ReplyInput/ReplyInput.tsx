import React, { forwardRef } from "react";

import SolidButton from "@/components/common/Button/SolidButton/SolidButton";

import styles from "@/components/Detail/Comment/Comment.module.scss";

type ToastType = "success" | "error" | "warning" | "information";

interface ReplyInputProps {
  mentionName?: string;
  replyText: string;
  onReplyTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoggedIn: boolean;
  showToast: (message: string, type: ToastType) => void;
  handleReplySubmit: () => void;
}

const ReplyInput = forwardRef<HTMLInputElement, ReplyInputProps>(
  (
    { mentionName, replyText, onReplyTextChange, onKeyDown, isLoggedIn, showToast, handleReplySubmit },
    ref,
  ) => {
    return (
      <div className={styles.input}>
        <label className={styles.replyField}>
          {mentionName && <span className={styles.replyMention}>@{mentionName}</span>}
          <input
            ref={ref}
            className={styles.replyInput}
            placeholder={isLoggedIn ? "답글을 입력해주세요" : "회원만 답글 달 수 있어요!"}
            value={replyText}
            onChange={onReplyTextChange}
            onKeyDown={onKeyDown}
            onFocus={() => {
              if (!isLoggedIn) {
                showToast("회원만 답글 달 수 있어요!", "error");
              }
            }}
          />
        </label>
        <SolidButton
          size="regular"
          onClick={handleReplySubmit}
          disabled={!isLoggedIn || !replyText.trim()}
        >
          등록
        </SolidButton>
      </div>
    );
  },
);

ReplyInput.displayName = "ReplyInput";

export default ReplyInput;
