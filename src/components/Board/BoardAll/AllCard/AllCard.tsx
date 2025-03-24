import IconComponent from "@/components/Asset/Icon";
import styles from "./AllCard.module.scss";
import Chip from "@/components/Chip/Chip";
import { timeAgo } from "@/utils/timeAgo";
import { AllCardProps } from "./AllCard.types";
import striptags from "striptags";
import Link from "next/link";
import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";
import { useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "@/states/modalState";
import { deletePostsFeeds } from "@/api/posts/deletePostsId";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import { isMobileState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useRecoilValue(isMobileState);
  useIsMobile();
  const [, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();
  let plainTextContent = striptags(post.content);
  plainTextContent = plainTextContent
    .replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, "")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .trim();
  const [isSaved, setIsSaved] = useState(true);
  const router = useRouter();

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
      setModal({
        isOpen: true,
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
      setModal({
        isOpen: true,
        type: "SHAREPOST",
        data: { postId: post.id, title: post.title },
      });
    }
  };

  return (
    <div className={styles.container}>
      {cardCase !== "my-posts" && hasChip && !isMobile && (
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
      )}
      <div className={styles.spaceBetween}>
        <Link href={`/posts/${post.id}`}>
          <div className={styles.titleContent}>
            <div className={styles.titleContainer}>
              {cardCase === "board" &&
                isMobile &&
                (post.type === "NOTICE" ? (
                  <div className={styles.mobileChipNotice}>{getTypeLabel(post.type)}</div>
                ) : (
                  <div className={styles.mobileChip}>{getTypeLabel(post.type)}</div>
                ))}
              <h2 className={styles.title}>{post.title}</h2>
              {post.thumbnail !== null && <IconComponent name="boardAllImage" size={16} />}
              {!isMobile && (
                <div className={cardCase === "my-posts" ? styles.myCount : styles.comment}>
                  <IconComponent
                    name={cardCase === "my-posts" ? "commentCount" : "boardAllComment"}
                    size={16}
                  />
                  {post.commentCount}
                </div>
              )}
            </div>
            <p className={styles.content}>{plainTextContent}</p>
          </div>
        </Link>
        <div className={styles.rightContainer}>
          {cardCase === "saved-posts" ? (
            isMobile ? (
              <div className={styles.savedPosts}>
                <div className={styles.savedCreatedAtView}>
                  <div className={styles.viewCount}>
                    <IconComponent name="boardAllView" size={16} />
                    {post.viewCount}
                  </div>
                  <div className={styles.commentCount}>
                    <IconComponent name="boardAllComment" size={16} />
                    {post.commentCount}
                  </div>
                  <IconComponent name="dot" size={3} />
                  <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                </div>
              </div>
            ) : (
              <div className={styles.savedPosts}>
                <div className={styles.savedCreatedAtView}>
                  <div className={styles.savedPc}>
                    <div className={styles.viewCount}>
                      <IconComponent name="boardAllView" size={16} />
                      {post.viewCount}
                    </div>
                    <IconComponent name="dot" size={3} />
                    <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
                  </div>
                  <Link href={`${post.author?.url}`}>
                    <p className={styles.author}>{post.author?.name}</p>
                  </Link>
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
                    <IconComponent name="viewCount" size={16} />
                    {post.viewCount}
                  </div>
                  <div className={styles.myCount}>
                    <IconComponent name="commentCount" size={16} />
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
                    <IconComponent name="viewCount" size={16} />
                    {post.viewCount}
                  </div>
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
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
              <div className={styles.viewCount}>
                <IconComponent name="boardAllView" size={16} />
                {post.viewCount}
              </div>
              <div className={styles.commentCount}>
                <IconComponent name="boardAllComment" size={16} />
                {post.commentCount}
              </div>
              <IconComponent name="dot" size={3} />
              <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
              {post.type !== "NOTICE" && (
                <>
                  <IconComponent name="dot" size={3} />
                  <Link href={`${post.author?.url}`}>
                    <p className={styles.author}>{post.author?.name}</p>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className={styles.createdAtView}>
              <div className={styles.viewCount}>
                <IconComponent name="boardAllView" size={16} />
                {post.viewCount}
              </div>
              <IconComponent name="dot" size={3} />
              <p className={styles.createdAt}>{timeAgo(post.createdAt)}</p>
            </div>
          )}
          {post.type !== "NOTICE" && cardCase !== "saved-posts" && post.author && !isMobile && (
            <Link href={`/${post.author?.url}`}>
              <p className={styles.author}>{post.author.name}</p>
            </Link>
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
            isTopItem
            trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
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
  );
}
