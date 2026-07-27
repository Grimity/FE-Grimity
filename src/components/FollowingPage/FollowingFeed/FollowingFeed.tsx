import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQueryClient } from "@tanstack/react-query";

import { deleteFeeds } from "@/api/feeds/deleteFeedsId";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import { useAuthStore } from "@/states/authStore";
import { useToast } from "@/hooks/useToast";
import { useReportModal } from "@/hooks/useReportModal";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";

import Avatar from "@/components/common/Avatar/Avatar";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Menu from "@/components/common/Navigation/Menu/Menu";
import Counter from "@/components/common/Pagination/Counter/Counter";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";

import { PATH_ROUTES } from "@/constants/routes";

import styles from "./FollowingFeed.module.scss";
import type { FollowingFeedProps } from "./FollowingFeed.types";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export default function FollowingFeed({ feed }: FollowingFeedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const openReportModal = useReportModal();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isLiked, setIsLiked] = useState(feed.isLike);
  const [likeCount, setLikeCount] = useState(feed.likeCount);

  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = usePreventRightClick<HTMLDivElement>();

  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(feed.author.url);

  const detailHref = `${PATH_ROUTES.FEEDS}/${feed.id}`;
  const isMine = user_id === feed.author.id;
  const isMultiImage = feed.cards.length > 1;

  useEffect(() => {
    setIsLiked(feed.isLike);
    setLikeCount(feed.likeCount);
  }, [feed.isLike, feed.likeCount]);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    setIsClamped(element.scrollHeight > element.clientHeight);
  }, [feed.content]);

  const formattedContent = useMemo(
    () =>
      (feed.content ?? "").replace(
        URL_REGEX,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      ),
    [feed.content],
  );

  const handleDelete = async () => {
    try {
      await deleteFeeds(feed.id);
      showToast("삭제가 완료되었습니다.", "success");
      queryClient.invalidateQueries({ queryKey: ["FollowingFeeds"] });
    } catch {
      showToast("삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const menuItems = isMine
    ? [
        { label: "수정하기", onClick: () => router.push(`${detailHref}/edit`) },
        { label: "삭제하기", onClick: handleDelete },
      ]
    : [
        {
          label: "신고하기",
          onClick: () => openReportModal({ refType: "FEED", refId: feed.author.id }),
        },
      ];

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    toggleLike(
      { id: feed.id, isLiked },
      {
        onSuccess: () => {
          setIsLiked(!isLiked);
          setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        },
      },
    );
  };

  return (
    <article className={styles.feed}>
      <div className={styles.articleContent}>
        <div className={styles.article}>
          <div className={styles.author}>
            <span
              ref={targetRef as React.RefObject<HTMLSpanElement>}
              {...triggerProps}
              className={styles.authorTrigger}
            >
              <UserItem
                type="default"
                profileImage={feed.author.image ?? undefined}
                nickname={feed.author.name}
                onClick={() => router.push(`/${feed.author.url}`)}
              />
            </span>
            {isLoggedIn && (
              <Menu
                items={menuItems}
                align="right"
                trigger={
                  <IconButton
                    icon={<Icon name="dotmenu" size={24} />}
                    aria-label="피드 메뉴"
                    className={styles.menuButton}
                  />
                }
              />
            )}
          </div>

          <div className={styles.articleBody}>
            <div className={styles.photo}>
              <div className={styles.body}>
                <h2 className={styles.title}>{feed.title}</h2>
                <div className={styles.contentWrap}>
                  <div
                    ref={contentRef}
                    className={clsx(styles.content, isExpanded && styles.contentExpanded)}
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                  {isClamped && !isExpanded && (
                    <TextButton onClick={() => setIsExpanded(true)}>더보기</TextButton>
                  )}
                </div>
              </div>

              <div className={styles.media} ref={mediaRef}>
                {isMultiImage ? (
                  <div className={styles.imgView}>
                    <Swiper slidesPerView={1} spaceBetween={20} className={styles.swiper}>
                      {feed.cards.map((card, index) => (
                        <SwiperSlide key={card} className={styles.slide}>
                          <Link href={detailHref} className={styles.slideLink}>
                            <ResponsiveImage
                              src={card}
                              alt={`${feed.title} ${index + 1}번째 그림`}
                              className={styles.slideImage}
                            />
                          </Link>
                          <Counter
                            current={index + 1}
                            total={feed.cards.length}
                            size="lg"
                            className={styles.counter}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <Link href={detailHref} className={styles.singleImage}>
                    <ResponsiveImage
                      src={feed.cards[0]}
                      alt={feed.title}
                      className={styles.singleImageInner}
                    />
                  </Link>
                )}
              </div>
            </div>

            <div className={styles.reaction}>
              <TextButton
                variant="assistive"
                size="large"
                onClick={handleLikeClick}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                iconLeft={
                  <Icon
                    name={isLiked ? "heart-fill" : "heart"}
                    size={20}
                    className={clsx(isLiked && styles.heartOn)}
                  />
                }
              >
                {likeCount}
              </TextButton>
              <TextButton
                variant="assistive"
                size="large"
                href={detailHref}
                aria-label="댓글 보기"
                iconLeft={<Icon name="chat-round" size={20} />}
              >
                {feed.commentCount}
              </TextButton>
            </div>
          </div>
        </div>

        {feed.comment && (
          <Link href={detailHref} className={styles.comments}>
            <Avatar
              src={feed.comment.writer.image ?? undefined}
              size={40}
              alt={feed.comment.writer.name}
            />
            <p className={styles.commentText}>{feed.comment.content}</p>
          </Link>
        )}
      </div>

      {isOpen && <ProfileCardPopover {...popoverProps} authorUrl={feed.author.url} />}
    </article>
  );
}
