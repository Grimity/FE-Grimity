import { useState, useCallback, useRef, useEffect } from "react";

import { usePutChatMessageLike } from "@/api/chat-messages/putChatMessageLike";
import { useDeleteChatMessageLike } from "@/api/chat-messages/deleteChatMessageLike";
import { useToast } from "@/hooks/useToast";
import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import { formatReplyPreview } from "@/utils/formatReplyLabel";

interface ReplyingTo {
  messageId: string;
  content: string;
  senderName: string;
}

interface UseMessageActionsOptions {
  chatId: string;
}

export const useMessageActions = ({ chatId }: UseMessageActionsOptions) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutateAsync: likeChatMessage } = usePutChatMessageLike();
  const { mutateAsync: deleteChatMessageLike } = useDeleteChatMessageLike();
  const { showToast } = useToast();
  const { updateMessageLike, chatRooms } = useChatStore();
  const { user_id } = useAuthStore();

  const currentRoom = chatRooms[chatId];

  useEffect(() => {
    setReplyingTo(null);
  }, [chatId]);

  const handleLikeMessage = useCallback(
    async (messageId: string, isCurrentlyLiked: boolean) => {
      try {
        updateMessageLike(chatId, messageId, !isCurrentlyLiked);

        if (isCurrentlyLiked) {
          await deleteChatMessageLike({ id: messageId });
        } else {
          await likeChatMessage({ id: messageId });
        }
      } catch (error) {
        updateMessageLike(chatId, messageId, isCurrentlyLiked);
        showToast("좋아요 처리에 실패했습니다.", "error");
      }
    },
    [likeChatMessage, deleteChatMessageLike, updateMessageLike, chatId, showToast],
  );

  const handleReplyMessage = useCallback(
    (messageId: string) => {
      const targetMessage = currentRoom?.messages.find((msg) => msg.id === messageId);

      if (targetMessage) {
        setReplyingTo({
          messageId,
          content: formatReplyPreview(targetMessage.content, !!targetMessage.images?.length),
          senderName: targetMessage.userId === user_id ? "나" : targetMessage.userName,
        });
      }
    },
    [currentRoom?.messages, user_id],
  );

  const handleMouseEnterMessage = useCallback((messageId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredMessageId(messageId);
  }, []);

  const handleMouseLeaveMessage = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMessageId(null);
    }, 150);
  }, []);

  const clearReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  return {
    hoveredMessageId,
    replyingTo,
    handleLikeMessage,
    handleReplyMessage,
    handleMouseEnterMessage,
    handleMouseLeaveMessage,
    clearReply,
  };
};