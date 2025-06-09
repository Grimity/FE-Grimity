import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";

import DOMPurify from "dompurify";

import Loader from "@/components/Layout/Loader/Loader";
import Chip from "@/components/Chip/Chip";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import BoardAll from "@/components/Board/BoardAll/BoardAll";
import ShareBtn from "@/components/Board/Detail/ShareBtn/ShareBtn";
import PostComment from "@/components/Board/Detail/Comment/Comment";

import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useModalStore } from "@/states/modalStore";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";

import { usePostsDetails } from "@/api/posts/getPostsId";
import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";
import { deletePostsLike, putPostsLike } from "@/api/posts/putDeletePostsLike";
import { deletePostsFeeds } from "@/api/posts/deletePostsId";

import { timeAgo } from "@/utils/timeAgo";
import { getTypeLabel } from "@/components/Board/BoardAll/AllCard/AllCard";

import { PostDetailProps } from "@/components/Board/Detail/Detail.types";

import styles from "@/components/Board/Detail/Detail.module.scss";
import { PATH_ROUTES } from "@/constants/routes";
import Icon from "@/components/Asset/IconTemp";

export default function PostDetail({ id }: PostDetailProps) {
  const router = useRouter();
  const { pathname } = router;

  const { isLoggedIn, user_id } = useAuthStore();
  const { openModal } = useModalStore();
  const { isMobile } = useDeviceStore();

  const { showToast } = useToast();
  useIsMobile();

  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: posts, isLoading, refetch } = usePostsDetails(id as string);

  const isAuthor = useMemo(() => user_id === posts?.author.id, [user_id, posts?.author.id]);
  const sanitizedContent = useMemo(
    () => (posts ? DOMPurify.sanitize(posts.content) : ""),
    [posts?.content],
  );

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  useEffect(() => {
    if (!posts) return;
    setIsLiked(posts.isLike ?? false);
    setIsSaved(posts.isSave ?? false);
    setCurrentLikeCount(posts.likeCount ?? 0);
  }, [posts]);

  const handleOpenShareModal = useCallback(() => {
    if (posts) {
      openModal({
        type: "SHAREPOST",
        data: { postId: id, title: posts.title },
      });
    }
  }, [posts, openModal, id]);

  const handleOpenReportModal = useCallback(() => {
    openModal({
      type: "REPORT",
      data: { refType: "POST", refId: posts?.author.id },
    });
  }, [openModal, posts?.author.id]);

  const handleLikeClick = useCallback(async () => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    try {
      if (isLiked) {
        await deletePostsLike(id);
        setCurrentLikeCount((prev) => prev - 1);
      } else {
        await putPostsLike(id);
        setCurrentLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
    }
  }, [isLoggedIn, isLiked, id, showToast]);

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

  const renderMobileDropdown = () => (
    <div className={styles.dropdown}>
      <Dropdown
        trigger={
          <div className={styles.menuBtn}>
            <IconComponent name="meatball" size={20} />
          </div>
        }
        menuItems={isMobile ? getMobileMenuItems() : getDesktopMenuItems()}
      />
    </div>
  );

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

  const renderActionButtons = () => (
    <div className={styles.btnContainer}>
      <div className={styles.likeBtn} onClick={handleLikeClick}>
        <Button
          size="l"
          type="outlined-assistive"
          leftIcon={
            <IconComponent name={isLiked ? "boardLikeCountOn" : "boardLikeCountOff"} size={20} />
          }
        >
          {currentLikeCount}
        </Button>
      </div>
      <div className={styles.saveBtn} onClick={handleSaveClick}>
        <IconComponent name={isSaved ? "detailSaveOn" : "detailSaveOff"} size={20} />
      </div>
      {renderMobileDropdown()}
    </div>
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!posts) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.center}>
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
                <Link href={`/${posts.author.url}`} className={styles.author}>
                  <p>{posts.author.name}</p>
                </Link>
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

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

        {renderCounts()}
        {renderActionButtons()}

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
      </div>
    </div>
  );
}
