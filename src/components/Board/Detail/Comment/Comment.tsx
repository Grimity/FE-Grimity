import { useState, useEffect, useRef, memo } from "react";
import styles from "./Comment.module.scss";
import { authState } from "@/states/authState";
import { useRecoilState, useRecoilValue } from "recoil";
import { useToast } from "@/hooks/useToast";
import { useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Loader from "@/components/Layout/Loader/Loader";
import Dropdown from "@/components/Dropdown/Dropdown";
import { timeAgo } from "@/utils/timeAgo";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import { modalState } from "@/states/modalState";
import TextArea from "@/components/TextArea/TextArea";
import {
  deletePostsCommentLike,
  putPostsCommentLike,
} from "@/api/posts-comments/putDeletePostsCommentsLike";
import { deletePostsComments } from "@/api/posts-comments/deletePostsComment";
import { usePostPostsComments } from "@/api/posts-comments/postPostsComments";
import {
  PostsChildComment,
  PostsComment,
  useGetPostsComments,
} from "@/api/posts-comments/getPostsComments";
import { PostCommentProps, PostCommentWriter } from "./Comment.types";
import { isMobileState } from "@/states/isMobileState";
import { useRouter } from "next/router";

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
    <div className={styles.input}>
      <TextArea
        ref={replyInputRef}
        placeholder={isLoggedIn ? "답글 달기" : "회원만 답글 달 수 있어요!"}
        value={replyText}
        onChange={onReplyTextChange}
        onKeyDown={onKeyDown}
        onFocus={() => {
          if (!isLoggedIn) {
            showToast("회원만 답글 달 수 있어요!", "error");
          }
        }}
        isReply
      />
      <div className={`${styles.submitBtn} ${isChildReply ? styles.childSubmitBtn : ""}`}>
        <Button size="m" type="filled-primary" onClick={handleReplySubmit} disabled={!isLoggedIn}>
          답글
        </Button>
      </div>
    </div>
  ),
);

ReplyInput.displayName = "ReplyInput";

export default function PostComment({ postId, postWriterId }: PostCommentProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [mentionedUser, setMentionedUser] = useState<PostCommentWriter | null>(null);
  const [isReplyToChild, setIsReplyToChild] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    data: commentsData,
    isLoading,
    refetch: refetchComments,
  } = useGetPostsComments({ postId });
  const postCommentMutation = usePostPostsComments();
  const [activeParentReplyId, setActiveParentReplyId] = useState<string | null>(null);
  const [activeChildReplyId, setActiveChildReplyId] = useState<string | null>(null);
  const isMobile = useRecoilValue(isMobileState);
  const { pathname } = useRouter();
  useEffect(() => {
    refetchComments();
  }, [pathname]);

  const deleteCommentMutation = useMutation(deletePostsComments, {
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
      queryClient.invalidateQueries(["getPostsComments", postId]);
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

  const handleParentReply = (
    commentId: string,
    writer?: { id: string; name: string; url: string },
  ) => {
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
    writer?: { id: string; name: string; url: string },
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
    if (!id) {
      showToast("신고할 대상을 찾을 수 없습니다.", "error");
      return;
    }

    if (isMobile) {
      setModal({
        isOpen: true,
        type: "REPORT",
        data: { refType: "POST_COMMENT", refId: id },
        isFill: true,
      });
    } else {
      setModal({
        isOpen: true,
        type: "REPORT",
        data: { refType: "POST_COMMENT", refId: id },
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

  const handleCommentSubmit = async () => {
    if (!isLoggedIn || !comment.trim()) return;
    postCommentMutation.mutate(
      {
        postId,
        content: comment,
      },
      {
        onSuccess: () => {
          setComment("");
          refetchComments();
        },
      },
    );
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
        postId,
        content: replyText,
        parentCommentId: activeParentReplyId,
        mentionedUserId: isReplyToChild ? mentionedUser.id : undefined,
      },
      {
        onSuccess: () => {
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
        },
      },
    );
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

  if (isLoading) return <Loader />;

  const renderChildComments = (childComments: PostsChildComment[], parentCommentId: string) => {
    return (
      <div className={styles.childComments}>
        {childComments.map((reply) => (
          <div key={reply.id} className={styles.comment}>
            <div className={styles.commentBody}>
              <div className={styles.writerReply}>
                <div className={styles.writerLeft}>
                  <div className={styles.writerCreatedAt}>
                    {reply.writer ? (
                      <>
                        <Link href={`/${reply.writer?.url}`}>
                          <div className={styles.writerName}>
                            {reply.writer?.name}
                            {reply.writer?.id === postWriterId && (
                              <div className={styles.feedWriter}>작성자</div>
                            )}
                          </div>
                        </Link>
                        <p className={styles.createdAt}>{timeAgo(reply.createdAt)}</p>
                      </>
                    ) : (
                      <>
                        <div className={styles.writerName}>(탈퇴한 유저)</div>
                        <p className={styles.createdAt}>{timeAgo(reply.createdAt)}</p>
                      </>
                    )}
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
                        name={reply.isLike ? "boardLikeCountOn" : "boardLikeCount"}
                        size={24}
                        isBtn
                      />
                      {reply.likeCount}
                    </div>
                    {!reply.isDeleted && reply.writer && (
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChildReply(reply.id, parentCommentId, reply.writer);
                        }}
                        className={styles.replyBtn}
                      >
                        {activeChildReplyId === reply.id ? "취소" : "답글"}
                      </p>
                    )}
                  </div>
                </div>
                {isLoggedIn && reply.writer && (
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
              {activeChildReplyId === reply.id && activeParentReplyId === parentCommentId && (
                <ReplyInput
                  isChildReply={true}
                  replyText={replyText}
                  onReplyTextChange={handleReplyTextChange}
                  onKeyDown={handleReplyEnterKeyDown}
                  isLoggedIn={isLoggedIn}
                  replyInputRef={replyInputRef}
                  showToast={showToast}
                  handleReplySubmit={handleReplySubmit}
                />
              )}
              <div className={styles.bar} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderComment = (comment: PostsComment) => {
    return (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentBox}>
          <div className={styles.commentBody}>
            <div className={styles.writerReply}>
              <div className={styles.writerLeft}>
                <div className={styles.writerCreatedAt}>
                  {comment.writer ? (
                    <>
                      <Link href={`/${comment.writer.url}`}>
                        <div className={styles.writerName}>
                          {comment.writer.name}
                          {comment.writer.id === postWriterId && (
                            <div className={styles.feedWriter}>작성자</div>
                          )}
                        </div>
                      </Link>
                      <p className={styles.createdAt}>{timeAgo(comment.createdAt)}</p>
                    </>
                  ) : comment.isDeleted ? (
                    <p className={styles.deleteComment}>삭제된 댓글입니다.</p>
                  ) : (
                    <>
                      <div className={styles.writerName}>(탈퇴한 유저)</div>
                      <p className={styles.createdAt}>{timeAgo(comment.createdAt)}</p>
                    </>
                  )}
                </div>
                {!comment.isDeleted && (
                  <>
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
                          name={comment.isLike ? "boardLikeCountOn" : "boardLikeCount"}
                          size={24}
                          isBtn
                        />
                        {comment.likeCount}
                      </div>
                      {!comment.isDeleted && comment.writer && (
                        <p
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParentReply(comment.id, comment.writer);
                          }}
                          className={styles.replyBtn}
                        >
                          {activeParentReplyId === comment.id && !activeChildReplyId
                            ? "취소"
                            : "답글"}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {isLoggedIn && comment.writer && (
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
                onKeyDown={handleReplyEnterKeyDown}
                isLoggedIn={isLoggedIn}
                replyInputRef={replyInputRef}
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
      <section className={styles.inputContainer}>
        <TextArea
          placeholder={isLoggedIn ? "댓글 달기" : "회원만 댓글 달 수 있어요!"}
          value={comment}
          onChange={handleCommentChange}
          onFocus={() => {
            if (!isLoggedIn) {
              showToast("회원만 댓글 달 수 있어요!", "error");
            }
          }}
          onKeyDown={handleCommentEnterKeyDown}
        />
        <div className={styles.submitBtn}>
          <Button
            size="l"
            type="filled-primary"
            onClick={handleCommentSubmit}
            disabled={!isLoggedIn}
          >
            댓글
          </Button>
        </div>
      </section>
      <section>{commentsData?.comments?.map((comment) => renderComment(comment))}</section>
    </div>
  );
}
