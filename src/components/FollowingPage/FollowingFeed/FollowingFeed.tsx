import styles from "./FollowingFeed.module.scss";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/states/authStore";
import { useToast } from "@/hooks/useToast";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import Link from "next/link";
import { putView } from "@/api/feeds/putIdView";
import { deleteFeeds } from "@/api/feeds/deleteFeedsId";
import { useRouter } from "next/router";
import { timeAgo } from "@/utils/timeAgo";

import { useShareModal } from "@/hooks/useShareModal";
import { useReportModal } from "@/hooks/useReportModal";
import { deleteSave, putSave } from "@/api/feeds/putDeleteFeedsIdSave";
import IconComponent from "@/components/Asset/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import ShareBtn from "@/components/Detail/ShareBtn/ShareBtn";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chip/Chip";
import CommentInput from "@/components/Detail/Comment/CommentInput/CommentInput";
import Comment from "@/components/Detail/Comment/Comment";
import { useGetFeedsComments } from "@/api/feeds-comments/getFeedComments";
import { useMyData } from "@/api/users/getMe";
import { FollowingFeedsResponse } from "@/api/feeds/getFeedsFollowing";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import ImageViewer from "@/components/ImageViewer/ImageViewer";

interface FollowingFeedProps {
  id: string;
  commentCount: number;
  details: FollowingFeedsResponse["feeds"][number];
}

export default function FollowingFeed({ id, commentCount, details }: FollowingFeedProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { data: myData } = useMyData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [viewCounted, setViewCounted] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const router = useRouter();
  const { shareFeed } = useShareModal();
  const openReportModal = useReportModal();
  const { refetch: refetchComments } = useGetFeedsComments({
    feedId: id,
  });
  const [isContentTooLong, setIsContentTooLong] = useState(false);
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const divRef = usePreventRightClick<HTMLDivElement>();
  const sectionRef = usePreventRightClick<HTMLElement>();
  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(
    details?.author.url,
  );
  const { mutate: toggleLike } = useFeedsLikeMutation();

  useEffect(() => {
    if (!details) return;
    setIsLiked(details.isLike ?? false);
    setCurrentLikeCount(details.likeCount ?? 0);
  }, [details]);

  // 새로고침 조회수 증가
  useEffect(() => {
    const incrementViewCount = async () => {
      if (!id || viewCounted) return;

      try {
        await putView(id);
        setViewCounted(true);
      } catch (error) {
        console.error("조회수 증가 에러", error);
      }
    };

    incrementViewCount();
  }, [id, viewCounted]);

  useEffect(() => {
    if (contentRef.current) {
      const isTooLong = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsContentTooLong(isTooLong);
    }
  }, [details?.content]);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedContent = (details?.content ?? "").replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  const handleCommentSubmitSuccess = () => {
    if (isCommentExpanded) {
      refetchComments();
    }
    handleCommentShowMore();
  };

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCommentShowMore = () => {
    if (isCommentExpanded) {
      refetchComments();
    }
    setIsCommentExpanded(!isCommentExpanded);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteFeeds(id);
      showToast("삭제가 완료되었습니다.", "success");
      router.push("/");
    } catch (error) {
      showToast("삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const handleOpenEditPage = () => {
    router.push(`/feeds/${id}/edit`);
  };

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    toggleLike(
      { id, isLiked },
      {
        onSuccess: () => {
          setIsLiked(!isLiked);
          setCurrentLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        },
      }
    );
  };

  const handleSaveClick = async () => {
    if (!isLoggedIn) {
      showToast("로그인 후 저장할 수 있어요.", "error");
      return;
    }

    if (isSaved) {
      await deleteSave(id);
    } else {
      await putSave(id);
    }
    setIsSaved(!isSaved);
  };

  const handleImageClick = (index: number) => {
    setViewerIndex(index);
  };

  const handleOpenShareModal = () => {
    if (details) {
      shareFeed({ feedId: id, title: details.title, image: details.thumbnail });
    }
  };

  const handleOpenReportModal = () => {
    if (!details?.author.id) return;
    openReportModal({ refType: "FEED", refId: details.author.id });
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        {details && (
          <>
            <section className={styles.header}>
              <div className={styles.profileLeft}>
                <Link href={`/${details.author.url}`}>
                  <ResponsiveImage
                    src={details.author.image || "/image/default.svg"}
                    alt={details.author.name}
                    className={styles.authorImage}
                    width={40}
                    height={40}
                    ref={imgRef}
                  />
                </Link>
                <div className={styles.authorInfo}>
                  <span ref={targetRef as React.RefObject<HTMLSpanElement>} {...triggerProps}>
                    <Link href={`/${details.author.url}`}>
                      <p className={styles.authorName}>{details.author.name}</p>
                    </Link>
                  </span>
                  <p className={styles.createdAt}>{timeAgo(details.createdAt)}</p>
                </div>
              </div>
              <div className={styles.dropdownContainer}>
                {isLoggedIn &&
                  (user_id === details.author.id ? (
                    <div className={styles.dropdown}>
                      <Dropdown
                        trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
                        menuItems={[
                          {
                            label: "수정하기",
                            onClick: handleOpenEditPage,
                          },
                          {
                            label: "삭제하기",
                            onClick: handleDelete,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    <div className={styles.dropdown}>
                      <Dropdown
                        trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
                        menuItems={[
                          {
                            label: "신고하기",
                            onClick: handleOpenReportModal,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  ))}
                <ShareBtn feedId={id} title={details.title} image={details.cards[0]} />
              </div>
            </section>
            <section className={styles.imageGallery} ref={sectionRef}>
              {details.cards.slice(0, 2).map((card, index) => (
                <div key={index} className={styles.imageWrapper} ref={divRef}>
                  <ResponsiveImage
                    src={card}
                    alt={`Card image ${index + 1}`}
                    width={880}
                    height={0}
                    className={styles.cardImage}
                    onClick={() => handleImageClick(index)}
                    loading={index ? "lazy" : "eager"}
                    ref={imgRef}
                    onContextMenu={(e: React.MouseEvent<HTMLImageElement>) => e.preventDefault()}
                  />
                  {index === 1 && details.cards.length > 2 && !isExpanded && (
                    <>
                      <div className={styles.gradient} />
                      <div onClick={handleShowMore} className={styles.showMore}>
                        <Button size="l" type="filled-primary">
                          전체 보기
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </section>
            <section ref={sectionRef}>
              {isExpanded &&
                details.cards.slice(2).map((card, index) => (
                  <div key={index + 2} className={styles.imageWrapper2} ref={divRef}>
                    <ResponsiveImage
                      src={card}
                      alt={`Card image ${index + 3}`}
                      width={600}
                      height={0}
                      className={styles.cardImage}
                      onClick={() => handleImageClick(index + 2)}
                      loading="lazy"
                      ref={imgRef}
                      onContextMenu={(e: React.MouseEvent<HTMLImageElement>) => e.preventDefault()}
                    />
                  </div>
                ))}
            </section>
            {viewerIndex !== null && (
              <ImageViewer
                images={details.cards}
                initialIndex={viewerIndex}
                onClose={() => setViewerIndex(null)}
              />
            )}
            <section className={styles.contentContainer} ref={sectionRef}>
              <h2 className={styles.title}>{details.title}</h2>
              <div className={styles.bar} />
              <p
                className={`${styles.content} ${isContentExpanded && styles.expanded}`}
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
              {isContentTooLong && !isContentExpanded && (
                <button className={styles.readMore} onClick={() => setIsContentExpanded(true)}>
                  자세히 보기
                </button>
              )}
              {/* {details.isAI && (
                <div className={styles.aiBtn}>
                  <IconComponent name="aiMessage" size={20} />
                  해당 컨텐츠는 AI로 생성되었어요
                </div>
              )} */}
              <div className={styles.stats}>
                <span className={styles.stat}>
                  <IconComponent name="likeCount" size={16} />
                  {currentLikeCount}
                </span>
                <span className={styles.stat}>
                  <IconComponent name="viewCount" size={16} />
                  {details.viewCount}
                </span>
              </div>
              {details.tags.length > 0 && (
                <div className={styles.tags}>
                  {details.tags.map((tag, index) => (
                    <Link href={`/search?tab=feed&keyword=${tag}`} key={index}>
                      <Chip size="m" type="filled-assistive">
                        {tag}
                      </Chip>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <div className={styles.btnContainer}>
              <div className={styles.likeBtn} onClick={handleLikeClick}>
                <Button
                  size="l"
                  type="outlined-assistive"
                  leftIcon={
                    <IconComponent name={isLiked ? "detailLikeOn" : "detailLikeOff"} size={20} />
                  }
                >
                  {currentLikeCount}
                </Button>
              </div>
              <div className={styles.saveBtn} onClick={handleSaveClick}>
                <IconComponent name={isSaved ? "detailSaveOn" : "detailSaveOff"} size={20} />
              </div>
              {user_id === details.author.id || !isLoggedIn ? (
                <div className={styles.dropdown}>
                  <Dropdown
                    trigger={
                      <div className={styles.menuBtn}>
                        <IconComponent name="meatball" size={20} />
                      </div>
                    }
                    menuItems={[
                      {
                        label: "공유하기",
                        onClick: handleOpenShareModal,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className={styles.dropdown}>
                  <Dropdown
                    trigger={
                      <div className={styles.menuBtn}>
                        <IconComponent name="meatball" size={20} />
                      </div>
                    }
                    menuItems={[
                      {
                        label: "공유하기",
                        onClick: handleOpenShareModal,
                      },
                      {
                        label: "신고하기",
                        onClick: handleOpenReportModal,
                        isDelete: true,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
            <CommentInput
              feedId={details.id}
              isLoggedIn={isLoggedIn}
              userData={myData}
              showToast={showToast}
              onCommentSubmitSuccess={handleCommentSubmitSuccess}
            />
            {commentCount !== 0 && (
              <div onClick={handleCommentShowMore} className={styles.commentShowMore}>
                {isCommentExpanded ? "댓글 숨기기" : `댓글 ${commentCount}개 보기`}
                <IconComponent
                  name={isCommentExpanded ? "commentUp" : "commentDown"}
                  size={16}
                  isBtn
                />
              </div>
            )}
            {isCommentExpanded && (
              <Comment
                feedId={id}
                feedWriterId={details.author.id}
                isFollowingPage
                isExpanded={isCommentExpanded}
              />
            )}
            <div className={styles.bar} />
          </>
        )}
        {isOpen && details?.author.url && (
          <ProfileCardPopover {...popoverProps} authorUrl={details.author.url} />
        )}
      </div>
    </div>
  );
}
