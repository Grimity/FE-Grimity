import Icon from "@/components/Asset/IconTemp";

import styles from "./ReplyBar.module.scss";

interface ReplyBarProps {
  senderName: string;
  content: string;
  onCancel: () => void;
}

const ReplyBar = ({ senderName, content, onCancel }: ReplyBarProps) => {
  return (
    <div className={styles.replyContainer}>
      <div className={styles.replyInfo}>
        <Icon icon="move" size="sm" rotate={180} inversion />
        <div className={styles.replyContent}>
          <span className={styles.replyTarget}>{senderName}님에게 답장</span>
          <span className={styles.replyMessage}>{content}</span>
        </div>
        <button className={styles.cancelReply} onClick={onCancel} aria-label="답장 취소">
          <Icon icon="close" size="sm" />
        </button>
      </div>
    </div>
  );
};

export default ReplyBar;