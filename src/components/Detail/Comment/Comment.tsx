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

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";

import Loader from "@/components/Layout/Loader/Loader";
import Dropdown from "@/components/Dropdown/Dropdown";
import IconComponent from "@/components/Asset/Icon";
import ReplyInput from "@/components/Detail/Comment/ReplyInput/ReplyInput";
import CommentInput from "@/components/Detail/Comment/CommentInput/CommentInput";

import { timeAgo } from "@/utils/timeAgo";
import { linkifyText } from "@/utils/linkifyText";

import type { CommentProps, CommentWriter } from "@/components/Detail/Comment/Comment.types";

import styles from "@/components/Detail/Comment/Comment.module.scss";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

export default function Comment({ feedId, feedWriterId, isFollowingPage }: CommentProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { data: userData, isLoading } = useMyData();
  const { showToast } = useToast();
  const openModal = useModalStore((state) => state.openModal);
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [mentionedUser, setMentionedUser] = useState<CommentWriter | null>(null);
  const [isReplyToChild, setIsReplyToChild] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const { data: commentsData, refetch: refetchComments } = useGetFeedsComments({
    feedId,
  });
  const { mutateAsync: postComment, isPending: isPostCommentLoading } = usePostFeedsComments();
  const [activeParentReplyId, setActiveParentReplyId] = useState<string | null>(null);
  const [activeChildReplyId, setActiveChildReplyId] = useState<string | null>(null);
  const { isMobile } = useDeviceStore();
  const { pathname } = useRouter();

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

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleParentReply = (
    commentId: string,
    writer: { id: string; name: string; url: string; image: string } | null,
  ) => {
    if (!writer) {
      showToast("삭제된 댓글에는 답글을 달 수 없습니다.", "error");
      return;
    }

    if (activeParentReplyId === commentId) {
      setActiveParentReplyId(null);
      setMentionedUser(null);
      setReplyText("");
      setIsReplyToChild(false);
    } else {
      setActiveParentReplyId(commentId);
      setActiveChildReplyId(null);
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
    parentCommentId: string,
    writer: { id: string; name: string; url: string; image: string } | null,
  ) => {
    if (!writer) {
      showToast("삭제된 댓글에는 답글을 달 수 없습니다.", "error");
      return;
    }

    if (activeChildReplyId === commentId) {
      setActiveChildReplyId(null);
      setMentionedUser(null);
      setReplyText("");
      setIsReplyToChild(false);
    } else {
      setActiveChildReplyId(commentId);
      setActiveParentReplyId(parentCommentId);
      setMentionedUser(writer);
      setReplyText("");
      setIsReplyToChild(true);
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 0);
    }
  };

  const handleReport = (id?: string) => {
    if (!id) {
      showToast("신고할 대상을 찾을 수 없습니다.", "error");
      return;
    }

    if (isMobile) {
      openModal({
        type: "REPORT",
        data: { refType: "FEED_COMMENT", refId: id },
        isFill: true,
      });
    } else {
      openModal({
        type: "REPORT",
        data: { refType: "FEED_COMMENT", refId: id },
      });
    }
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
    if (!isLoggedIn || !replyText.trim() || !mentionedUser) return;

    const actualReplyContent = replyText.trim();

    if (!actualReplyContent) {
      showToast("답글 내용을 입력해주세요.", "error");
      return;
    }

    if (!activeParentReplyId) return;

    try {
      await postComment({
        feedId,
        content: replyText,
        parentCommentId: activeParentReplyId,
        mentionedUserId: isReplyToChild ? mentionedUser.id : undefined,
      });
      setReplyText("");
      setActiveParentReplyId(null);
      setActiveChildReplyId(null);
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleReplySubmit();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const renderChildComments = (
    childComments: ParentFeedCommentResponse["childComments"],
    parentCommentId: string,
  ) => {
    return (
      <div className={styles.childComments}>
        {childComments.map((reply) => (
          <div key={reply.id} className={styles.comment}>
            <div className={styles.childCommentBox}>
              <Link href={`/${reply.writer.url}`}>
                {reply.writer.image !== null ? (
                  <ResponsiveImage
                    src={reply.writer.image}
                    width={24}
                    height={24}
                    alt="답글 프로필"
                    className={styles.writerImage}
                  />
                ) : (
                  <ResponsiveImage
                    src="/image/default.svg"
                    width={24}
                    height={24}
                    alt="답글 프로필"
                    className={styles.writerImage}
                  />
                )}
              </Link>
              <div className={styles.commentBody}>
                <div className={styles.writerReply}>
                  <div className={styles.writerLeft}>
                    <div className={styles.writerCreatedAt}>
                      <Link href={`/${reply.writer.url}`}>
                        <div className={styles.writerName}>
                          {reply.writer.name}
                          {reply.writer.id === feedWriterId && (
                            <div className={styles.feedWriter}>작성자</div>
                          )}
                        </div>
                      </Link>
                      <p className={styles.createdAt}>{timeAgo(reply.createdAt)}</p>
                    </div>
                    <div className={styles.commentText}>
                      {reply.mentionedUser && (
                        <span className={styles.mentionedUser}>@{reply.mentionedUser.name}</span>
                      )}
                      <span dangerouslySetInnerHTML={{ __html: linkifyText(reply.content) }} />
                    </div>
                    <div className={styles.likeReplyBtn}>
                      <span
                        className={reply.isLike ? styles.likeOnButton : styles.likeButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeClick(reply.id, reply.isLike);
                        }}
                      >
                        <IconComponent
                          name={reply.isLike ? "commentLikeOn" : "commentLikeOff"}
                          size={16}
                          isBtn
                        />
                        {reply.likeCount}
                      </span>
                      <p
                        onClick={() =>
                          handleChildReply(reply.id, parentCommentId, {
                            id: reply.writer.id,
                            name: reply.writer.name,
                            url: reply.writer.url,
                            image: reply.writer.image || "/image/default.svg",
                          })
                        }
                        className={styles.replyBtn}
                      >
                        {activeChildReplyId === reply.id ? "취소" : "답글"}
                      </p>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <div className={styles.replyBtnDropdown}>
                      {reply.writer.id === user_id ? (
                        <Dropdown
                          trigger={<IconComponent name="kebab" padding={8} size={24} isBtn />}
                          menuItems={[
                            {
                              label: "삭제하기",
                              onClick: () => handleCommentDelete(reply.id),
                              isDelete: true,
                            },
                          ]}
                        />
                      ) : (
                        <Dropdown
                          trigger={<IconComponent name="kebab" padding={8} size={24} isBtn />}
                          menuItems={[
                            {
                              label: "신고하기",
                              onClick: () => handleReport(reply.writer?.id),
                              isDelete: true,
                            },
                          ]}
                        />
                      )}
                    </div>
                  )}
                </div>
                {activeChildReplyId === reply.id && (
                  <ReplyInput
                    isChildReply={true}
                    replyText={replyText}
                    onReplyTextChange={handleReplyTextChange}
                    onKeyDown={handleEnterKeyDown}
                    isLoggedIn={isLoggedIn}
                    ref={replyInputRef}
                    showToast={showToast}
                    handleReplySubmit={handleReplySubmit}
                  />
                )}
                <div className={styles.bar} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderComment = (comment: ParentFeedCommentResponse) => {
    return (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentBox}>
          <Link href={`/${comment.writer.url}`}>
            {comment.writer.image !== null ? (
              <ResponsiveImage
                src={comment.writer.image}
                width={isMobile ? 24 : 40}
                height={isMobile ? 24 : 40}
                alt="댓글 프로필"
                className={styles.writerImage}
              />
            ) : (
              <ResponsiveImage
                src="/image/default.svg"
                width={isMobile ? 24 : 40}
                height={isMobile ? 24 : 40}
                alt="댓글 프로필"
                className={styles.writerImage}
              />
            )}
          </Link>
          <div className={styles.commentBody}>
            <div className={styles.writerReply}>
              <div className={styles.writerLeft}>
                <div className={styles.writerCreatedAt}>
                  <Link href={`/${comment.writer.url}`}>
                    <div className={styles.writerName}>{comment.writer.name}</div>
                  </Link>
                  {comment.writer.id === feedWriterId && (
                    <div className={styles.feedWriter}>작성자</div>
                  )}
                  <p className={styles.createdAt}>{timeAgo(comment.createdAt)}</p>
                </div>
                <div
                  className={styles.commentText}
                  dangerouslySetInnerHTML={{ __html: linkifyText(comment.content) }}
                />
                <div className={styles.likeReplyBtn}>
                  <span
                    className={comment.isLike ? styles.likeOnButton : styles.likeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(comment.id, comment.isLike);
                    }}
                  >
                    <IconComponent
                      name={comment.isLike ? "commentLikeOn" : "commentLikeOff"}
                      size={16}
                      isBtn
                    />
                    {comment.likeCount}
                  </span>
                  <p
                    onClick={() =>
                      handleParentReply(comment.id, {
                        id: comment.writer.id,
                        name: comment.writer.name,
                        url: comment.writer.url,
                        image: comment.writer.image || "/image/default.svg",
                      })
                    }
                    className={styles.replyBtn}
                  >
                    {activeParentReplyId === comment.id ? "취소" : "답글"}
                  </p>
                </div>
              </div>
              {isLoggedIn && (
                <div className={styles.replyBtnDropdown}>
                  {comment.writer.id === user_id ? (
                    <Dropdown
                      trigger={<IconComponent name="kebab" padding={8} size={24} isBtn />}
                      menuItems={[
                        {
                          label: "삭제하기",
                          onClick: () => handleCommentDelete(comment.id),
                          isDelete: true,
                        },
                      ]}
                    />
                  ) : (
                    <Dropdown
                      trigger={<IconComponent name="kebab" padding={8} size={24} isBtn />}
                      menuItems={[
                        {
                          label: "신고하기",
                          onClick: () => handleReport(comment.writer?.id),
                          isDelete: true,
                        },
                      ]}
                    />
                  )}
                </div>
              )}
            </div>
            {comment.childComments.length > 0 && (
              <div className={styles.viewReplies}>
                {renderChildComments(comment.childComments, comment.id)}
              </div>
            )}
            {activeParentReplyId === comment.id && !isReplyToChild && (
              <ReplyInput
                isChildReply={false}
                replyText={replyText}
                onReplyTextChange={handleReplyTextChange}
                onKeyDown={handleEnterKeyDown}
                isLoggedIn={isLoggedIn}
                ref={replyInputRef}
                showToast={showToast}
                handleReplySubmit={handleReplySubmit}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {!isFollowingPage && (
        <CommentInput
          feedId={feedId}
          isLoggedIn={isLoggedIn}
          userData={userData}
          showToast={showToast}
          onCommentSubmitSuccess={handleCommentSubmitSuccess}
        />
      )}
      <section>{commentsData?.comments?.map((comment) => renderComment(comment))}</section>
    </div>
  );
}
