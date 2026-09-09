import { Fragment } from "react";

import ChatBubble from "@/components/common/Dm/ChatBubble/ChatBubble";
import Empty from "@/components/common/Empty/Empty";

import { formatReplyPreview } from "@/utils/formatReplyLabel";

import type { ChatMessage } from "@/types/socket.types";

import styles from "./MessageList.module.scss";

const formatDateSeparator = (iso: string) => {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

interface MessageListProps {
  messages: ChatMessage[];
  userId: string;
  userData?: { name: string; isBlocked?: boolean };
  hoveredMessageId: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onMouseEnterMessage: (messageId: string) => void;
  onMouseLeaveMessage: () => void;
  onLikeMessage: (messageId: string, isLiked: boolean) => void;
  onReplyMessage: (messageId: string) => void;
  onCloseReply?: () => void;
  onImageClick?: (images: string[], index: number) => void;
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
  onCloseReply,
  onImageClick,
}: MessageListProps) => {
  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onCloseReply?.();
  };

  const scrollToMessage = (messageId?: string) => {
    const container = containerRef.current;
    if (!messageId || !container) return;

    const target = container.querySelector<HTMLElement>(`[data-message-id="${messageId}"]`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add(styles.highlight);
    window.setTimeout(() => target.classList.remove(styles.highlight), 1000);
  };

  return (
    <div
      className={styles.messagesContainer}
      onScroll={onScroll}
      onClick={handleAreaClick}
      ref={containerRef}
    >
      {messages.length === 0 ? (
        <div className={styles.emptyWrap}>
          <Empty size="xl" iconName="illust-replay" title="아직 주고 받은 메시지가 없어요" />
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMyMessage = msg.userId === userId;
          const currentDate = formatDateSeparator(msg.createdAt);
          const prevDate =
            index > 0 ? formatDateSeparator(messages[index - 1].createdAt) : null;
          const showDate = currentDate !== prevDate;

          const repliedTo = msg.replyTo
            ? messages.find((m) => m.id === msg.replyTo?.id)
            : undefined;
          const replyTarget = repliedTo?.userId === userId ? "나" : userData?.name ?? "";

          return (
            <Fragment key={msg.id}>
              {showDate && <div className={styles.dateSeparator}>{currentDate}</div>}
              <ChatBubble
                messageId={msg.id}
                variant={isMyMessage ? "mine" : "others"}
                text={msg.content}
                images={msg.images}
                replyTo={
                  msg.replyTo
                    ? {
                        target: replyTarget,
                        text: formatReplyPreview(msg.replyTo.content, !!msg.replyTo.image),
                      }
                    : undefined
                }
                onReplyClick={
                  msg.replyTo ? () => scrollToMessage(msg.replyTo?.id) : undefined
                }
                onImageClick={
                  msg.images?.length
                    ? (imageIndex) => onImageClick?.(msg.images ?? [], imageIndex)
                    : undefined
                }
                isLiked={msg.isLiked}
                isHovered={hoveredMessageId === msg.id && !userData?.isBlocked}
                onLike={() => onLikeMessage(msg.id, msg.isLiked || false)}
                onReply={() => onReplyMessage(msg.id)}
                onMouseEnter={() => onMouseEnterMessage(msg.id)}
                onMouseLeave={() => onMouseLeaveMessage()}
              />
            </Fragment>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
