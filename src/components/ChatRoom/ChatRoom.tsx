import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { Socket } from "socket.io-client";

import { usePostChatMessage } from "@/api/chat-messages/postChatMessage";
import { useGetChatsUser } from "@/api/chats/getChatsUser";

import { useChatRoom } from "@/hooks/useChatRoom";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useMessageActions } from "@/hooks/useMessageActions";
import useUserBlock from "@/hooks/useUserBlock";
import { useImageUploader } from "@/hooks/useImageUploader";
import { useToast } from "@/hooks/useToast";

import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import ChatRoomHeader from "@/components/ChatRoom/Header/Header";
import MessageList from "@/components/ChatRoom/MessageList/MessageList";
import MessageInput from "@/components/ChatRoom/MessageInput/MessageInput";
import ReplyBar from "@/components/ChatRoom/ReplyBar/ReplyBar";
import Toast from "@/components/Toast/Toast";
import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";

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
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userData } = useGetChatsUser({ chatId });
  const { mutate: postChatMessage } = usePostChatMessage();
  const { uploadImages } = useImageUploader({ uploadType: "chat" });
  const { showToast } = useToast();

  useUserBlock({
    isBlocked: userData?.isBlocked,
    identifier: chatId,
    isToastLocal: true,
  });

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

  const handleClickFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (!files) {
        return;
      }

      const fileArray = Array.from(files);
      const remainingSlots = 5 - images.length;

      if (fileArray.length > remainingSlots) {
        showToast("최대 5장까지 업로드할 수 있어요.", "error");
        return;
      }

      try {
        const uploadedUrls = await uploadImages(fileArray);
        setImages([...images, ...uploadedUrls]);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }

      e.target.value = "";
    },
    [images, uploadImages, showToast],
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
      <Toast target="local" />

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

        <div className={styles.footerContent}>
          <button
            disabled={userData?.isBlocked}
            type="button"
            className={styles.cameraButton}
            onClick={handleClickFile}
          >
            <Icon icon="cameraAlt" size="2.5xl" />
            <input
              disabled={userData?.isBlocked}
              ref={fileInputRef}
              multiple
              hidden
              type="file"
              accept="image/*"
              max={10}
              onChange={handleImageUpload}
            />
          </button>

          <MessageInput
            disabled={userData?.isBlocked}
            message={message}
            inputRef={messageInputRef}
            onMessageChange={setMessage}
            onKeyPress={handleKeyPress}
            images={images}
            onImagesChange={setImages}
          />

          <Button
            type="filled-primary"
            size="m"
            className={styles.sendButton}
            onClick={handleSendMessage}
            onMouseDown={(e) => e.preventDefault()}
            disabled={isSending || userData?.isBlocked || (!message.trim() && images.length === 0)}
          >
            전송
          </Button>
        </div>
      </footer>
    </section>
  );
};

export default ChatRoom;
