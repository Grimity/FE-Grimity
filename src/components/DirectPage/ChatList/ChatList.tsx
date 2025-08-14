import ChatListItem from "../ChatListItem/ChatListItem";

import type { ChatResponse } from "@grimity/dto";

import styles from "./ChatList.module.scss";

interface ChatListProps {
  chatList: ChatResponse[];
  isEditMode: boolean;
  selectedChatIds: string[];
  onChatClick: (chatId: string) => void;
  onToggleSelect: (chatId: string) => void;
}

const ChatList = ({
  chatList,
  isEditMode,
  selectedChatIds,
  onChatClick,
  onToggleSelect,
}: ChatListProps) => {
  return (
    <ul className={styles.chatList}>
      {chatList.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isEditMode={isEditMode}
          isSelected={selectedChatIds.includes(chat.id)}
          onChatClick={onChatClick}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </ul>
  );
};

export default ChatList;
