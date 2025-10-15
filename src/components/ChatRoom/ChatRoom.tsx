import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { Socket } from "socket.io-client";

import { usePostChatMessage } from "@/api/chat-messages/postChatMessage";
import { useGetChatsUser } from "@/api/chats/getChatsUser";

import { useChatRoom } from "@/hooks/useChatRoom";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useMessageActions } from "@/hooks/useMessageActions";

import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import ChatRoomHeader from "@/components/ChatRoom/Header/Header";
import MessageList from "@/components/ChatRoom/MessageList/MessageList";
import MessageInput from "@/components/ChatRoom/MessageInput/MessageInput";
import ReplyBar from "@/components/ChatRoom/ReplyBar/ReplyBar";

import type { ChatMessage } from "@/types/socket.types";
import type { NewChatMessageEventResponse } from "@grimity/dto";

import styles from "./ChatRoom.module.scss";

interface ChatRoomProps {
  chatId: string;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [images, setImages] = useState<{ fileName: string; fullUrl: string }[]>([]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserSendingRef = useRef<boolean>(false);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const { data: userData } = useGetChatsUser({ chatId });
  const { mutate: postChatMessage } = usePostChatMessage();

  const { user_id } = useAuthStore();

  const { addMessage, updateMessageLike } = useChatStore();

  const { currentRoom, onScroll } = useChatMessages({
    chatId,
    containerRef: messagesContainerRef,
  });

  const {
    hoveredMessageId,
    replyingTo,
    handleLikeMessage,
    handleReplyMessage,
    handleMouseEnterMessage,
    handleMouseLeaveMessage,
    clearReply,
  } = useMessageActions({ chatId });

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const handleSendMessage = useCallback(() => {
    if ((!message.trim() && images.length === 0) || !chatId || isSending) return;

    setIsSending(true);
    isUserSendingRef.current = true;

    postChatMessage(
      {
        chatId,
        content: message.trim(),
        images: images.map((img) => img.fileName),
        replyToId: replyingTo?.messageId,
      },
      {
        onSuccess: () => {
          setMessage("");
          setImages([]);
          clearReply();
          setIsSending(false);
          isUserSendingRef.current = false;

          setTimeout(() => {
            messageInputRef.current?.focus();
          }, 0);
        },
        onError: (error) => {
          console.error("Failed to send message:", error);
          setIsSending(false);
          isUserSendingRef.current = false;
        },
      },
    );
  }, [images, message, chatId, isSending, postChatMessage, replyingTo, clearReply]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.nativeEvent.isComposing) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const setupSocketListeners = useCallback(
    (socketInstance: Socket) => {
      const handleNewChatMessage = (socketResponse: NewChatMessageEventResponse) => {
        if (socketResponse.chatId === chatId && socketResponse.messages?.length > 0) {
          const userMap = new Map(socketResponse.chatUsers.map((user) => [user.id, user.name]));

          socketResponse.messages.forEach((socketMessage) => {
            const convertedMessage: ChatMessage = {
              id: socketMessage.id,
              chatId: socketResponse.chatId,
              userId: socketResponse.senderId,
              userName: userMap.get(socketResponse.senderId) || "",
              content: socketMessage.content || "",
              images: socketMessage.image ? [socketMessage.image] : [],
              replyTo: socketMessage.replyTo
                ? {
                    id: socketMessage.replyTo.id,
                    content: socketMessage.replyTo.content || "",
                    image: socketMessage.replyTo.image,
                    createdAt: socketMessage.replyTo.createdAt.toString(),
                  }
                : undefined,
              createdAt: socketMessage.createdAt.toString(),
              updatedAt: socketMessage.createdAt.toString(),
              isLiked: false,
            };

            addMessage(chatId, convertedMessage);
          });
        }
      };

      const handleLikeChatMessage = (chatMessageId: string) => {
        updateMessageLike(chatId, chatMessageId, true);
      };
      const handleUnlikeChatMessage = (chatMessageId: string) => {
        updateMessageLike(chatId, chatMessageId, false);
      };

      socketInstance.on("likeChatMessage", handleLikeChatMessage);
      socketInstance.on("unlikeChatMessage", handleUnlikeChatMessage);
      socketInstance.on("newChatMessage", handleNewChatMessage);

      return () => {
        socketInstance.off("newChatMessage", handleNewChatMessage);
        socketInstance.off("likeChatMessage", handleLikeChatMessage);
        socketInstance.off("unlikeChatMessage", handleUnlikeChatMessage);
      };
    },
    [chatId, addMessage, user_id, updateMessageLike],
  );

  useChatRoom({ chatId, onSetupListeners: setupSocketListeners });

  useLayoutEffect(() => {
    if (currentRoom?.messages.length > 0) {
      scrollToBottom();
    }
  }, [currentRoom?.messages.length, scrollToBottom]);

  return (
    <section className={styles.container}>
      <ChatRoomHeader chatId={chatId} data={userData} />

      <MessageList
        messages={currentRoom?.messages || []}
        userId={user_id || ""}
        userData={userData}
        hoveredMessageId={hoveredMessageId}
        containerRef={messagesContainerRef}
        onScroll={onScroll}
        onMouseEnterMessage={handleMouseEnterMessage}
        onMouseLeaveMessage={handleMouseLeaveMessage}
        onLikeMessage={handleLikeMessage}
        onReplyMessage={handleReplyMessage}
      />

      <footer className={styles.footer}>
        {replyingTo && (
          <ReplyBar
            senderName={replyingTo.senderName}
            content={replyingTo.content}
            onCancel={clearReply}
          />
        )}

        <MessageInput
          message={message}
          isSending={isSending}
          inputRef={messageInputRef}
          onMessageChange={setMessage}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          images={images}
          onImagesChange={setImages}
        />
      </footer>
    </section>
  );
};

export default ChatRoom;
