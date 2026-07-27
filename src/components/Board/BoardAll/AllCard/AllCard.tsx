import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { deletePostsFeeds } from "@/api/posts/deletePostsId";
import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";

import { SearchHighlightContext } from "@/pages/search";

import { useModalStore } from "@/states/modalStore";
import { useShareModal } from "@/hooks/useShareModal";
import { useDeviceStore } from "@/states/deviceStore";

import Dropdown from "@/components/Dropdown/Dropdown";
import IconComponent from "@/components/Asset/Icon";
import Icon from "@/components/Asset/IconTemp";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import Chip from "@/components/Chip/Chip";

import { AllCardProps } from "./AllCard.types";

import { timeAgo } from "@/utils/timeAgo";

import { useToast } from "@/hooks/useToast";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";

import styles from "./AllCard.module.scss";

export function getTypeLabel(type: string): string {
  switch (type) {
    case "QUESTION":
      return "질문";
    case "FEEDBACK":
      return "피드백";
    case "NOTICE":
      return "공지";
    case "NORMAL":
    default:
      return "일반";
  }
}

export default function AllCard({ post, case: cardCase, hasChip = false }: AllCardProps) {
  const { highlight } = useContext(SearchHighlightContext);
  const { isMobile } = useDeviceStore();
  const openModal = useModalStore((state) => state.openModal);
  const { sharePost } = useShareModal();
  const { showToast } = useToast();

  const [isSaved, setIsSaved] = useState(true);
  const router = useRouter();
  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(post.author?.url);

  const handleSaveClick = async () => {
    if (isSaved) {
      await deletePostsSave(post.id);
    } else {
      await putPostsSave(post.id);
    }
    setIsSaved(!isSaved);
  };

  const handleDelete = async () => {
    try {
      openModal({
        type: null,
        data: {
          title: "글을 정말 삭제하시겠어요?",
          confirmBtn: "삭제하기",
          onClick: async () => {
            try {
              await deletePostsFeeds(post.id);
              router.reload();
            } catch (err) {
              showToast("삭제 중 오류가 발생했습니다.", "error");
            }
          },
        },
        isComfirm: true,
      });
    } catch (error) {
      showToast("삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const handleOpenShareModal = () => {
    if (post) {
      sharePost({ postId: post.id, title: post.title, thumbnail: post.thumbnail });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chipContainer}>
        {post.type === "NOTICE" ? (
          <Chip size="s" type="filled-secondary">
            {getTypeLabel(post.type)}
          </Chip>
        ) : (
          <Chip size="s" type="filled-assistive">
            {getTypeLabel(post.type)}
          </Chip>
        )}
      </div>
      <div className={styles.spaceBetweenWrapper}>
        <div className={styles.spaceBetween}>
          <Link href={`/posts/${post.id}`}>
            <div className={styles.titleContent}>
              <div className={styles.titleContainer}>
                {post.thumbnail !== null && <IconComponent name="boardAllImage" size={16} />}
                <span className={styles.title}>{highlight(post.title)}</span>
                <span className={styles.comment}>{post.commentCount}</span>
              </div>
              <p className={styles.content}>{highlight(post.content)}</p>
            </div>
          </Link>
          <div className={styles.rightContainer}>
            {post.type !== "NOTICE" && cardCase !== "saved-posts" && post.author && !isMobile && (
              <span ref={targetRef as React.RefObject<HTMLSpanElement>} {...triggerProps}>
                <Link href={`/${post.author?.url}`}>
                  <p className={styles.author}>{post.author.name}</p>
                </Link>
              </span>
            )}
            {cardCase === "saved-posts" ? (
              isMobile ? (
                <div className={styles.savedPosts}>
                  <div className={styles.savedCreatedAtView}>
                    <div className={styles.author}>{post.author?.name}</div>
                    <IconComponent name="dot" size={3} />
                    <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                    <IconComponent name="dot" size={3} />
                    <div className={styles.viewCount}>
                      <IconComponent name="boardAllView" size={16} />
                      {post.viewCount}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.savedPosts}>
                  <div className={styles.savedCreatedAtView}>
                    <Link href={`${post.author?.url}`}>
                      <p className={styles.author}>{post.author?.name}</p>
                    </Link>
                    <div className={styles.savedPc}>
                      <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                      <IconComponent name="dot" size={3} />
                      <div className={styles.viewCount}>
                        <IconComponent name="boardAllView" size={16} />
                        {post.viewCount}
                      </div>
                    </div>
                  </div>
                  <div onClick={handleSaveClick}>
                    <IconComponent
                      name={isSaved ? "saveOn" : "saveOff"}
                      size={20}
                      padding={8}
                      isBtn
                    />
                  </div>
                </div>
              )
            ) : cardCase === "my-posts" ? (
              isMobile ? (
                <div className={styles.savedPosts}>
                  <div className={styles.savedCreatedAtView}>
                    <div className={styles.myCount}>
                      <Icon icon="eye" />
                      {post.viewCount}
                    </div>
                    <div className={styles.myCount}>
                      <Icon icon="speechBubble" />
                      {post.commentCount}
                    </div>
                    <IconComponent name="dot" size={3} />
                    <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.savedPosts}>
                  <div className={styles.savedCreatedAtView}>
                    <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                    <div className={styles.myCount}>
                      <Icon icon="eye" />
                      {post.viewCount}
                    </div>
                  </div>
                  <div className={styles.dropdown}>
                    <Dropdown
                      trigger={<Icon icon="more" size="2xl" />}
                      menuItems={[
                        {
                          label: "공유하기",
                          onClick: handleOpenShareModal,
                        },
                        {
                          label: "삭제하기",
                          onClick: handleDelete,
                          isDelete: true,
                        },
                      ]}
                    />
                  </div>
                </div>
              )
            ) : isMobile ? (
              <div className={styles.createdAtView}>
                {post.type !== "NOTICE" && (
                  <>
                    <Link href={`${post.author?.url}`}>
                      <p className={styles.author}>{post.author?.name}</p>
                    </Link>
                    <IconComponent name="dot" size={3} />
                  </>
                )}
                <div className={styles.viewCount}>
                  <Icon icon="eye" />
                  {post.viewCount}
                </div>
                <IconComponent name="dot" size={3} />
                <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
              </div>
            ) : (
              <div className={styles.createdAtView}>
                <div className={styles.viewCount}>
                  <Icon icon="eye" />
                  {post.viewCount}
                </div>
                <IconComponent name="dot" size={3} />
                <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
              </div>
            )}
          </div>
        </div>
        {isMobile && cardCase === "saved-posts" && (
          <div onClick={handleSaveClick} className={styles.savedIcon}>
            <IconComponent name={isSaved ? "saveOn" : "saveOff"} size={20} padding={8} isBtn />
          </div>
        )}
        {isMobile && cardCase === "my-posts" && (
          <div className={styles.dropdown}>
            <Dropdown
              trigger={<Icon icon="more" size="2xl" />}
              menuItems={[
                {
                  label: "공유하기",
                  onClick: handleOpenShareModal,
                },
                {
                  label: "삭제하기",
                  onClick: handleDelete,
                  isDelete: true,
                },
              ]}
            />
          </div>
        )}
      </div>
      {isOpen && post.author?.url && (
        <ProfileCardPopover {...popoverProps} authorUrl={post.author.url} />
      )}
    </div>
  );
}
