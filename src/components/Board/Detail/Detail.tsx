import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import DOMPurify from "dompurify";

import Loader from "@/components/Layout/Loader/Loader";
import Chip from "@/components/common/Chip/Chip";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Bookmark from "@/components/common/Control/Bookmark/Bookmark";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import ActionMenu from "@/components/common/Navigation/ActionMenu/ActionMenu";
import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";
import BoardAll from "@/components/Board/BoardAll/BoardAll";
import ShareBtn from "@/components/Board/Detail/ShareBtn/ShareBtn";
import PostComment from "@/components/Board/Detail/Comment/Comment";
import LatestPosts from "@/components/Board/Detail/LatestPosts/LatestPosts";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import { DetailLayout } from "@/components/Layout/DetailLayout";

import { useToast } from "@/hooks/useToast";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import { useReportModal } from "@/hooks/useReportModal";
import { useShareModal } from "@/hooks/useShareModal";

import { useModalStore } from "@/states/modalStore";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";

import { usePostsDetails } from "@/api/posts/getPostsId";
import { usePostsLikeMutation } from "@/queries/posts/usePostsLikeMutation";
import { deletePostsFeeds } from "@/api/posts/deletePostsId";

import { timeAgo } from "@/utils/timeAgo";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTypeLabel } from "@/components/Board/BoardAll/AllCard/AllCard";

import { CONFIG } from "@/config";

import type { PostDetailProps } from "@/components/Board/Detail/Detail.types";

import ImageViewer from "@/components/ImageViewer/ImageViewer";

import styles from "./Detail.module.scss";

export default function PostDetail({ id }: PostDetailProps) {
  const router = useRouter();
  const { pathname } = router;

  const { isLoggedIn, user_id } = useAuthStore();
  const { isMobile } = useDeviceStore();
  const { openModal } = useModalStore();
  const openReportModal = useReportModal();
  const { sharePost } = useShareModal();

  const { showToast } = useToast();

  const [openMenu, setOpenMenu] = useState<"header" | "reaction" | null>(null);
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: posts, isLoading, refetch } = usePostsDetails(id as string);
  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(posts?.author.url);
  const { mutate: toggleLike } = usePostsLikeMutation();

  const isAuthor = useMemo(() => user_id === posts?.author.id, [user_id, posts?.author.id]);
  const sanitizedContent = useMemo(
    () => (posts ? DOMPurify.sanitize(posts.content) : ""),
    [posts?.content],
  );

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "IMG") return;

    const imageEls = Array.from(contentRef.current?.querySelectorAll("img") ?? []);
    const images = imageEls.map((img) => img.currentSrc || img.src);
    const clickedIndex = imageEls.indexOf(target as HTMLImageElement);
    if (clickedIndex === -1 || images.length === 0) return;

    setViewer({ images, index: clickedIndex });
  }, []);

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  const handleOpenReportModal = useCallback(() => {
    if (!posts?.author.id) return;
    openReportModal({ refType: "POST", refId: posts.author.id });
  }, [openReportModal, posts?.author.id]);

  const handleLikeClick = useCallback(() => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    toggleLike(
      { id, isLiked: posts?.isLike ?? false },
      {
        onError: () => {
          showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
        },
      },
    );
  }, [isLoggedIn, id, posts?.isLike, toggleLike, showToast]);

  const handleShare = useCallback(() => {
    if (!posts) return;
    sharePost({ postId: id, title: posts.title, thumbnail: posts.thumbnail });
  }, [sharePost, id, posts]);

  const handleGoToAuthorProfile = useCallback(() => {
    if (!posts?.author.url) return;
    router.push(`/${posts.author.url}`);
  }, [router, posts?.author.url]);

  const handleDelete = useCallback(() => {
    if (!id) return;

    openModal({
      type: null,
      data: {
        title: "글을 정말 삭제하시겠어요?",
        confirmBtn: "삭제하기",
        onClick: async () => {
          try {
            await deletePostsFeeds(id);
            router.push("/board");
          } catch (err) {
            showToast("삭제 중 오류가 발생했습니다.", "error");
          }
        },
      },
      isComfirm: true,
    });
  }, [id, openModal, router, showToast]);

  const handleOpenEditPage = useCallback(() => {
    router.push(`/posts/${id}/edit`);
  }, [router, id]);

  /** 상단 더보기: 본인 글은 수정/삭제, 타인 글은 프로필 이동/신고 */
  const headerMenuItems = useMemo<MenuItem[]>(() => {
    if (isAuthor) {
      return [
        { label: "수정하기", onClick: handleOpenEditPage },
        { label: "삭제하기", onClick: handleDelete },
      ];
    }

    const items: MenuItem[] = [];

    if (posts?.author.url) {
      items.push({ label: "작가 프로필로 이동", onClick: handleGoToAuthorProfile });
    }
    if (isLoggedIn) {
      items.push({ label: "신고하기", onClick: handleOpenReportModal });
    }

    return items;
  }, [
    isAuthor,
    isLoggedIn,
    posts?.author.url,
    handleOpenEditPage,
    handleDelete,
    handleGoToAuthorProfile,
    handleOpenReportModal,
  ]);

  /** 하단 더보기: 상단 메뉴에 공유하기가 추가된 구성 */
  const reactionMenuItems = useMemo<MenuItem[]>(
    () => [{ label: "공유하기", onClick: handleShare }, ...headerMenuItems],
    [handleShare, headerMenuItems],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!posts) {
    return null;
  }

  const renderMenuAnchor = (anchor: "header" | "reaction") => {
    const items = anchor === "header" ? headerMenuItems : reactionMenuItems;

    if (items.length === 0) return null;

    return (
      <ActionMenu
        items={items}
        open={openMenu === anchor}
        onOpenChange={(open) => setOpenMenu(open ? anchor : null)}
        displayMode={isMobile ? "bottomSheet" : "menu"}
      >
        <IconButton
          variant="sm"
          icon={<Icon name="dotmenu" size={20} />}
          onClick={() => setOpenMenu((prev) => (prev === anchor ? null : anchor))}
          aria-label="더보기"
        />
      </ActionMenu>
    );
  };

  return (
    <DetailLayout>
      <DetailLayout.Content>
        <div className={styles.contentBlock}>
          <article className={styles.article}>
            <div className={styles.writing}>
              <section className={styles.header}>
                <div className={styles.chip}>
                  <Chip variant={posts.type === "NOTICE" ? "primary" : "assistive"} size="xl">
                    {getTypeLabel(posts.type)}
                  </Chip>
                </div>
                <div className={styles.info}>
                  <div className={styles.titleBlock}>
                    <h1 className={styles.title}>{posts.title}</h1>
                    {posts.type !== "NOTICE" && (
                      <span ref={targetRef as React.RefObject<HTMLSpanElement>} {...triggerProps}>
                        <Link href={`/${posts.author.url}`}>
                          <UserInfo type="default" nickname={posts.author.name} />
                        </Link>
                      </span>
                    )}
                  </div>
                  <div className={styles.actions}>
                    {renderMenuAnchor("header")}
                    <ShareBtn postId={id} title={posts.title} thumbnail={posts.thumbnail} />
                  </div>
                </div>
              </section>

              <div className={styles.body}>
                <div
                  ref={contentRef}
                  className={styles.content}
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
                <UserInfo
                  type="default"
                  nickname={posts.author.name}
                  showView
                  viewCount={formatCurrency(posts.viewCount)}
                  showTime
                  timeCount={timeAgo(posts.createdAt)}
                />
              </div>
            </div>

            {viewer && (
              <ImageViewer
                images={viewer.images}
                initialIndex={viewer.index}
                onClose={() => setViewer(null)}
              />
            )}

            <div className={styles.reaction}>
              <div className={styles.reactionLeft}>
                <div className={styles.likeBtn}>
                  <Bookmark active={posts.isLike} onClick={handleLikeClick} aria-label="좋아요" />
                  {posts.likeCount}
                </div>
                <span className={styles.commentCount}>
                  <Icon name="chat-round" size={24} color="gray-bold" />
                  {posts.commentCount}
                </span>
              </div>

              {renderMenuAnchor("reaction")}
            </div>
          </article>

          <DetailLayout.HorizontalAd adSlot={CONFIG.MARKETING.AD_SLOTS.BOARD_DETAIL_HORIZONTAL} />

          <section className={styles.comments}>
            <PostComment
              postId={id}
              postWriterId={posts.author.id}
              commentCount={posts.commentCount}
            />
            <div className={styles.bar} />
          </section>
        </div>

        <BoardAll isDetail hasChip={true} />
        {isOpen && posts?.author.url && (
          <ProfileCardPopover {...popoverProps} authorUrl={posts.author.url} />
        )}
      </DetailLayout.Content>

      <DetailLayout.Sidebar>
        <DetailLayout.VerticalAd adSlot={CONFIG.MARKETING.AD_SLOTS.BOARD_DETAIL_VERTICAL} />
        <LatestPosts />
      </DetailLayout.Sidebar>
    </DetailLayout>
  );
}
