import { Fragment, type ReactNode } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./UserInfo.module.scss";
import { UserInfoProps } from "./UserInfo.types";

export default function UserInfo({
  type = "default",
  nickname,
  showHeart = false,
  heartCount,
  showView = false,
  viewCount,
  showTime = false,
  timeCount,
  showChatting = false,
  chattingCount,
  showTag = false,
  followerCount,
  showFollowing = false,
  followingCount,
  className,
}: UserInfoProps) {
  if (type === "comment") {
    return (
      <div className={clsx(styles.userInfo, styles.comment, className)}>
        <div className={styles.commentNicknameWrap}>
          <span className={styles.commentNickname}>{nickname}</span>
          {showTag && <span className={styles.chip}>작성자</span>}
        </div>
        {showTime && timeCount && (
          <span className={styles.time}>{timeCount}</span>
        )}
      </div>
    );
  }

  if (type === "follow") {
    return (
      <div className={clsx(styles.userInfo, styles.follow, className)}>
        <span className={styles.followPair}>
          <span className={styles.followLabel}>팔로워</span>
          <span className={styles.followCount}>{followerCount}</span>
        </span>
        {showFollowing && (
          <span className={styles.followPair}>
            <span className={styles.followLabel}>팔로잉</span>
            <span className={styles.followCount}>{followingCount}</span>
          </span>
        )}
      </div>
    );
  }

  // type === "default" | "community"
  const sections: ReactNode[] = [];

  if (type === "default" && nickname) {
    sections.push(
      <span key="nickname" className={styles.nickname}>
        {nickname}
      </span>
    );
  }

  if (type === "community" && showChatting && chattingCount) {
    sections.push(
      <span key="chatting" className={styles.stat}>
        <Icon name="chat-round" size={16} color="gray-subtle" />
        <span className={styles.count}>{chattingCount}</span>
      </span>
    );
  }

  if (showHeart && heartCount) {
    sections.push(
      <span key="heart" className={styles.stat}>
        <Icon name="heart" size={16} color="gray-subtle" />
        <span className={styles.count}>{heartCount}</span>
      </span>
    );
  }

  if (showView && viewCount) {
    sections.push(
      <span key="view" className={styles.stat}>
        <Icon name="eye" size={16} color="gray-subtle" />
        <span className={styles.count}>{viewCount}</span>
      </span>
    );
  }

  if (showTime && timeCount) {
    sections.push(
      <span key="time" className={styles.time}>
        {timeCount}
      </span>
    );
  }

  return (
    <div
      className={clsx(
        styles.userInfo,
        type === "default" ? styles.default : styles.community,
        className
      )}
    >
      {sections.map((section, index) => (
        <Fragment key={index}>
          {index > 0 && <span className={styles.dot} />}
          {section}
        </Fragment>
      ))}
    </div>
  );
}
