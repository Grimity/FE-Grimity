import { useCallback, useEffect } from "react";

import { useGetChatMessages } from "@/api/chat-messages/getChatMessages";
import { useChatStore } from "@/states/chatStore";

import { convertApiMessageToChatMessage } from "@/utils/messageConverter";

interface UseChatMessagesOptions {
  chatId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useChatMessages = ({ chatId, containerRef }: UseChatMessagesOptions) => {
  const { chatRooms, addOlderMessages, setNextCursor, setHasNextPage } = useChatStore();

  const currentRoom = chatRooms[chatId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetChatMessages(
    { chatId, size: 20 },
    { enabled: !!chatId && typeof chatId === "string" },
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;

      if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    if (data) {
      const lastPage = data.pages[data.pages.length - 1];
      const convertedMessages = lastPage.messages.map((msg) =>
        convertApiMessageToChatMessage(msg, chatId),
      );

      addOlderMessages(chatId, convertedMessages.reverse());
      setNextCursor(chatId, lastPage.nextCursor);
      setHasNextPage(chatId, !!lastPage.nextCursor);
    }

    const container = containerRef.current;
    if (!container) return;
    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    requestAnimationFrame(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const addedHeight = newScrollHeight - previousScrollHeight;
        container.scrollTop = previousScrollTop + addedHeight;
      }
    });
  }, [data, chatId]);

  return {
    currentRoom,
    hasNextPage,
    isFetchingNextPage,
    onScroll: handleScroll,
  };
};
