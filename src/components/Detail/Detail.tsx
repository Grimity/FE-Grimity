import styles from "./Detail.module.scss";
import { DetailProps } from "./Detail.types";
import { useDetails } from "@/api/feeds/getFeedsId";
import { useState, useEffect } from "react";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import ActionMenu from "@/components/common/Navigation/ActionMenu/ActionMenu";
import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";
import Heart from "@/components/common/Control/Heart/Heart";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useToast } from "@/hooks/useToast";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import Link from "next/link";
import { putView } from "@/api/feeds/putIdView";
import { deleteFeeds } from "@/api/feeds/deleteFeedsId";
import { useRouter } from "next/router";
import Loader from "../Layout/Loader/Loader";
import Author from "./Author/Author";
import ImageViewer from "@/components/ImageViewer/ImageViewer";
import ShareBtn from "./ShareBtn/ShareBtn";
import { timeAgo } from "@/utils/timeAgo";
import Tag from "@/components/common/Tag/Tag/Tag";
import { useModalStore } from "@/states/modalStore";
import { useShareModal } from "@/hooks/useShareModal";
import { useReportModal } from "@/hooks/useReportModal";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import Comment from "./Comment/Comment";
import NewFeed from "../Layout/NewFeed/NewFeed";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import useUserBlock from "@/hooks/useUserBlock";
import { DetailLayout } from "@/components/Layout/DetailLayout";
import { CONFIG } from "@/config";

export default function Detail({ id }: DetailProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { isMobile } = useDeviceStore();
  const [openMenu, setOpenMenu] = useState<"header" | "reaction" | null>(null);
  const { data: details, isLoading, refetch } = useDetails(id);
  const { showToast } = useToast();
  const { mutate: toggleLike } = useFeedsLikeMutation();
  const [viewCounted, setViewCounted] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const divRef = usePreventRightClick<HTMLDivElement>();
  const sectionRef = usePreventRightClick<HTMLElement>();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const { shareFeed } = useShareModal();
  const openReportModal = useReportModal();
  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(
    details?.author.url,
  );

  useUserBlock({
    identifier: id,
    isBlocked: details?.author.isBlocked,
  });

  const goToAuthor = () => {
    if (details) router.push(`/${details.author.url}`);
  };

  const handleDelete = () => {
    if (!id) return;

    openModal({
      type: null,
      data: {
        title: "그림을 정말 삭제하시겠어요?",
        confirmBtn: "삭제하기",
        onClick: async () => {
          try {
            await deleteFeeds(id);
            router.push("/");
          } catch (err) {
            showToast("삭제 중 오류가 발생했습니다.", "error");
            throw err;
          }
        },
      },
      isComfirm: true,
    });
  };

  const handleOpenEditPage = () => {
    router.push(`/feeds/${id}/edit`);
  };

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    if (details?.author.id !== user_id) {
      toggleLike({ id, isLiked: details?.isLike ?? false });
    }
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

  useEffect(() => {
    refetch();
  }, [router.pathname]);

  useAuthRefresh();

  // 새로고침 시 조회수 증가
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

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedContent = (details?.content ?? "").replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  const renderMenu = (anchor: "header" | "reaction", items: MenuItem[]) => (
    <ActionMenu
      align="right"
      open={openMenu === anchor}
      onOpenChange={(open) => setOpenMenu(open ? anchor : null)}
      displayMode={isMobile ? "bottomSheet" : "menu"}
      items={items}
    >
      <IconButton
        variant="sm"
        icon={<Icon name="dotmenu" size={24} color="gray-bold" />}
        onClick={() => setOpenMenu((prev) => (prev === anchor ? null : anchor))}
        aria-label="더보기"
      />
    </ActionMenu>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DetailLayout>
      <DetailLayout.Content>
        {details && (
          <>
            <div className={styles.header}>
              <span
                ref={targetRef as React.RefObject<HTMLSpanElement>}
                {...triggerProps}
                className={styles.headerTrigger}
              >
                <UserItem
                  type="default"
                  profileImage={details.author.image ?? undefined}
                  nickname={details.author.name}
                  onClick={goToAuthor}
                />
              </span>
              <div className={styles.headerActions}>
                {isLoggedIn &&
                  renderMenu(
                    "header",
                    user_id === details.author.id
                      ? [
                          { label: "수정하기", onClick: handleOpenEditPage },
                          { label: "삭제하기", onClick: handleDelete },
                        ]
                      : [
                          { label: "작가 프로필로 이동", onClick: goToAuthor },
                          { label: "신고하기", onClick: handleOpenReportModal },
                        ],
                  )}
                <ShareBtn feedId={id} title={details.title} image={details.cards[0]} />
              </div>
            </div>
            {isOpen && <ProfileCardPopover {...popoverProps} authorUrl={details.author.url} />}
            <section className={styles.imageGallery} ref={sectionRef}>
              {details.cards.map((card, index) => (
                <div key={index} className={styles.imageWrapper} ref={divRef}>
                  <ResponsiveImage
                    src={card}
                    alt={`Card image ${index + 1}`}
                    width={880}
                    height={0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={styles.cardImage}
                    onClick={() => setViewerIndex(index)}
                    ref={imgRef}
                    mobileSize={1200}
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
                canDownload={user_id === details.author.id}
              />
            )}

            <section className={styles.contentContainer}>
              <div className={styles.contentWrapper}>
                <h2 className={styles.title}>{details.title}</h2>
                <p
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
                <UserInfo
                  type="default"
                  showHeart
                  heartCount={String(details.likeCount)}
                  showView
                  viewCount={String(details.viewCount)}
                  showTime
                  timeCount={timeAgo(details.createdAt)}
                />
              </div>

              {details.tags.length > 0 && (
                <div className={styles.tags}>
                  {details.tags.map((tag, index) => (
                    <Link href={`/search?tab=feed&keyword=${tag}`} key={index}>
                      <Tag size="md">{tag}</Tag>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {!details?.author.isBlocked && (
              <>
                <div className={styles.actionBar}>
                  <div className={styles.actionLeft}>
                    <div className={styles.actionStat}>
                      <Heart active={details.isLike ?? false} onClick={handleLikeClick} variant="black" />
                      <span className={styles.actionCount}>{details.likeCount}</span>
                    </div>
                    <div className={styles.actionStat}>
                      <Icon name="chat-round" size={24} color="gray-bold" />
                      <span className={styles.actionCount}>{details.commentCount}</span>
                    </div>
                  </div>
                  {renderMenu(
                    "reaction",
                    user_id === details.author.id
                      ? [
                          { label: "공유하기", onClick: handleOpenShareModal },
                          { label: "수정하기", onClick: handleOpenEditPage },
                          { label: "삭제하기", onClick: handleDelete },
                        ]
                      : [
                          { label: "공유하기", onClick: handleOpenShareModal },
                          { label: "작가 프로필로 이동", onClick: goToAuthor },
                          { label: "신고하기", onClick: handleOpenReportModal },
                        ],
                  )}
                </div>

                <DetailLayout.HorizontalAd
                  adSlot={CONFIG.MARKETING.AD_SLOTS.FEED_DETAIL_HORIZONTAL}
                />

                <Comment
                  feedId={id}
                  feedWriterId={details.author.id}
                  commentCount={details.commentCount}
                />
              </>
            )}

            <div className={styles.bar} />
            <div className={styles.cards}>
              <Author authorId={details.author.id} authorUrl={details.author.url} />
              <NewFeed isDetail />
            </div>
          </>
        )}
      </DetailLayout.Content>

      <DetailLayout.Sidebar>
        <DetailLayout.VerticalAd adSlot={CONFIG.MARKETING.AD_SLOTS.FEED_DETAIL_VERTICAL} />
      </DetailLayout.Sidebar>
    </DetailLayout>
  );
}
