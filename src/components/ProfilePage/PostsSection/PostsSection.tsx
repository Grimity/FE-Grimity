import { useRouter } from "next/router";

import { useUserPosts } from "@/api/users/getIdPosts";

import Empty from "@/components/common/Empty/Empty";
import Filter from "@/components/common/Filter/Filter";
import Navigation from "@/components/common/Pagination/Navigation/Navigation";

import ProfilePostRow from "./ProfilePostRow/ProfilePostRow";
import type { PostsSectionProps } from "./PostsSection.types";

import styles from "../ProfilePage.module.scss";

const POSTS_PER_PAGE = 10;

// 글 목록 API는 정렬 파라미터가 없어 최신순만 제공한다
const postSortOptions = [{ value: "latest", label: "최신순" }];

export default function PostsSection({
  userId,
  isMyProfile,
  authorName,
  postCount,
}: PostsSectionProps) {
  const router = useRouter();
  const { query } = router;
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE);

  // 글 탭이 열려 있을 때만 마운트되므로 그때 처음 요청한다
  const { data: posts } = useUserPosts({
    id: userId,
    size: POSTS_PER_PAGE,
    page: currentPage,
  });

  const isEmpty = !posts || posts.length === 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } }, undefined, { shallow: true });
    }
  };

  return (
    <div className={styles.profileContent}>
      <section className={styles.postsContainer}>
        <div className={styles.resultsBar}>
          <div className={styles.resultsLabel}>
            <span>게시물</span>
            <span>
              <span className={styles.resultsCount}>{postCount}</span>건
            </span>
          </div>
          <div className={styles.rightBar}>
            <Filter
              variant="text"
              options={postSortOptions}
              value="latest"
              onChange={() => {}}
              disabled={isEmpty}
            />
          </div>
        </div>
        {isEmpty ? (
          <div className={styles.emptyWrap}>
            <Empty
              size="xl"
              iconName={isMyProfile ? "illust-replay" : "illust-result-null"}
              title={isMyProfile ? "첫 글을 업로드해보세요" : "업로드한 글이 없어요"}
              buttonLabel={isMyProfile ? "글 업로드" : undefined}
              onButtonClick={isMyProfile ? () => router.push("/board") : undefined}
            />
          </div>
        ) : (
          <>
            <ul className={styles.postContainer}>
              {posts.map((post) => (
                <ProfilePostRow
                  key={post.id}
                  post={post}
                  authorName={authorName}
                  isMyProfile={isMyProfile}
                />
              ))}
            </ul>
            {totalPages > 1 && (
              <section className={styles.pagination}>
                <Navigation
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </section>
            )}
          </>
        )}
      </section>
    </div>
  );
}
