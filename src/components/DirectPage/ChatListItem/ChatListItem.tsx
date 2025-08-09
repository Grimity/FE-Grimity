import React from "react";

import { TempChat } from "../DirectPage";

import styles from "./ChatListItem.module.scss";

interface ChatListItemProps {
  chat: TempChat;
  isEditMode: boolean;
  isSelected: boolean;
  onChatClick: (chatId: number) => void;
  onToggleSelect: (chatId: number) => void;
}

const ChatListItem = React.memo(
  ({ chat, isEditMode, isSelected, onChatClick, onToggleSelect }: ChatListItemProps) => {
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
          <img src={chat.avatar} alt={`${chat.username} 프로필`} width={40} height={40} />
        </div>
        <div className={styles.chatDetails}>
          <div className={styles.topRow}>
            <span className={styles.username}>{chat.username}</span>
            <span className={styles.timestamp}>{chat.timestamp}</span>
          </div>
          <div className={styles.bottomRow}>
            <p className={styles.lastMessage}>{chat.lastMessage}</p>
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
