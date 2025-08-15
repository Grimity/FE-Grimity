import React from "react";

import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { ko } from "date-fns/locale";

import type { ChatResponse } from "@grimity/dto";

import { highlightSearchKeyword } from "@/utils/highlightText";

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
            <span className={styles.username}>
              {highlightSearchKeyword(chat.opponentUser.name, searchKeyword, styles.highlighted)}
            </span>
            <span className={styles.timestamp}>{formatTimestamp(chat.lastMessage?.createdAt)}</span>
          </div>
          <div className={styles.bottomRow}>
            <p className={styles.lastMessage}>
              {chat.lastMessage?.content
                ? highlightSearchKeyword(
                    chat.lastMessage.content,
                    searchKeyword,
                    styles.highlighted,
                  )
                : ""}
            </p>
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
