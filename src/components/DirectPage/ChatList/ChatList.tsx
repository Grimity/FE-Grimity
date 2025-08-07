import styles from "./ChatList.module.scss";
import ChatListItem from "../ChatListItem/ChatListItem";

import { TempChat } from "../DirectPage";

interface ChatListProps {
  chatList: TempChat[];
  isEditMode: boolean;
  selectedChatIds: number[];
  onChatClick: (chatId: number) => void;
  onToggleSelect: (chatId: number) => void;
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
