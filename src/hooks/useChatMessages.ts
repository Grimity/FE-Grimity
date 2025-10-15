import { useCallback, useEffect } from "react";

import { useGetChatMessages } from "@/api/chat-messages/getChatMessages";
import { useChatStore } from "@/states/chatStore";
import { useToast } from "@/hooks/useToast";

import { convertApiMessageToChatMessage } from "@/utils/messageConverter";

interface UseChatMessagesOptions {
  chatId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useChatMessages = ({ chatId, containerRef }: UseChatMessagesOptions) => {
  const { showToast } = useToast();
  const {
    chatRooms,
    setIsLoadingMore,
    addOlderMessages,
    setNextCursor,
    setHasNextPage,
    initializeWithMessages,
  } = useChatStore();

  const currentRoom = chatRooms[chatId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetChatMessages(
    { chatId, size: 20 },
    { enabled: !!chatId && typeof chatId === "string" },
  );

  const loadMoreMessages = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    const container = containerRef.current;
    if (!container) return;

    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    setIsLoadingMore(chatId, true);

    try {
      const result = await fetchNextPage();

      if (result.data) {
        const lastPage = result.data.pages[result.data.pages.length - 1];
        const convertedMessages = lastPage.messages.map((msg) =>
          convertApiMessageToChatMessage(msg, chatId),
        );

        addOlderMessages(chatId, convertedMessages.reverse());
        setNextCursor(chatId, lastPage.nextCursor);
        setHasNextPage(chatId, !!lastPage.nextCursor);
      }

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
    hasNextPage,
    isFetchingNextPage,
    containerRef,
    fetchNextPage,
    setIsLoadingMore,
    addOlderMessages,
    setNextCursor,
    setHasNextPage,
    showToast,
  ]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;

      if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        loadMoreMessages();
      }
    },
    [hasNextPage, isFetchingNextPage, loadMoreMessages],
  );

  useEffect(() => {
    if (data?.pages.length) {
      const firstPage = data.pages[0];
      const convertedMessages = firstPage.messages.map((msg) =>
        convertApiMessageToChatMessage(msg, chatId),
      );

      initializeWithMessages(chatId, convertedMessages.reverse(), firstPage.nextCursor);
    }
  }, [data, chatId, initializeWithMessages]);

  return {
    currentRoom,
    hasNextPage,
    isFetchingNextPage,
    onScroll: handleScroll,
  };
};
