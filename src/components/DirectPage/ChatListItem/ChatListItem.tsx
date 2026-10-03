import React from "react";

import type { ChatResponse } from "@grimity/dto";

import DmList from "@/components/common/Dm/DmList/DmList";

interface ChatListItemProps {
  chat: ChatResponse;
  isEditMode: boolean;
  isSelected: boolean;
  isActive?: boolean;
  searchKeyword?: string;
  onChatClick: (chatId: string) => void;
  onToggleSelect: (chatId: string) => void;
}

const ChatListItem = React.memo(
  ({
    chat,
    isEditMode,
    isSelected,
    isActive = false,
    searchKeyword,
    onChatClick,
    onToggleSelect,
  }: ChatListItemProps) => (
    <DmList
      active={isActive}
      nickname={chat.opponentUser.name}
      avatarUrl={chat.opponentUser.image ?? undefined}
      text={chat.lastMessage?.content ?? ""}
      hasImage={Boolean(chat.lastMessage?.image)}
      date={chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt) : undefined}
      searchKeyword={searchKeyword}
      showNew={chat.unreadCount > 0}
      count={chat.unreadCount}
      showCheck={isEditMode}
      checked={isSelected}
      onCheck={() => onToggleSelect(chat.id)}
      onClick={() => onChatClick(chat.id)}
    />
  ),
);

ChatListItem.displayName = "ChatListItem";

export default ChatListItem;
