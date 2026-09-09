import { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
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
import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
import DmInput from "@/components/common/Dm/DmInput/DmInput";
import ImageViewer from "@/components/ImageViewer/ImageViewer";

import { resolveImages } from "@/utils/messageConverter";

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
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  const handleReplyAndFocus = useCallback(
    (messageId: string) => {
      handleReplyMessage(messageId);
      messageInputRef.current?.focus();
    },
    [handleReplyMessage],
  );

  const handleSendMessage = useCallback(() => {
    if ((!message.trim() && images.length === 0) || !chatId || isSending || userData?.isBlocked)
      return;

    setIsSending(true);

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

          setTimeout(() => {
            messageInputRef.current?.focus();
          }, 0);
        },
        onError: () => {
          setIsSending(false);
        },
      },
    );
  }, [
    images,
    message,
    chatId,
    isSending,
    postChatMessage,
    replyingTo,
    clearReply,
    userData?.isBlocked,
  ]);

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
              images: resolveImages(socketMessage),
              replyTo: socketMessage.replyTo
                ? {
                    id: socketMessage.replyTo.id,
                    content: socketMessage.replyTo.content || "",
                    image: resolveImages(socketMessage.replyTo)[0] ?? null,
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
    [chatId, addMessage, updateMessageLike],
  );

  useChatRoom({ chatId, onSetupListeners: setupSocketListeners });

  useEffect(() => {
    if (userData?.isBlocked) return;
    messageInputRef.current?.focus();
  }, [chatId, userData?.isBlocked]);

  useLayoutEffect(() => {
    if (currentRoom?.messages.length > 0) {
      scrollToBottom();
    }
  }, [currentRoom?.messages.length, scrollToBottom]);

  return (
    <section className={styles.container}>
      <ChatRoomHeader chatId={chatId} data={userData} />
      <ToastContainer target="local" />

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
        onReplyMessage={handleReplyAndFocus}
        onCloseReply={clearReply}
        onImageClick={(imgs, index) => setViewer({ images: imgs, index })}
      />

      {viewer && (
        <ImageViewer
          contained
          images={viewer.images}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}

      <footer className={styles.footer}>
        <input
          disabled={userData?.isBlocked}
          ref={fileInputRef}
          multiple
          hidden
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <DmInput
          value={message}
          onChange={setMessage}
          onSend={handleSendMessage}
          onImageClick={handleClickFile}
          onKeyDown={handleKeyPress}
          inputRef={messageInputRef}
          images={images}
          onRemoveImage={(index) => setImages(images.filter((_, i) => i !== index))}
          replyTo={
            replyingTo
              ? { target: replyingTo.senderName, text: replyingTo.content }
              : undefined
          }
          disabled={userData?.isBlocked}
          isSending={isSending}
        />
      </footer>
    </section>
  );
};

export default ChatRoom;
