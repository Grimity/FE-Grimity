import Link from "next/link";
import type { MyPostResponse } from "@grimity/dto";

import Tag from "@/components/common/Tag/Tag/Tag";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import ResponsiveMenu from "@/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu";
import { getTypeLabel } from "@/components/Board/BoardAll/AllCard/AllCard";

import { timeAgo } from "@/utils/timeAgo";

import { useMyPostActions } from "../hooks/useMyPostActions";

import styles from "./ProfilePostRow.module.scss";

interface ProfilePostRowProps {
  post: MyPostResponse;
  authorName: string;
  /** 내 프로필일 때만 공유·삭제 메뉴를 노출한다 */
  isMyProfile: boolean;
}

/**
 * 프로필 글 탭의 한 행. [유형 뱃지]+제목+댓글수 / 본문 / 작성자·조회·시간 순으로 쌓는다.
 */
export default function ProfilePostRow({ post, authorName, isMyProfile }: ProfilePostRowProps) {
  const { share, remove } = useMyPostActions(post);

  return (
    <li className={styles.row}>
      <div className={styles.main}>
        <Link href={`/posts/${post.id}`} className={styles.link}>
          <span className={styles.titleLine}>
            <Tag size="xs" active={false} className={styles.typeTag}>
              {getTypeLabel(post.type)}
            </Tag>
            {post.thumbnail !== null && (
              <Icon
                name="gallery"
                size={16}
                aria-label="이미지 포함"
                className={styles.imageIcon}
              />
            )}
            <span className={styles.title}>{post.title}</span>
            <Tag size="xs" className={styles.commentTag}>
              {post.commentCount}
            </Tag>
          </span>
          <span className={styles.content}>{post.content}</span>
        </Link>
        <p className={styles.meta}>
          <span>{authorName}</span>
          <span aria-hidden="true">·</span>
          <span className={styles.views}>
            <Icon name="eye" size={16} />
            {post.viewCount}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>{timeAgo(post.createdAt)}</time>
        </p>
      </div>
      {isMyProfile && (
        <div className={styles.menu}>
          <ResponsiveMenu
            trigger={
              <IconButton
                variant="sm"
                icon={<Icon name="dotmenu" size={20} />}
                aria-label="더보기"
                aria-haspopup="menu"
              />
            }
            items={[
              { label: "공유하기", onClick: share },
              { label: "삭제하기", onClick: remove },
            ]}
          />
        </div>
      )}
    </li>
  );
}
