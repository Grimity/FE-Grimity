import { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Loader from "@/components/Layout/Loader/Loader";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import TextArea from "@/components/common/Input/TextArea/TextArea";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Menu from "@/components/common/Navigation/Menu/Menu";
import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";

import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useToast } from "@/hooks/useToast";
import { useModalStore } from "@/states/modalStore";
import { useReportModal } from "@/hooks/useReportModal";

import { timeAgo } from "@/utils/timeAgo";

import {
  deletePostsCommentLike,
  putPostsCommentLike,
} from "@/api/posts-comments/putDeletePostsCommentsLike";
import { deletePostsComments } from "@/api/posts-comments/deletePostsComment";
import { usePostPostsComments } from "@/api/posts-comments/postPostsComments";
import {
  useGetPostsComments,
  ParentPostCommentResponse,
} from "@/api/posts-comments/getPostsComments";
import { PostCommentProps, PostCommentWriter } from "./Comment.types";

import styles from "./Comment.module.scss";

const COMMENT_MAX_COUNT = 1000;

type ToastType = "success" | "error" | "warning" | "information";

interface ReplyInputProps {
  isChildReply?: boolean;
  replyText: string;
  onReplyTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoggedIn: boolean;
  replyInputRef: React.RefObject<HTMLTextAreaElement | null>;
  showToast: (message: string, type: ToastType) => void;
  handleReplySubmit: () => void;
}

const ReplyInput = memo(
  ({
    isChildReply = false,
    replyText,
    onReplyTextChange,
    onKeyDown,
    isLoggedIn,
    replyInputRef,
    showToast,
    handleReplySubmit,
  }: ReplyInputProps) => (
    <div className={`${styles.replyInput} ${isChildReply ? styles.childReplyInput : ""}`}>
      <TextArea
        ref={replyInputRef}
        variant="sm"
        placeholder={isLoggedIn ? "답글 달기" : "회원만 답글 달 수 있어요!"}
        value={replyText}
        maxCount={COMMENT_MAX_COUNT}
        onChange={onReplyTextChange}
        onKeyDown={onKeyDown}
        onFocus={() => {
          if (!isLoggedIn) {
            showToast("회원만 답글 달 수 있어요!", "error");
          }
        }}
      />
      <div className={styles.submitBtn}>
        <SolidButton size="small" onClick={handleReplySubmit} disabled={!isLoggedIn}>
          답글
        </SolidButton>
      </div>
    </div>
  ),
);

ReplyInput.displayName = "ReplyInput";

export default function PostComment({ postId, postWriterId }: PostCommentProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { isMobile } = useDeviceStore();
  const { showToast } = useToast();
  const openModal = useModalStore((state) => state.openModal);
  const openReportModal = useReportModal();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [mentionedUser, setMentionedUser] = useState<PostCommentWriter | null>(null);
  const [isReplyToChild, setIsReplyToChild] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    data: commentsData,
    isLoading,
    refetch: refetchComments,
  } = useGetPostsComments({ postId });
  const { mutateAsync: postComment, isPending: isPostCommentPending } = usePostPostsComments();
  const [activeParentReplyId, setActiveParentReplyId] = useState<string | null>(null);
  const [activeChildReplyId, setActiveChildReplyId] = useState<string | null>(null);
  const { pathname } = useRouter();

  useEffect(() => {
    refetchComments();
  }, [pathname, refetchComments]);

  const { mutate: deleteComment } = useMutation({
    mutationFn: deletePostsComments,
    onSuccess: () => {
      showToast("댓글이 삭제되었습니다.", "success");
      refetchComments();
    },
    onError: () => {
      showToast("댓글 삭제에 실패했습니다.", "error");
    },
  });

  const handleLikeClick = async (commentId: string, currentIsLike: boolean) => {
    if (!isLoggedIn) {
      showToast("회원만 좋아요를 할 수 있어요!", "error");
      return;
    }

    try {
      if (currentIsLike) {
        await deletePostsCommentLike(commentId);
      } else {
        await putPostsCommentLike(commentId);
      }
      queryClient.invalidateQueries({ queryKey: ["getPostsComments", postId] });
    } catch (error) {
      showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleParentReply = (commentId: string, writer: PostCommentWriter | null) => {
    if (!writer) {
      showToast("삭제된 댓글에는 답글을 달 수 없습니다.", "error");
      return;
    }

    if (activeParentReplyId === commentId && !activeChildReplyId) {
      setActiveParentReplyId(null);
      setMentionedUser(null);
      setReplyText("");
      setIsReplyToChild(false);
    } else if (!activeChildReplyId) {
      setActiveParentReplyId(commentId);
      setMentionedUser(writer);
      setReplyText("");
      setIsReplyToChild(false);
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 0);
    }
  };

  const handleChildReply = (
    commentId: string,
    parentId: string,
    writer: PostCommentWriter | null,
  ) => {
    if (!writer) {
      showToast("삭제된 댓글에는 답글을 달 수 없습니다.", "error");
      return;
    }

    if (activeChildReplyId === commentId) {
      setActiveChildReplyId(null);
      setActiveParentReplyId(null);
      setMentionedUser(null);
      setReplyText("");
      setIsReplyToChild(false);
    } else {
      setActiveChildReplyId(commentId);
      setActiveParentReplyId(parentId);
      setMentionedUser(writer);
      setReplyText("");
      setIsReplyToChild(true);
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 0);
    }
  };

  const handleReport = (id?: string) => {
    setOpenMenuId(null);

    if (!id) {
      showToast("신고할 대상을 찾을 수 없습니다.", "error");
      return;
    }

    openReportModal({ refType: "POST_COMMENT", refId: id });
  };

  const handleCommentDelete = (id: string) => {
    setOpenMenuId(null);

    openModal({
      type: null,
      data: {
        title: "댓글을 삭제하시겠어요?",
        confirmBtn: "삭제",
        onClick: () => {
          deleteComment(id);
        },
      },
      isComfirm: true,
    });
  };

  const handleCommentSubmit = async () => {
    if (isPostCommentPending) return;
    if (!isLoggedIn || !comment.trim()) return;

    try {
      await postComment({
        postId,
        content: comment,
      });
      setComment("");
      refetchComments();
    } catch (error) {
      showToast("댓글 작성에 실패했습니다.", "error");
    }
  };

  const handleReplySubmit = async () => {
    if (isPostCommentPending) return;

    if (!isLoggedIn || !replyText.trim() || !activeParentReplyId || !mentionedUser) return;

    const actualReplyContent = replyText.trim();

    if (!actualReplyContent) {
      showToast("답글 내용을 입력해주세요.", "error");
      return;
    }

    try {
      await postComment({
        postId,
        content: replyText,
        parentCommentId: activeParentReplyId,
        mentionedUserId: isReplyToChild ? mentionedUser.id : undefined,
      });
      setReplyText("");
      if (isReplyToChild) {
        setActiveChildReplyId(null);
        setActiveParentReplyId(null);
      } else {
        setActiveParentReplyId(null);
      }
      setMentionedUser(null);
      setIsReplyToChild(false);
      refetchComments();
    } catch (error) {
      showToast("답글 작성에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveChildReplyId(null);
        setActiveParentReplyId(null);
        setOpenMenuId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleReplyEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleReplySubmit();
    }
  };

  const handleCommentEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const getMenuItems = (writer: PostCommentWriter | null, commentId: string): MenuItem[] => {
    if (!writer) return [];

    if (writer.id === user_id) {
      return [{ label: "삭제하기", onClick: () => handleCommentDelete(commentId), danger: true }];
    }

    if (isLoggedIn) {
      return [{ label: "신고하기", onClick: () => handleReport(writer.id), danger: true }];
    }

    return [];
  };

  if (isLoading) return <Loader />;

  const renderChildComments = (
    childComments: ParentPostCommentResponse["childComments"],
    parentCommentId: string,
  ) => {
    return (
      <div className={styles.childList}>
        {childComments.map((reply) => {
          const menuItems = getMenuItems(reply.writer, reply.id);

          return (
            <div key={reply.id}>
              <div className={styles.menuAnchor}>
                <UserItem
                  type={isMobile ? "commentPlusxs" : "commentPlus"}
                  nickname={reply.writer?.name ?? "(탈퇴한 유저)"}
                  timeCount={timeAgo(reply.createdAt)}
                  commentText={reply.content}
                  mentionName={reply.mentionedUser?.name}
                  likeCount={String(reply.likeCount)}
                  isLiked={reply.isLike}
                  isAuthor={reply.writer?.id === postWriterId}
                  onLikeClick={() => handleLikeClick(reply.id, reply.isLike)}
                  onReplyClick={() => handleChildReply(reply.id, parentCommentId, reply.writer)}
                  onMenuClick={() => setOpenMenuId((prev) => (prev === reply.id ? null : reply.id))}
                />
                {openMenuId === reply.id && menuItems.length > 0 && (
                  <div className={styles.menuDropdown}>
                    <Menu items={menuItems} onOpenChange={(open) => !open && setOpenMenuId(null)} />
                  </div>
                )}
              </div>
              {activeChildReplyId === reply.id && activeParentReplyId === parentCommentId && (
                <ReplyInput
                  isChildReply
                  replyText={replyText}
                  onReplyTextChange={handleReplyTextChange}
                  onKeyDown={handleReplyEnterKeyDown}
                  isLoggedIn={isLoggedIn}
                  replyInputRef={replyInputRef}
                  showToast={showToast}
                  handleReplySubmit={handleReplySubmit}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderComment = (comment: ParentPostCommentResponse) => {
    if (comment.isDeleted) {
      return (
        <div key={comment.id} className={styles.commentRow}>
          <UserItem type="commentDeleted" />
        </div>
      );
    }

    const menuItems = getMenuItems(comment.writer, comment.id);

    return (
      <div key={comment.id} className={styles.commentRow}>
        <div className={styles.menuAnchor}>
          <UserItem
            type={isMobile ? "commentxs" : "comment"}
            nickname={comment.writer?.name ?? "(탈퇴한 유저)"}
            timeCount={timeAgo(comment.createdAt)}
            commentText={comment.content}
            likeCount={String(comment.likeCount)}
            isLiked={comment.isLike}
            isAuthor={comment.writer?.id === postWriterId}
            onLikeClick={() => handleLikeClick(comment.id, comment.isLike)}
            onReplyClick={() => handleParentReply(comment.id, comment.writer)}
            onMenuClick={() => setOpenMenuId((prev) => (prev === comment.id ? null : comment.id))}
          />
          {openMenuId === comment.id && menuItems.length > 0 && (
            <div className={styles.menuDropdown}>
              <Menu items={menuItems} onOpenChange={(open) => !open && setOpenMenuId(null)} />
            </div>
          )}
        </div>

        {comment.childComments.length > 0 &&
          renderChildComments(comment.childComments, comment.id)}

        {activeParentReplyId === comment.id && !isReplyToChild && (
          <ReplyInput
            replyText={replyText}
            onReplyTextChange={handleReplyTextChange}
            onKeyDown={handleReplyEnterKeyDown}
            isLoggedIn={isLoggedIn}
            replyInputRef={replyInputRef}
            showToast={showToast}
            handleReplySubmit={handleReplySubmit}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <section className={styles.inputContainer}>
        <TextArea
          placeholder={isLoggedIn ? "댓글 달기" : "회원만 댓글 달 수 있어요!"}
          value={comment}
          maxCount={COMMENT_MAX_COUNT}
          onChange={handleCommentChange}
          onFocus={() => {
            if (!isLoggedIn) {
              showToast("회원만 댓글 달 수 있어요!", "error");
            }
          }}
          onKeyDown={handleCommentEnterKeyDown}
        />
        <div className={styles.submitBtn}>
          <SolidButton onClick={handleCommentSubmit} disabled={!isLoggedIn}>
            댓글
          </SolidButton>
        </div>
      </section>
      <section className={styles.list}>
        {commentsData?.comments?.map((comment) => renderComment(comment))}
      </section>
    </div>
  );
}
