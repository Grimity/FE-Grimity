import { useCallback, useRef } from "react";

import { getChatMessages } from "@/api/chat-messages/getChatMessages";
import { useToast } from "@/hooks/useToast";
import { useChatStore } from "@/states/chatStore";
import { convertApiMessageToChatMessage } from "@/utils/messageConverter";

interface UseChatMessagesOptions {
  chatId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useChatMessages = ({ chatId, containerRef }: UseChatMessagesOptions) => {
  const { showToast } = useToast();
  const { chatRooms, setIsLoadingMore, addOlderMessages, setNextCursor, setHasNextPage } =
    useChatStore();

  const currentRoom = chatRooms[chatId];

  const loadMoreMessages = useCallback(async () => {
    if (!currentRoom?.hasNextPage || currentRoom?.isLoadingMore) return;

    const container = containerRef.current;
    if (!container) return;

    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    setIsLoadingMore(chatId, true);

    try {
      const response = await getChatMessages({
        chatId,
        size: 20,
        cursor: currentRoom.nextCursor || undefined,
      });

      const convertedMessages = response.messages.map((msg) =>
        convertApiMessageToChatMessage(msg, chatId),
      );

      addOlderMessages(chatId, convertedMessages.reverse());
      setNextCursor(chatId, response.nextCursor);
      setHasNextPage(chatId, !!response.nextCursor);

      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const addedHeight = newScrollHeight - previousScrollHeight;
          container.scrollTop = previousScrollTop + addedHeight;
        }
      });
    } catch (error) {
      console.error("Failed to load more messages:", error);
      showToast("메시지를 불러오는데 실패했습니다.", "error");
    } finally {
      setIsLoadingMore(chatId, false);
    }
  }, [
    chatId,
    currentRoom?.hasNextPage,
    currentRoom?.isLoadingMore,
    currentRoom?.nextCursor,
    containerRef,
    setIsLoadingMore,
    addOlderMessages,
    setNextCursor,
    setHasNextPage,
    showToast,
  ]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;

      if (scrollTop === 0 && currentRoom?.hasNextPage && !currentRoom?.isLoadingMore) {
        loadMoreMessages();
      }
    },
    [currentRoom?.hasNextPage, currentRoom?.isLoadingMore, loadMoreMessages],
  );

  return {
    currentRoom,
    loadMoreMessages,
    handleScroll,
  };
};