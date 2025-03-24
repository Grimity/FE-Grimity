import { TodayPopularPostsResponse } from "@/api/posts/getTodayPopular";
import styles from "./PopularCard.module.scss";
import striptags from "striptags";
import { timeAgo } from "@/utils/timeAgo";
import IconComponent from "@/components/Asset/Icon";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRecoilValue } from "recoil";
import { isMobileState } from "@/states/isMobileState";

interface PopularCardProps {
  post: TodayPopularPostsResponse;
}

export default function PopularCard({ post }: PopularCardProps) {
  let plainTextContent = striptags(post.content);
  plainTextContent = plainTextContent
    .replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, "")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .trim();
  const isMobile = useRecoilValue(isMobileState);

  useIsMobile();

  return (
    <div className={styles.container}>
      <Link href={`/posts/${post.id}`}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.content}>{plainTextContent}</p>
      </Link>
      {!isMobile ? (
        <div className={styles.footer}>
          <Link href={`${post.author.url}`}>
            <p className={styles.author}>{post.author.name}</p>
          </Link>
          <p className={styles.date}>{timeAgo(post.createdAt)}</p>
          <div className={styles.countContainer}>
            <IconComponent name="dot" size={3} />
            <div className={styles.likeContainer}>
              <IconComponent name="boardCommentCount" size={16} />
              <p className={styles.commentCount}>{formatCurrency(post.commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="boardViewCount" size={16} />
              <p className={styles.viewCount}>{formatCurrency(post.viewCount)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.footer}>
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="boardCommentCount" size={16} />
              <p className={styles.commentCount}>{formatCurrency(post.commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="boardViewCount" size={16} />
              <p className={styles.viewCount}>{formatCurrency(post.viewCount)}</p>
            </div>
            <IconComponent name="dot" size={3} />
          </div>
          <p className={styles.date}>{timeAgo(post.createdAt)}</p>
          <IconComponent name="dot" size={3} />
          <Link href={`${post.author.url}`}>
            <p className={styles.author}>{post.author.name}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
