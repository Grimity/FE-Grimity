import { useState } from "react";

import { usePostFeedsComments } from "@/api/feeds-comments/postFeedComments";

import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import TextField from "@/components/common/Input/TextField/TextField";

import styles from "./CommentInput.module.scss";

interface CommentInputProps {
  feedId: string;
  isLoggedIn: boolean;
  showToast: (message: string, type: "error" | "success") => void;
  onCommentSubmitSuccess?: () => void;
}

export default function CommentInput({
  feedId,
  isLoggedIn,
  showToast,
  onCommentSubmitSuccess,
}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const { mutateAsync: postComment, isPending: isPostCommentPending } = usePostFeedsComments();

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (isPostCommentPending) return;

    if (!isLoggedIn || !comment.trim()) return;

    try {
      await postComment({
        feedId,
        content: comment,
      });

      setComment("");
      if (onCommentSubmitSuccess) {
        onCommentSubmitSuccess();
      }
    } catch (error) {
      showToast("댓글 작성에 실패했습니다.", "error");
    }
  };

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <section className={styles.inputContainer}>
      <TextField
        className={styles.field}
        placeholder={isLoggedIn ? "댓글을 입력해주세요" : "회원만 댓글 달 수 있어요!"}
        value={comment}
        onChange={handleCommentChange}
        onKeyDown={handleEnterKeyDown}
        onFocus={() => {
          if (!isLoggedIn) {
            showToast("회원만 댓글 달 수 있어요!", "error");
          }
        }}
      />
      <SolidButton
        size="large"
        onClick={handleCommentSubmit}
        disabled={!isLoggedIn || !comment.trim()}
      >
        등록
      </SolidButton>
    </section>
  );
}
