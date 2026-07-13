import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import DOMPurify from "dompurify";

import Loader from "@/components/Layout/Loader/Loader";
import Chip from "@/components/common/Chip/Chip";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Heart from "@/components/common/Control/Heart/Heart";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import Menu from "@/components/common/Navigation/Menu/Menu";
import type { MenuItem } from "@/components/common/Navigation/Menu/Menu.types";
import BoardAll from "@/components/Board/BoardAll/BoardAll";
import ShareBtn from "@/components/Board/Detail/ShareBtn/ShareBtn";
import PostComment from "@/components/Board/Detail/Comment/Comment";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import { DetailLayout } from "@/components/Layout/DetailLayout";

import { useToast } from "@/hooks/useToast";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import { useReportModal } from "@/hooks/useReportModal";

import { useModalStore } from "@/states/modalStore";
import { useAuthStore } from "@/states/authStore";

import { usePostsDetails } from "@/api/posts/getPostsId";
import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";
import { usePostsLikeMutation } from "@/queries/posts/usePostsLikeMutation";
import { deletePostsFeeds } from "@/api/posts/deletePostsId";

import { timeAgo } from "@/utils/timeAgo";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTypeLabel } from "@/components/Board/BoardAll/AllCard/AllCard";

import { PATH_ROUTES } from "@/constants/routes";
import { CONFIG } from "@/config";

import type { PostDetailProps } from "@/components/Board/Detail/Detail.types";

import ImageViewer from "@/components/ImageViewer/ImageViewer";

import styles from "./Detail.module.scss";

export default function PostDetail({ id }: PostDetailProps) {
  const router = useRouter();
  const { pathname } = router;

  const { isLoggedIn, user_id } = useAuthStore();
  const { openModal } = useModalStore();
  const openReportModal = useReportModal();

  const { showToast } = useToast();

  const [isSaved, setIsSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!posts) return;
    setIsSaved(posts.isSave ?? false);
  }, [posts]);

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

  const handleSaveClick = useCallback(async () => {
    if (!isLoggedIn) {
      showToast("로그인 후 저장할 수 있어요.", "error");
      return;
    }

    try {
      if (isSaved) {
        await deletePostsSave(id);
      } else {
        await putPostsSave(id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      showToast("저장 처리 중 오류가 발생했습니다.", "error");
    }
    setIsMenuOpen(false);
  }, [isLoggedIn, isSaved, id, showToast]);

  const handleDelete = useCallback(() => {
    if (!id) return;
    setIsMenuOpen(false);

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
    setIsMenuOpen(false);
    router.push(`/posts/${id}/edit`);
  }, [router, id]);

  const handleReportClick = useCallback(() => {
    setIsMenuOpen(false);
    handleOpenReportModal();
  }, [handleOpenReportModal]);

  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [
      { label: isSaved ? "저장 취소" : "저장하기", onClick: handleSaveClick },
    ];

    if (isAuthor) {
      items.push(
        { label: "수정하기", onClick: handleOpenEditPage },
        { label: "삭제하기", onClick: handleDelete, danger: true },
      );
    } else if (isLoggedIn) {
      items.push({ label: "신고하기", onClick: handleReportClick, danger: true });
    }

    return items;
  }, [
    isSaved,
    isAuthor,
    isLoggedIn,
    handleSaveClick,
    handleOpenEditPage,
    handleDelete,
    handleReportClick,
  ]);

  if (isLoading) {
    return <Loader />;
  }

  if (!posts) {
    return null;
  }

  return (
    <DetailLayout>
      <DetailLayout.Content>
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
                <Heart active={posts.isLike} onClick={handleLikeClick} />
                {posts.likeCount}
              </div>
              <span className={styles.commentCount}>
                <Icon name="chat-round" size={16} color="gray-subtle" />
                {posts.commentCount}
              </span>
            </div>

            <div className={styles.menuAnchor}>
              <IconButton
                variant="sm"
                icon={<Icon name="dotmenu" size={20} />}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="더보기"
              />
              {isMenuOpen && (
                <div className={styles.menuDropdown}>
                  <Menu items={menuItems} onOpenChange={setIsMenuOpen} />
                </div>
              )}
            </div>
          </div>
        </article>

        <DetailLayout.HorizontalAd adSlot={CONFIG.MARKETING.AD_SLOTS.BOARD_DETAIL_HORIZONTAL} />

        <PostComment postId={id} postWriterId={posts.author.id} />

        {!posts.commentCount && <div className={styles.bar} />}

        <section className={styles.uploadBtn}>
          {isLoggedIn && (
            <Link href={PATH_ROUTES.BOARD_WRITE}>
              <OutlinedButton iconLeft={<Icon name="pen" size={20} />}>글쓰기</OutlinedButton>
            </Link>
          )}
        </section>

        <BoardAll isDetail hasChip={true} />
        {isOpen && posts?.author.url && (
          <ProfileCardPopover {...popoverProps} authorUrl={posts.author.url} />
        )}
      </DetailLayout.Content>

      <DetailLayout.Sidebar>
        <DetailLayout.VerticalAd adSlot={CONFIG.MARKETING.AD_SLOTS.BOARD_DETAIL_VERTICAL} />
      </DetailLayout.Sidebar>
    </DetailLayout>
  );
}
