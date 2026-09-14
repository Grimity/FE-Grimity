import { useRouter } from "next/router";

import { useUserPosts } from "@/api/users/getIdPosts";

import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Empty from "@/components/common/Empty/Empty";
import Navigation from "@/components/common/Pagination/Navigation/Navigation";

import type { PostsSectionProps } from "./PostsSection.types";

import styles from "../ProfilePage.module.scss";

const POSTS_PER_PAGE = 10;

export default function PostsSection({ userId, postCount }: PostsSectionProps) {
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } }, undefined, { shallow: true });
    }
  };

  return (
    <div className={styles.feed}>
      <div className={styles.feedContainer}>
        <section>
          {!posts || posts.length === 0 ? (
            <div className={styles.emptyWrap}>
              <Empty
                size="xl"
                title="첫 글을 업로드해보세요"
                buttonLabel="글 업로드"
                onButtonClick={() => router.push("/board")}
              />
            </div>
          ) : (
            <>
              <div className={styles.postContainer}>
                {posts.map((post) => (
                  <AllCard key={post.id} post={post} case="my-posts" />
                ))}
              </div>
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
    </div>
  );
}
