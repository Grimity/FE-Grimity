import React from "react";

import Highlighter from "react-highlight-words";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { ko } from "date-fns/locale";

import type { ChatResponse } from "@grimity/dto";

import styles from "./ChatListItem.module.scss";

interface ChatListItemProps {
  chat: ChatResponse;
  isEditMode: boolean;
  isSelected: boolean;
  searchKeyword?: string;
  onChatClick: (chatId: string) => void;
  onToggleSelect: (chatId: string) => void;
}

const ChatListItem = React.memo(
  ({
    chat,
    isEditMode,
    isSelected,
    searchKeyword,
    onChatClick,
    onToggleSelect,
  }: ChatListItemProps) => {
    const formatTimestamp = (date?: Date): string => {
      if (!date) return "";

      const dateTime = new Date(date);
      const daysAgo = differenceInDays(new Date(), dateTime);

      if (daysAgo >= 7) {
        return format(dateTime, "MM월 dd일", { locale: ko });
      }

      return formatDistanceToNow(dateTime, {
        addSuffix: true,
        locale: ko,
      });
    };

    return (
      <li
        className={`${styles.chatItem} ${isEditMode ? styles.edit : ""}`}
        onClick={() => onChatClick(chat.id)}
      >
        {isEditMode && (
          <label className={styles.checkboxWrapper} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              className={styles.hiddenCheckbox}
              checked={isSelected}
              onChange={() => onToggleSelect(chat.id)}
            />
            <span className={styles.customCheckbox}></span>
          </label>
        )}
        <div className={styles.avatar}>
          <img
            src={chat.opponentUser.image || "/image/default.svg"}
            alt={`${chat.opponentUser.name} 프로필`}
            width={40}
            height={40}
          />
        </div>
        <div className={styles.chatDetails}>
          <div className={styles.topRow}>
            <div className={styles.username}>
              <Highlighter
                highlightClassName={styles.highlighted}
                searchWords={[searchKeyword || ""]}
                autoEscape
                textToHighlight={chat.opponentUser.name}
                highlightStyle={{
                  backgroundColor: "transparent",
                  color: "#2bc466",
                }}
              />
            </div>
            <span className={styles.timestamp}>{formatTimestamp(chat.lastMessage?.createdAt)}</span>
          </div>
          <div className={styles.bottomRow}>
            <div className={styles.lastMessage}>
              {chat.lastMessage?.image && <p>이미지</p>}
              {chat.lastMessage?.content && (
                <Highlighter
                  highlightClassName={styles.highlighted}
                  searchWords={[searchKeyword || ""]}
                  autoEscape
                  textToHighlight={chat.lastMessage.content}
                  highlightStyle={{
                    backgroundColor: "transparent",
                    color: "#2bc466",
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {chat.unreadCount > 0 && (
          <span className={styles.notificationBadge}>
            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
          </span>
        )}
      </li>
    );
  },
);

ChatListItem.displayName = "ChatListItem";

export default ChatListItem;
