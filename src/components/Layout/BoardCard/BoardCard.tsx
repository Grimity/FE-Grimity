import Link from "next/link";

import UserItem from "@/components/common/Cell/UserItem/UserItem";

import { BoardCardProps } from "./BoardCard.types";

import { formatCurrency } from "@/utils/formatCurrency";
import { timeAgo } from "@/utils/timeAgo";

import styles from "./BoardCard.module.scss";

function plainPreviewFromContent(html: string | null | undefined): string | undefined {
  if (!html?.trim()) return undefined;
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain || undefined;
}

export default function BoardCard({
  id,
  title,
  commentCount,
  viewCount,
  createdAt,
  thumbnail,
  content,
  isNotice = false,
}: BoardCardProps) {
  const hasThumbnail = Boolean(thumbnail);
  const bodyPreview = !isNotice ? plainPreviewFromContent(content ?? undefined) : undefined;

  return (
    <Link href={`/posts/${id}`} className={styles.container}>
      <UserItem
        type={hasThumbnail ? "image" : "title"}
        className={styles.userItem}
        postTitle={title}
        thumbnailUrl={thumbnail ?? undefined}
        body={bodyPreview}
        chattingCount={!isNotice ? formatCurrency(commentCount) : undefined}
        viewCount={formatCurrency(viewCount)}
        timeCount={timeAgo(createdAt)}
        showTrailingDivider={false}
      />
    </Link>
  );
}
