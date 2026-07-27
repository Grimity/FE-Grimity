import ListItem from "@/components/common/Cell/ListItem/ListItem";
import ControlItem from "@/components/common/Cell/ControlItem/ControlItem";

import { useSubscriptions } from "@/hooks/useSubscriptions";

import styles from "./NotificationSettings.module.scss";

export default function NotificationSettings() {
  const { isAllOn, has, toggle, toggleAll } = useSubscriptions();

  return (
    <div className={styles.panel}>
      <div className={styles.toggleContainer}>
        <ControlItem type="toggle" text="모든 알림" active={isAllOn} onClick={toggleAll} />
        <ControlItem
          type="toggle"
          text="팔로우 알림"
          active={has("FOLLOW")}
          onClick={() => toggle("FOLLOW")}
        />
      </div>

      <ListItem type="section" text="그림" />
      <div className={styles.toggleContainer}>
        <ControlItem
          type="toggle"
          text="좋아요 알림"
          active={has("FEED_LIKE")}
          onClick={() => toggle("FEED_LIKE")}
        />
        <ControlItem
          type="toggle"
          text="새 댓글 알림"
          active={has("FEED_COMMENT")}
          onClick={() => toggle("FEED_COMMENT")}
        />
        <ControlItem
          type="toggle"
          text="새 답글 알림"
          active={has("FEED_REPLY")}
          onClick={() => toggle("FEED_REPLY")}
        />
      </div>

      <ListItem type="section" text="자유게시판" />
      <div className={styles.toggleContainer}>
        <ControlItem
          type="toggle"
          text="새 댓글 알림"
          active={has("POST_COMMENT")}
          onClick={() => toggle("POST_COMMENT")}
        />
        <ControlItem
          type="toggle"
          text="새 답글 알림"
          active={has("POST_REPLY")}
          onClick={() => toggle("POST_REPLY")}
        />
      </div>
    </div>
  );
}
