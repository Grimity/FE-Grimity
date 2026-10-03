import { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/router";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import { useModal } from "@/hooks/useModal";
import Alert from "@/components/common/PopUp/Alert/Alert";
import { useReportModal } from "@/hooks/useReportModal";

import { timeAgo } from "@/utils/timeAgo";
import { linkifyText } from "@/utils/linkifyText";

import {
  useGetFeedsComments,
  ParentFeedCommentResponse,
} from "@/api/feeds-comments/getFeedComments";
import { usePostFeedsComments } from "@/api/feeds-comments/postFeedComments";
import { deleteComments } from "@/api/feeds-comments/deleteFeedComment";
import { useFeedsCommentLikeMutation } from "@/queries/feeds-comments/useFeedsCommentLikeMutation";
import type { CommentProps, CommentWriter } from "./Comment.types";

import styles from "./Comment.module.scss";

const COMMENT_MAX_COUNT = 1000;

// 댓글 본문 내 URL을 클릭 가능한 링크로 렌더한다(linkifyText가 DOMPurify로 살균).
const renderCommentText = (text: string) => (
  <span dangerouslySetInnerHTML={{ __html: linkifyText(text) }} />
);

type ToastType = "success" | "error" | "warning" | "information";

/** 답글 입력창이 붙는 위치와, 멘션 대상이 되는 작성자 */
interface ReplyTarget {
  /** 답글이 매달릴 최상위 댓글 id */
  parentId: string;
  /** 답글달기를 누른 댓글 id (최상위 댓글 또는 답글) */
  commentId: string;
  writer: CommentWriter;
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

interface CommentInputProps {
  isLoggedIn: boolean;
  isMobile: boolean;
  isPending: boolean;
  showToast: (message: string, type: ToastType) => void;
  /** 성공 시 true를 반환하면 입력창을 비운다. */
  onSubmit: (content: string) => Promise<boolean>;
}

// 입력 state를 자체 소유해, 타이핑이 댓글 목록 전체를 리렌더시키지 않도록 격리한다.
const CommentInput = memo(
  ({ isLoggedIn, isMobile, isPending, showToast, onSubmit }: CommentInputProps) => {
    const [value, setValue] = useState("");

    const submit = async () => {
      if (isPending || !isLoggedIn || !value.trim()) return;
      const ok = await onSubmit(value);
      if (ok) setValue("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    };

    return (
      <div className={styles.inputRow}>
        <TextField
          size={isMobile ? "sm" : "md"}
          className={styles.field}
          placeholder={isLoggedIn ? "댓글을 입력해주세요" : "회원만 댓글 달 수 있어요!"}
          value={value}
          maxCount={COMMENT_MAX_COUNT}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            if (!isLoggedIn) showToast("회원만 댓글 달 수 있어요!", "error");
          }}
          onKeyDown={handleKeyDown}
        />
        <SolidButton
          size={isMobile ? "regular" : "large"}
          onClick={submit}
          disabled={!isLoggedIn || !value.trim()}
        >
          등록
        </SolidButton>
      </div>
    );
  },
);

CommentInput.displayName = "CommentInput";

export default function Comment({ feedId, feedWriterId, commentCount }: CommentProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { isMobile } = useDeviceStore();
  const { showToast } = useToast();
  const { openModal: openDsModal } = useModal();
  const openReportModal = useReportModal();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const replyInputRef = useRef<TextFieldHandle>(null);
  const {
    data: commentsData,
    isLoading,
    refetch: refetchComments,
  } = useGetFeedsComments({ feedId });
  const { mutateAsync: postComment, isPending: isPostCommentPending } = usePostFeedsComments();
  const { mutate: likeComment } = useFeedsCommentLikeMutation();
  const { mutate: deleteComment } = useMutation({
    mutationFn: deleteComments,
    onSuccess: () => {
      showToast("댓글이 삭제되었습니다.", "success");
      refetchComments();
      // 상세 헤더/리액션바의 댓글 수(details.commentCount) 갱신
      queryClient.invalidateQueries({ queryKey: ["details", feedId] });
    },
    onError: () => {
      showToast("댓글 삭제에 실패했습니다.", "error");
    },
  });
  const router = useRouter();

  const handleLikeClick = (commentId: string, isLiked: boolean) => {
    if (!isLoggedIn) {
      showToast("회원만 좋아요를 할 수 있어요!", "error");
      return;
    }

    likeComment({ feedId, commentId, isLiked });
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
    writer: CommentWriter,
    isChild: boolean,
  ) => {
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

    openReportModal({ refType: "FEED_COMMENT", refId: id });
  };

  const handleCommentDelete = (id: string) => {
    setOpenMenuId(null);

    openDsModal((close) => (
      <Alert
        variant="content"
        size="xl"
        title="댓글을 삭제하시겠어요?"
        contentText="삭제한 댓글은 복구할 수 없어요"
        secondaryLabel="취소"
        onSecondary={close}
        primaryLabel="삭제"
        onPrimary={() => {
          close();
          deleteComment(id);
        }}
      />
    ));
  };

  const handleCommentSubmit = async (content: string): Promise<boolean> => {
    if (isPostCommentPending || !isLoggedIn || !content.trim()) return false;

    try {
      await postComment({ feedId, content });
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ["details", feedId] });
      return true;
    } catch {
      showToast("댓글 작성에 실패했습니다.", "error");
      return false;
    }
  };

  const handleReplySubmit = async () => {
    if (isPostCommentPending) return;
    if (!isLoggedIn || !replyText.trim() || !replyTarget) return;

    try {
      await postComment({
        feedId,
        content: replyText,
        parentCommentId: replyTarget.parentId,
        mentionedUserId: replyTarget.isChild ? replyTarget.writer.id : undefined,
      });
      closeReply();
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ["details", feedId] });
    } catch {
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

  const handleEnterKeyDown =
    (submit: () => void) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing) return;

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    };

  const getMenuItems = (
    writer: CommentWriter,
    commentId: string,
    onReply: () => void,
  ): MenuItem[] => {
    const items: MenuItem[] = [{ label: "답글달기", onClick: onReply }];

    if (writer.id === user_id) {
      items.push({ label: "삭제하기", onClick: () => handleCommentDelete(commentId), danger: true });
    } else if (isLoggedIn) {
      items.push({ label: "신고하기", onClick: () => handleReport(writer.id), danger: true });
    }

    return items;
  };

  if (isLoading) return <Loader />;

  const renderChildComments = (
    childComments: ParentFeedCommentResponse["childComments"],
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
              nickname={reply.writer.name}
              timeCount={timeAgo(reply.createdAt)}
              commentText={renderCommentText(reply.content)}
              mentionName={reply.mentionedUser?.name}
              likeCount={String(reply.likeCount)}
              isLiked={reply.isLike}
              profileImage={reply.writer.image ?? undefined}
              isAuthor={reply.writer.id === feedWriterId}
              onLikeClick={() => handleLikeClick(reply.id, reply.isLike)}
              onReplyClick={handleReply}
              onProfileClick={() => router.push(`/${reply.writer.url}`)}
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

  const renderComment = (comment: ParentFeedCommentResponse) => {
    const handleReply = () => handleReplyClick(comment.id, comment.id, comment.writer, false);

    return (
      <div key={comment.id} className={styles.commentRow}>
        <UserItem
          type={isMobile ? "commentxs" : "comment"}
          nickname={comment.writer.name}
          timeCount={timeAgo(comment.createdAt)}
          commentText={renderCommentText(comment.content)}
          likeCount={String(comment.likeCount)}
          isLiked={comment.isLike}
          profileImage={comment.writer.image ?? undefined}
          isAuthor={comment.writer.id === feedWriterId}
          onLikeClick={() => handleLikeClick(comment.id, comment.isLike)}
          onReplyClick={handleReply}
          onProfileClick={() => router.push(`/${comment.writer.url}`)}
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
            onKeyDown={handleEnterKeyDown(handleReplySubmit)}
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
  // 피드 응답에는 commentCount 필드가 없어, 호출부(Detail.tsx)가 넘긴 값을 우선 쓰고
  // 없으면 로드된 데이터(댓글 + 답글)로 폴백 계산한다.
  const totalCommentCount =
    commentCount ??
    comments.reduce((sum, c) => sum + 1 + (c.childComments?.length ?? 0), 0);

  return (
    <div className={styles.container}>
      <section className={styles.inputSection}>
        <div className={styles.titleRow}>
          <span className={styles.title}>댓글</span>
          <span className={styles.count}>{totalCommentCount}</span>
        </div>
        <CommentInput
          isLoggedIn={isLoggedIn}
          isMobile={isMobile}
          isPending={isPostCommentPending}
          showToast={showToast}
          onSubmit={handleCommentSubmit}
        />
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
