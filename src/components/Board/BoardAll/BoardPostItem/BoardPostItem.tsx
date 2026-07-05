import { useRouter } from "next/router";
import Link from "next/link";

import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Icon from "@/components/common/Icon/Icon";

import { formatCurrency } from "@/utils/formatCurrency";
import { timeAgo } from "@/utils/timeAgo";

import type { AllCardProps } from "@/components/Board/BoardAll/AllCard/AllCard.types";

import styles from "@/components/Board/BoardAll/BoardPostItem/BoardPostItem.module.scss";

function getTypeLabel(type: string): string {
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

export default function BoardPostItem({ post }: Pick<AllCardProps, "post">) {
  const router = useRouter();

  if (post.type === "NOTICE") {
    return (
      <Link href={`/posts/${post.id}`}>
        <UserItem
          type="title"
          tag={getTypeLabel(post.type)}
          showTag
          postTitle={post.title}
          viewCount={formatCurrency(post.viewCount)}
          timeCount={timeAgo(post.createdAt)}
        />
      </Link>
    );
  }

  return (
    <UserItem
      type="communityTitle"
      tag={getTypeLabel(post.type)}
      showTag
      postTitle={
        post.thumbnail !== null ? (
          <span className={styles.titleWithIcon}>
            <Icon name="gallery" size={16} color="gray-subtle" />
            <span className={styles.titleWithIconText}>{post.title}</span>
          </span>
        ) : (
          post.title
        )
      }
      body={post.content}
      commentCount={post.commentCount}
      nickname={post.author?.name ?? undefined}
      viewCount={formatCurrency(post.viewCount)}
      timeCount={timeAgo(post.createdAt)}
      onClick={() => router.push(`/posts/${post.id}`)}
    />
  );
}
