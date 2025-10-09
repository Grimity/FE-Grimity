import Icon from "@/components/Asset/IconTemp";
import LazyImage from "@/components/LazyImage/LazyImage";

import type { ChatMessage } from "@/types/socket.types";

import styles from "./MessageItem.module.scss";

interface MessageItemProps {
  message: ChatMessage;
  isMyMessage: boolean;
  isHovered: boolean;
  userData?: { name: string };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLike: (messageId: string, isLiked: boolean) => void;
  onReply: (messageId: string) => void;
}

const MessageItem = ({
  message,
  isMyMessage,
  isHovered,
  userData,
  onMouseEnter,
  onMouseLeave,
  onLike,
  onReply,
}: MessageItemProps) => {
  return (
    <div
      className={`${styles.messageWrapper} ${isMyMessage ? styles.myMessage : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`${styles.message} ${isMyMessage ? styles.myMessage : ""}`}>
        {message.replyTo && (
          <div className={`${styles.replyMessageBox} ${isMyMessage ? styles.myReply : ""}`}>
            <span className={styles.replyTarget}>
              {isMyMessage ? `${userData?.name}님에게 답장` : "나에게 답장"}
            </span>
            <div className={styles.replyIndicator}>
              <Icon icon="move" size="lg" rotate={180} inversion className={styles.replyIcon} />
              <span className={styles.replyText}>{message.replyTo.content}</span>
            </div>
          </div>
        )}

        {message.images &&
          message.images.map((src, index) => (
            <LazyImage
              className={styles.messageImage}
              key={index}
              src={src}
              alt={`${index + 1}번째 이미지`}
              width={300}
              height={300}
            />
          ))}

        {message.content && (
          <div className={styles.messageContent}>
            <span className={styles.messageContentText}>{message.content}</span>
            {message.isLiked && (
              <div className={styles.heartIcon}>
                <Icon icon="heartFill" size="sm" className={message.isLiked ? styles.heart : ""} />
              </div>
            )}
          </div>
        )}

        {!isMyMessage && isHovered && (
          <div className={styles.hoverActions}>
            <button
              className={styles.actionButton}
              onClick={() => onLike(message.id, message.isLiked || false)}
              aria-label={message.isLiked ? "좋아요 취소" : "좋아요"}
            >
              <Icon
                icon={message.isLiked ? "heartFill" : "heart"}
                size="sm"
                className={message.isLiked ? styles.heart : ""}
              />
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onReply(message.id)}
              aria-label="답글"
            >
              <Icon icon="move" size="sm" inversion />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;