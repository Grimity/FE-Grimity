import { useState, useEffect, useRef } from "react";
import styles from "./Comment.module.scss";
import Image from "next/image";
import { authState } from "@/states/authState";
import { useRecoilState, useRecoilValue } from "recoil";
import { usePostFeedsComments } from "@/api/feeds-comments/postFeedComments";
import {
  useGetFeedsComments,
  useGetFeedsChildComments,
  FeedsCommentsResponse,
} from "@/api/feeds-comments/getFeedComments";
import { CommentProps } from "./Comment.types";
import { useToast } from "@/hooks/useToast";
import { deleteComments } from "@/api/feeds-comments/deleteFeedComment";
import { useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Loader from "@/components/Layout/Loader/Loader";
import Dropdown from "@/components/Dropdown/Dropdown";
import { timeAgo } from "@/utils/timeAgo";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import { deleteCommentLike, putCommentLike } from "@/api/feeds-comments/putDeleteCommentsLike";
import { modalState } from "@/states/modalState";
import CommentInput from "./CommentInput/CommentInput";
import TextArea from "@/components/TextArea/TextArea";
import { useMyData } from "@/api/users/getMe";
import { isMobileState } from "@/states/isMobileState";
import { useRouter } from "next/router";

export default function Comment({
  feedId,
  feedWriterId,
  isFollowingPage,
  isExpanded = true,
}: CommentProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { data: userData, isLoading, refetch: userDataRefetch } = useMyData();
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [mentionedUser, setMentionedUser] = useState<{
    id: string;
    name: string;
    url: string;
  } | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [isReplyToChild, setIsReplyToChild] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const { data: commentsData, refetch: refetchComments } = useGetFeedsComments({
    feedId,
    enabled: isExpanded,
  });
  const postCommentMutation = usePostFeedsComments();
  const [activeParentReplyId, setActiveParentReplyId] = useState<string | null>(null);
  const [activeChildReplyId, setActiveChildReplyId] = useState<string | null>(null);
  const isMobile = useRecoilValue(isMobileState);
  const { pathname } = useRouter();
  useEffect(() => {
    refetchComments();
  }, [pathname]);

  const deleteCommentMutation = useMutation(deleteComments, {
    onSuccess: () => {
      showToast("댓글이 삭제되었습니다.", "success");
      refetchComments();
    },
    onError: () => {
      showToast("댓글 삭제에 실패했습니다.", "error");
    },
  });

  if (!isExpanded) {
    return null;
  }

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

      refetchComments();

      if (expandedComments.size > 0) {
        expandedComments.forEach((commentId) => {
          queryClient.invalidateQueries(["getFeedsChildComments", feedId, commentId]);
        });
      }
    } catch (error) {
      showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleParentReply = (
    commentId: string,
    writer: { id: string; name: string; url: string },
  ) => {
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
    parentId: string,
    writer: { id: string; name: string; url: string },
  ) => {
    if (activeChildReplyId === commentId) {
      setActiveChildReplyId(null);
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
    if (!id) {
      showToast("신고할 대상을 찾을 수 없습니다.", "error");
      return;
    }

    if (isMobile) {
      setModal({
        isOpen: true,
        type: "REPORT",
        data: { refType: "FEED_COMMENT", refId: id },
        isFill: true,
      });
    } else {
      setModal({
        isOpen: true,
        type: "REPORT",
        data: { refType: "FEED_COMMENT", refId: id },
      });
    }
  };

  const handleCommentDelete = async (id: string) => {
    setModal({
      isOpen: true,
      type: null,
      data: {
        title: "댓글을 삭제하시겠어요?",
        confirmBtn: "삭제",
        onClick: () => {
          deleteCommentMutation.mutate(id);
        },
      },
      isComfirm: true,
    });
  };

  const handleReplySubmit = async () => {
    if (!isLoggedIn || !replyText.trim() || !activeParentReplyId || !mentionedUser) return;

    const actualReplyContent = replyText.trim();

    if (!actualReplyContent) {
      showToast("답글 내용을 입력해주세요.", "error");
      return;
    }

    postCommentMutation.mutate(
      {
        feedId,
        content: replyText,
        parentCommentId: activeParentReplyId,
        mentionedUserId: isReplyToChild ? mentionedUser.id : undefined,
      },
      {
        onSuccess: () => {
          setReplyText("");
          setActiveParentReplyId(null);
          setActiveChildReplyId(null);
          setMentionedUser(null);
          setIsReplyToChild(false);
          refetchComments();
          queryClient.invalidateQueries(["getFeedsChildComments", feedId, activeParentReplyId]);
        },
      },
    );
  };

  const toggleChildComments = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
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

  // 답글 영역
  const ChildComments = ({ parentId }: { parentId: string }) => {
    const { data: childComments, isLoading } = useGetFeedsChildComments({
      feedId,
      parentId,
    });

    if (isLoading) return <Loader />;
    if (!childComments) return null;

    return (
      <div className={styles.childComments}>
        {childComments.map((reply) => (
          <div key={reply.id} className={`${styles.comment} ${styles.nestedComment}`}>
            <div className={styles.commentBox}>
              <Link href={`/${reply.writer.url}`}>
                {reply.writer.image !== "https://image.grimity.com/null" ? (
                  <Image
                    src={reply.writer.image}
                    width={24}
                    height={24}
                    alt="댓글 프로필"
                    quality={50}
                    className={styles.writerImage}
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/image/default.svg"
                    width={24}
                    height={24}
                    alt="댓글 프로필"
                    quality={50}
                    className={styles.writerImage}
                    unoptimized
                  />
                )}
              </Link>
              <div className={styles.commentBody}>
                <div className={styles.writerReply}>
                  <div className={styles.writerLeft}>
                    <div className={styles.writerCreatedAt}>
                      <Link href={`/{reply.writer.url}`}>
                        <div className={styles.writerName}>{reply.writer.name}</div>
                      </Link>
                      {reply.writer.id === feedWriterId && (
                        <div className={styles.feedWriter}>작성자</div>
                      )}
                      <p className={styles.createdAt}>{timeAgo(reply.createdAt)}</p>
                    </div>
                    <div className={styles.commentText}>
                      {reply.mentionedUser && (
                        <span className={styles.mentionedUser}>@{reply.mentionedUser?.name}</span>
                      )}
                      {reply.content}
                    </div>
                    <div className={styles.likeReplyBtn}>
                      <div
                        className={reply.isLike ? styles.likeOnButton : styles.likeButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeClick(reply.id, reply.isLike);
                        }}
                      >
                        <IconComponent
                          name={reply.isLike ? "commentLikeOn" : "commentLikeOff"}
                          size={24}
                          isBtn
                        />
                        {reply.likeCount}
                      </div>
                      <p
                        onClick={() =>
                          handleChildReply(reply.id, parentId, {
                            id: reply.writer.id,
                            name: reply.writer.name,
                            url: reply.writer.url,
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
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 댓글 영역
  const renderComment = (comment: FeedsCommentsResponse["comments"][number]) => {
    const isExpanded = expandedComments.has(comment.id);

    return (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentBox}>
          <Link href={`/${comment.writer.url}`}>
            {comment.writer.image !== "https://image.grimity.com/null" ? (
              <Image
                src={comment.writer.image}
                width={isMobile ? 24 : 40}
                height={isMobile ? 24 : 40}
                alt="댓글 프로필"
                quality={50}
                className={styles.writerImage}
                unoptimized
              />
            ) : (
              <Image
                src="/image/default.svg"
                width={isMobile ? 24 : 40}
                height={isMobile ? 24 : 40}
                alt="댓글 프로필"
                quality={50}
                className={styles.writerImage}
                unoptimized
              />
            )}
          </Link>
          <div className={styles.commentBody}>
            <div className={styles.writerReply}>
              <div className={styles.writerLeft}>
                <div className={styles.writerCreatedAt}>
                  <Link href={`/${comment.writer.url}`}>
                    <div className={styles.writerName}>
                      {comment.writer.name}
                      {comment.writer.id === feedWriterId && (
                        <div className={styles.feedWriter}>작성자</div>
                      )}
                    </div>
                  </Link>
                  <p className={styles.createdAt}>{timeAgo(comment.createdAt)}</p>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
                <div className={styles.likeReplyBtn}>
                  <div
                    className={comment.isLike ? styles.likeOnButton : styles.likeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(comment.id, comment.isLike);
                    }}
                  >
                    <IconComponent
                      name={comment.isLike ? "commentLikeOn" : "commentLikeOff"}
                      size={24}
                      isBtn
                    />
                    {comment.likeCount}
                  </div>
                  <p
                    onClick={() =>
                      handleParentReply(comment.id, {
                        id: comment.writer.id,
                        name: comment.writer.name,
                        url: comment.writer.url,
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
            {comment.childCommentCount > 0 && (
              <div className={styles.viewReplies}>
                <button
                  onClick={() => toggleChildComments(comment.id)}
                  className={styles.viewRepliesBtn}
                >
                  {isExpanded ? "답글 숨기기" : `답글 ${comment.childCommentCount}개 보기`}
                  {isExpanded ? (
                    <IconComponent name="replyFold" size={16} isBtn />
                  ) : (
                    <IconComponent name="replySeeMore" size={16} isBtn />
                  )}
                </button>
                {isExpanded && <ChildComments parentId={comment.id} />}
              </div>
            )}
            {/* 답글 입력창 */}
            {activeParentReplyId === comment.id && (
              <div className={styles.input}>
                {!isMobile &&
                  (isLoggedIn && userData ? (
                    <img
                      src={
                        userData.image !== "https://image.grimity.com/null"
                          ? userData.image
                          : "/image/default.svg"
                      }
                      width={24}
                      height={24}
                      alt="프로필 이미지"
                      className={styles.writerImage}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src="/image/default.svg"
                      width={24}
                      height={24}
                      alt="프로필 이미지"
                      className={styles.writerImage}
                      loading="lazy"
                    />
                  ))}
                <TextArea
                  ref={replyInputRef}
                  placeholder={isLoggedIn ? "답글 달기" : "회원만 답글 달 수 있어요!"}
                  value={replyText}
                  onChange={handleReplyTextChange}
                  onKeyDown={handleEnterKeyDown}
                  onFocus={() => {
                    if (!isLoggedIn) {
                      showToast("회원만 답글 달 수 있어요!", "error");
                    }
                  }}
                  isReply
                />
                <div className={styles.submitBtn}>
                  <Button
                    size="m"
                    type="filled-primary"
                    onClick={handleReplySubmit}
                    disabled={!isLoggedIn}
                  >
                    답글
                  </Button>
                </div>
              </div>
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
      <section>{commentsData?.comments.map((comment) => renderComment(comment))}</section>
    </div>
  );
}
