import ChatListItem from "../ChatListItem/ChatListItem";

import type { ChatResponse } from "@grimity/dto";

import styles from "./ChatList.module.scss";

interface ChatListProps {
  chatList: ChatResponse[];
  isEditMode: boolean;
  selectedChatIds: string[];
  activeChatId?: string;
  searchKeyword?: string;
  onChatClick: (chatId: string) => void;
  onToggleSelect: (chatId: string) => void;
}

const ChatList = ({
  chatList,
  isEditMode,
  selectedChatIds,
  activeChatId,
  searchKeyword,
  onChatClick,
  onToggleSelect,
}: ChatListProps) => {
  return (
    <div className={styles.chatList} role="list">
      {chatList.map((chat) => (
        <div key={chat.id} role="listitem">
          <ChatListItem
            chat={chat}
            isEditMode={isEditMode}
            isSelected={selectedChatIds.includes(chat.id)}
            isActive={chat.id === activeChatId}
            searchKeyword={searchKeyword}
            onChatClick={onChatClick}
            onToggleSelect={onToggleSelect}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatList;
