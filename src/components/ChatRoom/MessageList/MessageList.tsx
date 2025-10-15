import MessageItem from "@/components/ChatRoom/MessageItem/MessageItem";

import type { ChatMessage } from "@/types/socket.types";

import styles from "./MessageList.module.scss";

interface MessageListProps {
  messages: ChatMessage[];
  userId: string;
  userData?: { name: string };
  hoveredMessageId: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onMouseEnterMessage: (messageId: string) => void;
  onMouseLeaveMessage: () => void;
  onLikeMessage: (messageId: string, isLiked: boolean) => void;
  onReplyMessage: (messageId: string) => void;
}

const MessageList = ({
  messages,
  userId,
  userData,
  hoveredMessageId,
  containerRef,
  onScroll,
  onMouseEnterMessage,
  onMouseLeaveMessage,
  onLikeMessage,
  onReplyMessage,
}: MessageListProps) => {
  return (
    <div className={styles.messagesContainer} onScroll={onScroll} ref={containerRef}>
      {messages?.map((msg) => {
        const isMyMessage = msg.userId === userId;

        return (
          <MessageItem
            key={msg.id}
            message={msg}
            isMyMessage={isMyMessage}
            isHovered={hoveredMessageId === msg.id}
            userData={userData}
            onMouseEnter={() => !isMyMessage && onMouseEnterMessage(msg.id)}
            onMouseLeave={() => !isMyMessage && onMouseLeaveMessage()}
            onLike={onLikeMessage}
            onReply={onReplyMessage}
          />
        );
      })}

      <div />
    </div>
  );
};

export default MessageList;
