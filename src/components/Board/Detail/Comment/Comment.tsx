import { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/router";

import Loader from "@/components/Layout/Loader/Loader";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import TextField from "@/components/common/Input/TextField/TextField";
import type { TextFieldHandle } from "@/components/common/Input/TextField/TextField.types";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Empty from "@/components/common/Empty/Empty";
import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";

import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useToast } from "@/hooks/useToast";
import { useModalStore } from "@/states/modalStore";
import { useReportModal } from "@/hooks/useReportModal";

import { timeAgo } from "@/utils/timeAgo";

import {
  useGetPostsComments,
  ParentPostCommentResponse,
} from "@/api/posts-comments/getPostsComments";
import { usePostsCommentCreateMutation } from "@/queries/posts-comments/usePostsCommentCreateMutation";
import { usePostsCommentDeleteMutation } from "@/queries/posts-comments/usePostsCommentDeleteMutation";
import { usePostsCommentLikeMutation } from "@/queries/posts-comments/usePostsCommentLikeMutation";
import { PostCommentProps, PostCommentWriter } from "./Comment.types";

import styles from "./Comment.module.scss";
import { CONFIG } from "@/config";

const COMMENT_MAX_COUNT = 1000;

type ToastType = "success" | "error" | "warning" | "information";

/** 답글 입력창이 붙는 위치와, 멘션 대상이 되는 작성자 */
interface ReplyTarget {
  /** 답글이 매달릴 최상위 댓글 id */
  parentId: string;
  /** 답글달기를 누른 댓글 id (최상위 댓글 또는 답글) */
  commentId: string;
  writer: PostCommentWriter;
  /** 답글에 다는 답글이면 true */
  isChild: boolean;
}

interface ReplyInputProps {
  mentionName: string;
  replyText: string;
  onReplyTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoggedIn: boolean;
  replyInputRef: React.RefObject<TextFieldHandle | null>;
  showToast: (message: string, type: ToastType) => void;
  handleReplySubmit: () => void;
}

const ReplyInput = memo(
  ({
    mentionName,
    replyText,
    onReplyTextChange,
    onKeyDown,
    isLoggedIn,
    replyInputRef,
    showToast,
    handleReplySubmit,
  }: ReplyInputProps) => (
    <div className={styles.replyInput}>
      <TextField
        ref={replyInputRef}
        size="sm"
        className={styles.field}
        prefix={<span className={styles.mentionTag}>@{mentionName}</span>}
        placeholder={isLoggedIn ? "답글을 입력해주세요" : "회원만 답글 달 수 있어요!"}
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
      <SolidButton
        size="regular"
        onClick={handleReplySubmit}
        disabled={!isLoggedIn || !replyText.trim()}
      >
        등록
      </SolidButton>
    </div>
  ),
);

ReplyInput.displayName = "ReplyInput";

export default function PostComment({ postId, postWriterId, commentCount }: PostCommentProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { isMobile } = useDeviceStore();
  const { showToast } = useToast();
  const openModal = useModalStore((state) => state.openModal);
  const openReportModal = useReportModal();
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const replyInputRef = useRef<TextFieldHandle>(null);
  const {
    data: commentsData,
    isLoading,
    refetch: refetchComments,
  } = useGetPostsComments({ postId });
  const { mutateAsync: postComment, isPending: isPostCommentPending } =
    usePostsCommentCreateMutation();
  const { mutateAsync: deleteComment } = usePostsCommentDeleteMutation();
  const { mutate: toggleCommentLike } = usePostsCommentLikeMutation();
  const { pathname } = useRouter();

  useEffect(() => {
    refetchComments();
  }, [pathname, refetchComments]);

  const handleLikeClick = (commentId: string, isLiked: boolean) => {
    if (!isLoggedIn) {
      showToast("회원만 좋아요를 할 수 있어요!", "error");
      return;
    }

    toggleCommentLike(
      { postId, commentId, isLiked },
      {
        onError: () => {
          showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
        },
      },
    );
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };

  const closeReply = () => {
    setReplyTarget(null);
    setReplyText("");
  };

  /**
   * 최상위 댓글과 답글 모두 같은 입력창을 쓴다.
   * 입력창은 항상 해당 스레드 맨 아래에 열리고, 누른 댓글의 작성자가 멘션된다.
   */
  const handleReplyClick = (
    commentId: string,
    parentId: string,
    writer: PostCommentWriter | null,
    isChild: boolean,
  ) => {
    if (!writer) {
      showToast("삭제된 댓글에는 답글을 달 수 없습니다.", "error");
      return;
    }

    if (replyTarget?.commentId === commentId) {
      closeReply();
      return;
    }

    setReplyTarget({ commentId, parentId, writer, isChild });
    setReplyText("");
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 0);
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
        onClick: async () => {
          try {
            await deleteComment({ postId, commentId: id });
            showToast("댓글이 삭제되었습니다.", "success");
            refetchComments();
          } catch (error) {
            showToast("댓글 삭제에 실패했습니다.", "error");
          }
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
    if (!isLoggedIn || !replyText.trim() || !replyTarget) return;

    try {
      await postComment({
        postId,
        content: replyText,
        parentCommentId: replyTarget.parentId,
        mentionedUserId: replyTarget.isChild ? replyTarget.writer.id : undefined,
      });
      closeReply();
      refetchComments();
    } catch (error) {
      showToast("답글 작성에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setReplyTarget(null);
        setReplyText("");
        setOpenMenuId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleReplyEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleReplySubmit();
    }
  };

  const handleCommentEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const getMenuItems = (
    writer: PostCommentWriter | null,
    commentId: string,
    onReply: () => void,
  ): MenuItem[] => {
    if (!writer) return [];

    const items: MenuItem[] = [{ label: "답글달기", onClick: onReply }];

    if (writer.id === user_id) {
      items.push({ label: "삭제하기", onClick: () => handleCommentDelete(commentId) });
    } else if (isLoggedIn) {
      items.push({ label: "신고하기", onClick: () => handleReport(writer.id) });
    }

    return items;
  };

  if (isLoading) return <Loader />;

  const renderChildComments = (
    childComments: ParentPostCommentResponse["childComments"],
    parentCommentId: string,
  ) => {
    return (
      <div className={styles.childList}>
        {childComments.map((reply) => {
          const handleReply = () => handleReplyClick(reply.id, parentCommentId, reply.writer, true);

          return (
            <UserItem
              key={reply.id}
              type={isMobile ? "commentPlusxs" : "commentPlus"}
              nickname={reply.writer?.name ?? "(탈퇴한 유저)"}
              timeCount={timeAgo(reply.createdAt)}
              commentText={reply.content}
              mentionName={reply.mentionedUser?.name}
              likeCount={String(reply.likeCount)}
              isLiked={reply.isLike}
              profileImage={
                reply.writer ? `${CONFIG.ENV.IMAGE_URL}/${reply.writer.image}` : undefined
              }
              isAuthor={reply.writer?.id === postWriterId}
              onLikeClick={() => handleLikeClick(reply.id, reply.isLike)}
              onReplyClick={handleReply}
              menuItems={getMenuItems(reply.writer, reply.id, handleReply)}
              menuOpen={openMenuId === reply.id}
              onMenuOpenChange={(open) => setOpenMenuId(open ? reply.id : null)}
              menuDisplayMode={isMobile ? "bottomSheet" : "menu"}
            />
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

    const handleReply = () => handleReplyClick(comment.id, comment.id, comment.writer, false);

    return (
      <div key={comment.id} className={styles.commentRow}>
        <UserItem
          type={isMobile ? "commentxs" : "comment"}
          nickname={comment.writer?.name ?? "(탈퇴한 유저)"}
          timeCount={timeAgo(comment.createdAt)}
          commentText={comment.content}
          likeCount={String(comment.likeCount)}
          isLiked={comment.isLike}
          profileImage={
            comment.writer ? `${CONFIG.ENV.IMAGE_URL}/${comment.writer.image}` : undefined
          }
          isAuthor={comment.writer?.id === postWriterId}
          onLikeClick={() => handleLikeClick(comment.id, comment.isLike)}
          onReplyClick={handleReply}
          menuItems={getMenuItems(comment.writer, comment.id, handleReply)}
          menuOpen={openMenuId === comment.id}
          onMenuOpenChange={(open) => setOpenMenuId(open ? comment.id : null)}
          menuDisplayMode={isMobile ? "bottomSheet" : "menu"}
        />

        {comment.childComments.length > 0 && renderChildComments(comment.childComments, comment.id)}

        {replyTarget?.parentId === comment.id && (
          <ReplyInput
            mentionName={replyTarget.writer.name}
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

  const comments = commentsData?.comments ?? [];
  const totalCommentCount = commentCount ?? commentsData?.commentCount ?? 0;

  return (
    <div className={styles.container}>
      <section className={styles.inputSection}>
        <div className={styles.titleRow}>
          <span className={styles.title}>댓글</span>
          <span className={styles.count}>{totalCommentCount}</span>
        </div>
        <div className={styles.inputRow}>
          <TextField
            size={isMobile ? "sm" : "md"}
            className={styles.field}
            placeholder={isLoggedIn ? "댓글을 입력해주세요" : "회원만 댓글 달 수 있어요!"}
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
          <SolidButton
            size={isMobile ? "regular" : "large"}
            onClick={handleCommentSubmit}
            disabled={!isLoggedIn || !comment.trim()}
          >
            등록
          </SolidButton>
        </div>
      </section>
      {comments.length === 0 ? (
        <div className={styles.emptyWrap}>
          <Empty
            size="xl"
            iconName="illust-replay"
            title="아직 댓글이 없어요"
            content="댓글을 써서 생각을 나눠보세요!"
          />
        </div>
      ) : (
        <section className={styles.list}>
          {comments.map((comment) => renderComment(comment))}
        </section>
      )}
    </div>
  );
}
