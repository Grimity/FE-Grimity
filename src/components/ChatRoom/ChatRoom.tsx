import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Socket } from "socket.io-client";

import { useGetChatMessages, getChatMessages } from "@/api/chat-messages/getChatMessages";
import { usePutChatJoin } from "@/api/chats/putChatJoin";
import { usePutChatLeave } from "@/api/chats/putChatLeave";
import { usePostChatMessage } from "@/api/chat-messages/postChatMessage";

import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/useToast";

import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import ChatRoomHeader from "@/components/ChatRoom/Header/Header";

import type { ChatMessage } from "@/types/socket.types";

import { convertApiMessageToChatMessage } from "@/utils/messageConverter";

import styles from "./ChatRoom.module.scss";

interface ChatRoomProps {
  chatId: string;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [images, setImages] = useState<{ name: string; originalName: string }[]>([]);

  const joinedSocketIdRef = useRef<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: initialChatData } = useGetChatMessages(
    { chatId, size: 20 },
    { enabled: !!chatId && typeof chatId === "string" },
  );
  const { mutate: postChatMessage } = usePostChatMessage();

  const { getSocketId, getSocket } = useSocket({ autoConnect: false });
  const { user_id } = useAuthStore();
  const {
    chatRooms,
    setCurrentChatId,
    initializeChatRoom,
    addMessage,
    removeMessage,
    initializeWithMessages,
    setIsLoadingMore,
    addOlderMessages,
    setNextCursor,
    setHasNextPage,
  } = useChatStore();
  const { showToast } = useToast();

  const { mutate: joinChat } = usePutChatJoin();
  const { mutate: leaveChat } = usePutChatLeave();

  const currentRoom = chatRooms[chatId];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !chatId || isSending) return;

    setIsSending(true);

    try {
      const socketInstance = getSocket();
      if (socketInstance) {
        socketInstance.emit("sendMessage", {
          chatId,
          content: message.trim(),
          images: [],
        });
      }

      postChatMessage({
        chatId,
        content: message.trim(),
        images: images.map((image) => image.name),
      });

      addMessage(chatId, {
        id: Date.now().toString(),
        chatId,
        userId: user_id,
        content: message.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { id: user_id, nickname: "임시 사용자" },
        images: images.map((image) => image.name),
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }, [message, getSocket, chatId, isSending, user_id, addMessage]);

  const handleTyping = useCallback((value: string) => {
    setMessage(value);
  }, []);

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

  const loadMoreMessages = useCallback(async () => {
    if (!currentRoom.hasNextPage || currentRoom.isLoadingMore) return;

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

  const handleClickFiile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const newImages = Array.from(files).map((file) => ({
      name: URL.createObjectURL(file),
      originalName: file.name,
    }));

    const imageCount = images.length + newImages.length;
    if (imageCount > 5) {
      showToast("최대 5장까지 업로드할 수 있어요.", "error");
      return;
    }

    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages[index];
      if (imageToRemove?.name) {
        URL.revokeObjectURL(imageToRemove.name);
      }
      const updatedImages = prevImages.filter((_, i) => i !== index);
      return updatedImages;
    });
  };

  const setupSocketListeners = useCallback(
    (socketInstance: Socket) => {
      socketInstance.on("newChatMessage", (newMessage: ChatMessage) => {
        if (newMessage.chatId === chatId) {
          addMessage(chatId, newMessage);
        }
      });

      socketInstance.on("deleteChat", (data: { messageId: string; chatId: string }) => {
        if (data.chatId === chatId) {
          removeMessage(chatId, data.messageId);
        }
      });

      return () => {
        socketInstance.off("newChatMessage");
        socketInstance.off("deleteChat");
      };
    },
    [chatId, addMessage, removeMessage],
  );

  useEffect(() => {
    if (initialChatData?.pages.length) {
      const firstPage = initialChatData.pages[0];
      const convertedMessages = firstPage.messages.map((msg) =>
        convertApiMessageToChatMessage(msg, chatId),
      );

      initializeWithMessages(chatId, convertedMessages.reverse(), firstPage.nextCursor);
    }
  }, [initialChatData, chatId, initializeWithMessages]);

  useEffect(() => {
    const socketInstance = getSocket();
    if (!socketInstance) {
      console.warn("Global socket not connected yet");
      return;
    }

    setCurrentChatId(chatId);
    initializeChatRoom(chatId);

    const cleanup = setupSocketListeners(socketInstance);

    const socketId = getSocketId();
    if (socketId) {
      joinedSocketIdRef.current = socketId;
      joinChat(
        { chatId: chatId, socketId },
        {
          onError: (error) => {
            joinedSocketIdRef.current = null;
            console.error("Failed to join chat:", error);
            showToast("채팅방 입장에 실패했습니다.", "error");
          },
        },
      );
    }

    return () => {
      if (cleanup) cleanup();

      if (joinedSocketIdRef.current) {
        leaveChat(
          { chatId: chatId, socketId: joinedSocketIdRef.current },
          {
            onError: (error) => {
              console.error("Failed to leave chat:", error);
            },
          },
        );
        joinedSocketIdRef.current = null;
      }

      setCurrentChatId(null);
    };
  }, [
    chatId,
    getSocket,
    setCurrentChatId,
    initializeChatRoom,
    setupSocketListeners,
    getSocketId,
    joinChat,
    leaveChat,
    showToast,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [currentRoom?.messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.name) {
          URL.revokeObjectURL(image.name);
        }
      });
    };
  }, []);

  return (
    <section className={styles.container}>
      <ChatRoomHeader chatId={chatId} />

      <div className={styles.messagesContainer} onScroll={handleScroll}>
        {currentRoom?.isLoadingMore && (
          <div className={styles.loadingContainer}>
            <span className={styles.loadingText}>메시지를 불러오는 중...</span>
          </div>
        )}

        {currentRoom?.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.userId === user_id ? styles.myMessage : ""}`}
          >
            <span className={styles.messageContent}>{msg.content}</span>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <footer className={styles.footer}>
        <div className={styles.inputContainer}>
          {images.length > 0 && (
            <div className={styles.imageListContainer}>
              <Swiper slidesPerView="auto" spaceBetween={10} freeMode modules={[FreeMode]}>
                {images.map((image, index) => (
                  <SwiperSlide key={index} className={styles.imageWrapper}>
                    <Image
                      className={styles.image}
                      src={image.name}
                      alt={image.originalName}
                      width={90}
                      height={90}
                    />

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`${image.originalName} 이미지 삭제`}
                    >
                      <Icon icon="close" size="xs" />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div className={styles.inputWrapper}>
            <button type="button" className={styles.cameraButton} onClick={handleClickFiile}>
              <Icon icon="camera_alt" size="2.5xl" />
              <input
                ref={fileInputRef}
                multiple
                hidden
                type="file"
                accept="image/*"
                max={10}
                className={styles.fileInput}
                onChange={handleImageUpload}
              />
            </button>
            <input
              type="text"
              className={styles.input}
              placeholder="메시지 보내기"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              type="filled-primary"
              size="m"
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              전송
            </Button>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default ChatRoom;
