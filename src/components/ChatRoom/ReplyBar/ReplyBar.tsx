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
        <div className={styles.replyContent}>
          <div className={styles.replyTargetContainer}>
            <Icon icon="move" size="lg" rotate={180} inversion />
            <span className={styles.replyTarget}>{senderName}님께 답장보내기</span>
          </div>
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