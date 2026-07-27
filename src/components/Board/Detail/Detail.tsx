import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import DOMPurify from "dompurify";

import Loader from "@/components/Layout/Loader/Loader";
import Chip from "@/components/Chip/Chip";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import BoardAll from "@/components/Board/BoardAll/BoardAll";
import ShareBtn from "@/components/Board/Detail/ShareBtn/ShareBtn";
import PostComment from "@/components/Board/Detail/Comment/Comment";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import Icon from "@/components/Asset/IconTemp";
import { DetailLayout } from "@/components/Layout/DetailLayout";
import ActionBar from "@/components/ActionBar/ActionBar";
import { ActionBarConfig } from "@/components/ActionBar/ActionBar.types";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import { useReportModal } from "@/hooks/useReportModal";

import { useModalStore } from "@/states/modalStore";
import { useShareModal } from "@/hooks/useShareModal";
import { useAuthStore } from "@/states/authStore";

import { usePostsDetails } from "@/api/posts/getPostsId";
import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";
import { usePostsLikeMutation } from "@/queries/posts/usePostsLikeMutation";
import { deletePostsFeeds } from "@/api/posts/deletePostsId";

import { timeAgo } from "@/utils/timeAgo";
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
  const { sharePost } = useShareModal();
  const openReportModal = useReportModal();

  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();

  const [isSaved, setIsSaved] = useState(false);
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

  const handleOpenShareModal = useCallback(() => {
    if (posts) {
      sharePost({ postId: id, title: posts.title, thumbnail: posts.thumbnail });
    }
  }, [posts, sharePost, id]);

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
      }
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
  }, [isLoggedIn, isSaved, id, showToast]);

  const handleDelete = useCallback(async () => {
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

  const getAuthorMenuItems = useCallback(
    () => [
      { label: "수정하기", onClick: handleOpenEditPage },
      { label: "삭제하기", onClick: handleDelete, isDelete: true },
    ],
    [handleOpenEditPage, handleDelete],
  );

  const getGuestMenuItems = useCallback(
    () => [{ label: "신고하기", onClick: handleOpenReportModal, isDelete: true }],
    [handleOpenReportModal],
  );

  const getMobileMenuItems = useCallback(() => {
    const baseItems = [{ label: "공유하기", onClick: handleOpenShareModal }];

    if (isAuthor) {
      return [...baseItems, ...getAuthorMenuItems()];
    }

    if (isLoggedIn) {
      return [...baseItems, ...getGuestMenuItems()];
    }

    return baseItems;
  }, [isAuthor, isLoggedIn, handleOpenShareModal, getAuthorMenuItems, getGuestMenuItems]);

  const getDesktopMenuItems = useCallback(() => {
    if (isAuthor || !isLoggedIn) {
      return [{ label: "공유하기", onClick: handleOpenShareModal }];
    }
    return [
      { label: "공유하기", onClick: handleOpenShareModal },
      { label: "신고하기", onClick: handleOpenReportModal, isDelete: true },
    ];
  }, [isAuthor, isLoggedIn, handleOpenShareModal, handleOpenReportModal]);

  const actionBarConfig: ActionBarConfig = useMemo(
    () => ({
      like: {
        isLiked: posts?.isLike ?? false,
        count: posts?.likeCount ?? 0,
        iconNameOn: "boardLikeCountOn",
        iconNameOff: "boardLikeCountOff",
        onToggle: handleLikeClick,
        allowSelfLike: true,
      },
      save: {
        isSaved,
        iconNameOn: "detailSaveOn",
        iconNameOff: "detailSaveOff",
        onToggle: handleSaveClick,
      },
      dropdown: {
        menuItems: isMobile ? getMobileMenuItems() : getDesktopMenuItems(),
        isMobile: true,
      },
    }),
    [
      posts?.isLike,
      posts?.likeCount,
      isSaved,
      isMobile,
      handleLikeClick,
      handleSaveClick,
      getMobileMenuItems,
      getDesktopMenuItems,
    ],
  );

  const renderDesktopDropdown = () => {
    if (!isLoggedIn) return null;

    const menuItems = isAuthor ? getAuthorMenuItems() : getGuestMenuItems();

    return (
      <div className={styles.dropdown}>
        <Dropdown
          trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
          menuItems={menuItems}
        />
      </div>
    );
  };

  const renderCounts = () => (
    <div className={styles.counts}>
      <div className={styles.count}>
        <IconComponent name="boardLikeCount" size={16} />
        {posts?.likeCount}
      </div>
      <div className={styles.count}>
        <IconComponent name="commentCount" size={16} />
        {posts?.commentCount}
      </div>
      <div className={styles.count}>
        <IconComponent name="viewCount" size={16} />
        {posts?.viewCount}
      </div>
    </div>
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!posts) {
    return null;
  }

  return (
    <DetailLayout>
      <DetailLayout.Content>
        <section className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.chip}>
              <Chip
                size="s"
                type={posts.type === "NOTICE" ? "filled-secondary" : "filled-assistive"}
              >
                {getTypeLabel(posts.type)}
              </Chip>
            </div>
            <h1 className={styles.title}>{posts.title}</h1>
            <div className={styles.authorCreatedAt}>
              {posts.type !== "NOTICE" && (
                <span ref={targetRef as React.RefObject<HTMLSpanElement>} {...triggerProps}>
                  <Link href={`/${posts.author.url}`} className={styles.author}>
                    <p>{posts.author.name}</p>
                  </Link>
                </span>
              )}
              <p className={styles.createdAt}>{timeAgo(posts.createdAt)}</p>
            </div>
          </div>
          {!isMobile && (
            <div className={styles.dropdownContainer}>
              {renderDesktopDropdown()}
              <ShareBtn postId={id} title={posts.title} thumbnail={posts.thumbnail} />
            </div>
          )}
        </section>

        <div className={styles.bar} />

        <div
          ref={contentRef}
          className={styles.content}
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {viewer && (
          <ImageViewer
            images={viewer.images}
            initialIndex={viewer.index}
            onClose={() => setViewer(null)}
          />
        )}

        {renderCounts()}
        <ActionBar config={actionBarConfig} isAuthor={isAuthor} className={styles.boardActionBar} />

        <DetailLayout.HorizontalAd adSlot={CONFIG.MARKETING.AD_SLOTS.BOARD_DETAIL_HORIZONTAL} />

        <PostComment postId={id} postWriterId={posts.author.id} />

        {!posts.commentCount && <div className={styles.bar} />}

        <section className={styles.uploadBtn}>
          {isLoggedIn && (
            <Link href={PATH_ROUTES.BOARD_WRITE}>
              <Button type="outlined-assistive" leftIcon={<Icon icon="detailWrite" size="xl" />}>
                글쓰기
              </Button>
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
