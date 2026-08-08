import Link from "next/link";

import NumberBadge from "@/components/common/PushBadge/NumberBadge/NumberBadge";

import { usePostsLatest } from "@/api/posts/getPosts";

import styles from "./LatestPosts.module.scss";

const LATEST_POSTS_SIZE = 5;

export default function LatestPosts() {
  const { data } = usePostsLatest({ size: LATEST_POSTS_SIZE, page: 1, type: "ALL" });
  const posts = data?.posts ?? [];

  if (posts.length === 0) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>자유게시판 최신글</h2>
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className={styles.item}>
              <span className={styles.postTitle}>{post.title}</span>
              {post.commentCount > 0 && (
                <span className={styles.badge}>
                  <NumberBadge count={post.commentCount} variant="outline" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
