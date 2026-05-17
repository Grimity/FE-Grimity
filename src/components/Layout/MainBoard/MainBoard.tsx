import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { usePostsLatest, usePostsNotices } from "@/api/posts/getPosts";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import BoardCard from "../BoardCard/BoardCard";
import Title from "@/components/Layout/Title/Title";
import Divider from "@/components/common/Divider/Divider";

import { MainBoardProps } from "./MainBoard.types";

import styles from "./MainBoard.module.scss";

const SECTION_META = {
  ALL: { title: "자유게시판 최신 글", link: "/board?type=ALL&page=1" },
  NOTICE: { title: "공지사항", link: "/board?type=NOTICE&page=1" },
} as const;

export default function MainBoard({ type }: MainBoardProps) {
  const {
    data: noticePosts,
    isLoading: isNoticeLoading,
    refetch: noticeRefetch,
  } = usePostsNotices();

  const {
    data: latestPosts,
    isLoading: isLatestLoading,
    refetch: latestRefetch,
  } = usePostsLatest({
    size: 3,
    page: 1,
    type: "ALL",
  });

  const { pathname } = useRouter();
  const isLoading = (type === "ALL" && isLatestLoading) || (type === "NOTICE" && isNoticeLoading);

  useEffect(() => {
    Promise.all([latestRefetch(), noticeRefetch()]);
  }, [pathname, latestRefetch, noticeRefetch]);

  useGlobalLoading(isLoading);

  const posts = type === "NOTICE" ? noticePosts : latestPosts?.posts;
  const emptyMessage = type === "NOTICE" ? "공지사항이 없습니다" : "아직 올라온 글이 없어요";
  const { title, link } = SECTION_META[type];

  return (
    <div className={styles.container}>
      <Title link={link} gap="sm">{title}</Title>
      <section className={styles.cardSection}>
        {posts && posts.length > 0 ? (
          posts.map((post, index, arr) => (
            <React.Fragment key={post.id}>
              <BoardCard
                {...post}
                thumbnail={post.thumbnail}
                isNotice={type === "NOTICE"}
              />
              {index < arr.length - 1 && <Divider size="normal" variant="secondary" />}
            </React.Fragment>
          ))
        ) : (
          <p className={styles.noPosts}>{emptyMessage}</p>
        )}
      </section>
    </div>
  );
}
