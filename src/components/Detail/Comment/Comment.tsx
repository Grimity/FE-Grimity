import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usePostFeedsComments } from "@/api/feeds-comments/postFeedComments";
import {
  useGetFeedsComments,
  ParentFeedCommentResponse,
} from "@/api/feeds-comments/getFeedComments";
import { useMyData } from "@/api/users/getMe";
import { deleteComments } from "@/api/feeds-comments/deleteFeedComment";
import { deleteCommentLike, putCommentLike } from "@/api/feeds-comments/putDeleteCommentsLike";

import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";
import { useReportModal } from "@/hooks/useReportModal";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";

import Loader from "@/components/Layout/Loader/Loader";
import Icon from "@/components/common/Icon/Icon";
import Menu from "@/components/common/Navigation/Menu/Menu";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import ReplyInput from "@/components/Detail/Comment/ReplyInput/ReplyInput";
import CommentInput from "@/components/Detail/Comment/CommentInput/CommentInput";

import { timeAgo } from "@/utils/timeAgo";
import { linkifyText } from "@/utils/linkifyText";

import type { CommentProps, CommentWriter } from "@/components/Detail/Comment/Comment.types";

import styles from "@/components/Detail/Comment/Comment.module.scss";

export default function Comment({
  feedId,
  feedWriterId,
  commentCount: commentCountProp,
  isFollowingPage,
}: CommentProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { isLoading } = useMyData();
  const { showToast } = useToast();
  const openModal = useModalStore((state) => state.openModal);
  const openReportModal = useReportModal();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  // 루트 댓글 스레드당 답글 상태 하나만: commentId=답글 대상, rootId=부모, mention=멘션 대상
  const [activeReply, setActiveReply] = useState<{
    commentId: string;
    rootId: string;
    mention: CommentWriter | null;
  } | null>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const { data: commentsData, refetch: refetchComments } = useGetFeedsComments({
    feedId,
  });
  const { mutateAsync: postComment, isPending: isPostCommentLoading } = usePostFeedsComments();
  const { isMobile } = useDeviceStore();
  const { pathname } = useRouter();

  const commentCount =
    commentCountProp ??
    (commentsData?.comments?.reduce(
      (sum, comment) => sum + 1 + (comment.childComments?.length ?? 0),
      0,
    ) ??
      0);

  useEffect(() => {
    refetchComments();
  }, [pathname, refetchComments]);

  const { mutate: deleteComment } = useMutation({
    mutationFn: deleteComments,
    onSuccess: () => {
      showToast("댓글이 삭제되었습니다.", "success");
      refetchComments();
    },
    onError: () => {
      showToast("댓글 삭제에 실패했습니다.", "error");
    },
  });

  const handleCommentSubmitSuccess = () => {
    refetchComments();
  };

  const handleLikeClick = async (commentId: string, currentIsLike: boolean) => {
    if (!isLoggedIn) {
      showToast("회원만 좋아요를 할 수 있어요!", "error");
      return;
    }

    try {
      if (currentIsLike) {
        await deleteCommentLike(commentId);
      } else {
        await putCommentLike(commentId);
      }

      queryClient.invalidateQueries({ queryKey: ["getFeedsComments", feedId] });
    } catch (error) {
      showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };

  // 답글 열기/토글. commentId=답글 대상, rootId=부모(최상위) id.
  // 루트 댓글에 다는 답글은 멘션 없음, 자식 댓글에 다는 답글은 그 작성자를 멘션.
  const openReply = (
    commentId: string,
    rootId: string,
    writer: { id: string; name: string; url: string; image: string } | null,
  ) => {
    if (!writer) {
      showToast("삭제된 댓글에는 답글을 달 수 없습니다.", "error");
      return;
    }

    setReplyText("");

    if (activeReply?.commentId === commentId) {
      setActiveReply(null);
      return;
    }

    setActiveReply({
      commentId,
      rootId,
      mention: commentId === rootId ? null : writer,
    });
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 0);
  };

  const handleReport = (id?: string) => {
    if (!id) {
      showToast("신고할 대상을 찾을 수 없습니다.", "error");
      return;
    }

    openReportModal({ refType: "FEED_COMMENT", refId: id });
  };

  const handleCommentDelete = async (id: string) => {
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

  const handleReplySubmit = async () => {
    if (isPostCommentLoading) return;
    if (!isLoggedIn || !replyText.trim() || !activeReply) return;

    try {
      await postComment({
        feedId,
        content: replyText,
        parentCommentId: activeReply.rootId,
        mentionedUserId: activeReply.mention?.id,
      });
      setReplyText("");
      setActiveReply(null);
      refetchComments();
    } catch (error) {
      showToast("답글 작성에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveReply(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleReplySubmit();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const renderCommentMenu = (commentId: string, writerId: string) => {
    if (!isLoggedIn) return null;

    return (
      <Menu
        align="right"
        wrapperClassName={styles.menuWrapper}
        trigger={
          <IconButton
            variant="sm"
            icon={<Icon name="dotmenu" size={24} color="gray-bold" />}
            aria-label="더보기"
          />
        }
        items={
          writerId === user_id
            ? [{ label: "삭제하기", onClick: () => handleCommentDelete(commentId) }]
            : [{ label: "신고하기", onClick: () => handleReport(writerId) }]
        }
      />
    );
  };

  const renderCommentItem = ({
    id,
    writer,
    content,
    createdAt,
    isLike,
    likeCount,
    mentionedUser,
    isChild,
    isReplyActive,
    onReply,
    children,
  }: {
    id: string;
    writer: { id: string; name: string; url: string; image: string | null };
    content: string;
    createdAt: string | Date;
    isLike: boolean;
    likeCount: number;
    mentionedUser?: { name: string } | null;
    isChild: boolean;
    isReplyActive: boolean;
    onReply: () => void;
    children?: React.ReactNode;
  }) => {
    const isFeedWriter = writer.id === feedWriterId;

    const commentContent = isChild ? (
      <span className={styles.commentContentBody}>
        {mentionedUser && (
          <span className={styles.mentionedUser}>@{mentionedUser.name}</span>
        )}
        <span dangerouslySetInnerHTML={{ __html: linkifyText(content) }} />
      </span>
    ) : (
      <span
        className={styles.commentContentBody}
        dangerouslySetInnerHTML={{ __html: linkifyText(content) }}
      />
    );

    return (
      <>
        <UserItem
          type={
            isChild
              ? isMobile
                ? "commentPlusxs"
                : "commentPlus"
              : isMobile
                ? "commentxs"
                : "comment"
          }
          profileImage={writer.image ?? undefined}
          nickname={<Link href={`/${writer.url}`}>{writer.name}</Link>}
          isAuthor={isFeedWriter}
          timeCount={timeAgo(createdAt)}
          commentContent={commentContent}
          likeCount={String(likeCount)}
          likeActive={isLike}
          onLikeClick={() => handleLikeClick(id, isLike)}
          replyLabel={isReplyActive ? "취소" : "답글달기"}
          onReplyClick={onReply}
          menu={renderCommentMenu(id, writer.id)}
        />
        {children}
      </>
    );
  };

  const renderChildComments = (
    childComments: ParentFeedCommentResponse["childComments"],
    parentCommentId: string,
  ) => {
    return (
      <div className={styles.childComments}>
        {childComments.map((reply) => (
          <div key={reply.id} className={styles.comment}>
            {renderCommentItem({
              id: reply.id,
              writer: reply.writer,
              content: reply.content,
              createdAt: reply.createdAt,
              isLike: reply.isLike,
              likeCount: reply.likeCount,
              mentionedUser: reply.mentionedUser,
              isChild: true,
              isReplyActive: activeReply?.commentId === reply.id,
              onReply: () =>
                openReply(reply.id, parentCommentId, {
                  id: reply.writer.id,
                  name: reply.writer.name,
                  url: reply.writer.url,
                  image: reply.writer.image || "/image/default.svg",
                }),
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderComment = (comment: ParentFeedCommentResponse) => {
    return (
      <div key={comment.id} className={styles.comment}>
        {renderCommentItem({
          id: comment.id,
          writer: comment.writer,
          content: comment.content,
          createdAt: comment.createdAt,
          isLike: comment.isLike,
          likeCount: comment.likeCount,
          isChild: false,
          isReplyActive: activeReply?.commentId === comment.id,
          onReply: () =>
            openReply(comment.id, comment.id, {
              id: comment.writer.id,
              name: comment.writer.name,
              url: comment.writer.url,
              image: comment.writer.image || "/image/default.svg",
            }),
          children: (
            <>
              {comment.childComments.length > 0 && (
                <div className={styles.viewReplies}>
                  {renderChildComments(comment.childComments, comment.id)}
                </div>
              )}
              {activeReply?.rootId === comment.id && (
                <div className={styles.replyInputWrap}>
                  <ReplyInput
                    mentionName={activeReply.mention?.name}
                    replyText={replyText}
                    onReplyTextChange={handleReplyTextChange}
                    onKeyDown={handleEnterKeyDown}
                    isLoggedIn={isLoggedIn}
                    ref={replyInputRef}
                    showToast={showToast}
                    handleReplySubmit={handleReplySubmit}
                  />
                </div>
              )}
            </>
          ),
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.commentHeader}>
        댓글 <span className={styles.commentCount}>{commentCount}</span>
      </h2>
      {!isFollowingPage && (
        <CommentInput
          feedId={feedId}
          isLoggedIn={isLoggedIn}
          showToast={showToast}
          onCommentSubmitSuccess={handleCommentSubmitSuccess}
        />
      )}
      <section>{commentsData?.comments?.map((comment) => renderComment(comment))}</section>
    </div>
  );
}
