import { InfiniteData } from "@tanstack/react-query";
import type { ChatsResponse, ChatResponse, NewChatMessageEventResponse } from "@grimity/dto";

/**
 * 채팅 목록 쿼리 데이터 타입
 */
export type ChatQueryData = ChatsResponse | InfiniteData<ChatsResponse> | undefined;

/**
 * InfiniteData 타입 가드
 */
function isInfiniteData(data: ChatQueryData): data is InfiniteData<ChatsResponse> {
  return !!data && "pages" in data;
}

/**
 * 새 메시지로 채팅 정보 업데이트
 */
function createUpdatedChat(
  chat: ChatResponse,
  lastMessage: NewChatMessageEventResponse["messages"][0],
  newMessage: NewChatMessageEventResponse,
  currentUserId: string,
): ChatResponse {
  const currentUserData = newMessage.chatUsers.find((user) => user.id === currentUserId);

  return {
    ...chat,
    unreadCount: currentUserData?.unreadCount ?? chat.unreadCount,
    lastMessage: {
      id: lastMessage.id,
      senderId: newMessage.senderId,
      content: lastMessage.content,
      image: lastMessage.image,
      createdAt: lastMessage.createdAt,
    },
  };
}

/**
 * 무한 스크롤 쿼리 데이터 업데이트
 */
function updateInfiniteQueryData(
  oldData: InfiniteData<ChatsResponse>,
  newMessage: NewChatMessageEventResponse,
  lastMessage: NewChatMessageEventResponse["messages"][0],
  currentUserId: string,
): InfiniteData<ChatsResponse> | undefined {
  let chatFound = false;

  const updatedPages = oldData.pages.map((page) => {
    if (!page.chats) return page;

    const updatedChat = page.chats.find((chat) => chat.id === newMessage.chatId);
    if (!updatedChat) return page;

    chatFound = true;
    const otherChats = page.chats.filter((chat) => chat.id !== newMessage.chatId);
    const updatedChatWithNewMessage = createUpdatedChat(
      updatedChat,
      lastMessage,
      newMessage,
      currentUserId,
    );

    return {
      ...page,
      chats: [updatedChatWithNewMessage, ...otherChats],
    };
  });

  if (!chatFound) return oldData;

  return {
    ...oldData,
    pages: updatedPages,
  };
}

/**
 * 일반 쿼리 데이터 업데이트
 */
function updateNormalQueryData(
  oldData: ChatsResponse,
  newMessage: NewChatMessageEventResponse,
  lastMessage: NewChatMessageEventResponse["messages"][0],
  currentUserId: string,
): ChatsResponse | undefined {
  if (!oldData.chats) return oldData;

  const updatedChat = oldData.chats.find((chat) => chat.id === newMessage.chatId);
  if (!updatedChat) return oldData;

  const otherChats = oldData.chats.filter((chat) => chat.id !== newMessage.chatId);
  const updatedChatWithNewMessage = createUpdatedChat(
    updatedChat,
    lastMessage,
    newMessage,
    currentUserId,
  );

  return {
    ...oldData,
    chats: [updatedChatWithNewMessage, ...otherChats],
  };
}

/**
 * 새 채팅 메시지로 채팅 목록 업데이트
 *
 * @param oldData - 기존 쿼리 데이터 (무한 스크롤 또는 일반 쿼리)
 * @param newMessage - 새로 받은 채팅 메시지 이벤트
 * @param currentUserId - 현재 사용자 ID
 * @returns 업데이트된 쿼리 데이터
 */
export function updateChatListWithNewMessage(
  oldData: ChatQueryData,
  newMessage: NewChatMessageEventResponse,
  currentUserId: string,
): ChatQueryData {
  if (!oldData || !newMessage.messages?.length) return oldData;

  const lastMessage = newMessage.messages[newMessage.messages.length - 1];

  // 무한 스크롤 쿼리 처리
  if (isInfiniteData(oldData)) {
    return updateInfiniteQueryData(oldData, newMessage, lastMessage, currentUserId);
  }

  // 일반 쿼리 처리
  return updateNormalQueryData(oldData, newMessage, lastMessage, currentUserId);
}
