import { InfiniteData } from "@tanstack/react-query";
import type { ChatsResponse, ChatResponse, NewChatMessageEventResponse } from "@grimity/dto";

/**
 * 채팅 목록 쿼리 데이터 타입
 */
export type ChatQueryData = ChatsResponse | InfiniteData<ChatsResponse> | undefined;

/**
 * 업데이트 결과 타입 (null은 채팅을 찾지 못한 경우)
 */
export type UpdateResult = ChatQueryData | null;

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
): InfiniteData<ChatsResponse> | null {
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

  // 채팅을 찾지 못한 경우 null 반환 (새 채팅임을 알림)
  if (!chatFound) return null;

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
): ChatsResponse | null {
  if (!oldData.chats) return oldData;

  const updatedChat = oldData.chats.find((chat) => chat.id === newMessage.chatId);
  // 채팅을 찾지 못한 경우 null 반환 (새 채팅임을 알림)
  if (!updatedChat) return null;

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
 * @returns 업데이트된 쿼리 데이터 (null이면 채팅을 찾지 못한 경우 - 새 채팅)
 */
export function updateChatListWithNewMessage(
  oldData: ChatQueryData,
  newMessage: NewChatMessageEventResponse,
  currentUserId: string,
): UpdateResult {
  if (!oldData || !newMessage.messages?.length) return oldData;

  const lastMessage = newMessage.messages[newMessage.messages.length - 1];

  // 무한 스크롤 쿼리 처리
  if (isInfiniteData(oldData)) {
    return updateInfiniteQueryData(oldData, newMessage, lastMessage, currentUserId);
  }

  // 일반 쿼리 처리
  return updateNormalQueryData(oldData, newMessage, lastMessage, currentUserId);
}
