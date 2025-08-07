import React from "react";
import styles from "./ChatListItem.module.scss";
import { TempChat } from "../DirectPage"; // DirectPage에서 export한 타입을 가져옴

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
              className={styles.customCheckbox}
              checked={isSelected}
              onChange={() => onToggleSelect(chat.id)}
            />
          </label>
        )}
        <div className={styles.avatar}>
          <img src={chat.avatar} alt={`${chat.username} 프로필`} width={48} height={48} />
        </div>
        <div className={styles.chatDetails}>
          <div className={styles.topRow}>
            <span className={styles.username}>{chat.username}</span>
            <span className={styles.timestamp}>{chat.timestamp}</span>
          </div>
          <div className={styles.bottomRow}>
            <p className={styles.lastMessage}>{chat.lastMessage}</p>
            {chat.unreadCount > 0 && (
              <span className={styles.notificationBadge}>
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </li>
    );
  },
);

ChatListItem.displayName = "ChatListItem";

export default ChatListItem;
