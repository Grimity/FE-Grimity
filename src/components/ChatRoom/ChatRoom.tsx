import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Socket } from "socket.io-client";

import { useGetChatMessages, getChatMessages } from "@/api/chat-messages/getChatMessages";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [images, setImages] = useState<{ name: string; originalName: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: initialChatData } = useGetChatMessages(
    { chatId, size: 20 },
    { enabled: !!chatId && typeof chatId === "string" },
  );

  const { connect } = useSocket();
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

  const roomId = chatId;
  const currentRoom = roomId ? chatRooms[roomId] : null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const setupSocketListeners = useCallback(
    (socketInstance: Socket) => {
      if (!roomId) return;

      socketInstance.on("newChatMessage", (newMessage: ChatMessage) => {
        addMessage(roomId, newMessage);
      });

      socketInstance.on("deleteChat", (messageId: string) => {
        removeMessage(roomId, messageId);
      });

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error);
      });

      return () => {
        socketInstance.off("newMessage");
        socketInstance.off("messageDeleted");
        socketInstance.off("onlineUsers");
        socketInstance.off("typing");
        socketInstance.off("error");
      };
    },
    [roomId, addMessage, removeMessage],
  );

  useEffect(() => {
    if (initialChatData?.pages?.[0] && roomId) {
      const firstPage = initialChatData.pages[0];
      const convertedMessages = firstPage.messages.map((msg) =>
        convertApiMessageToChatMessage(msg, roomId),
      );

      initializeWithMessages(roomId, convertedMessages.reverse(), firstPage.nextCursor);
    }
  }, [initialChatData, roomId, initializeWithMessages]);

  useEffect(() => {
    if (!roomId) return;

    const socketInstance = connect();
    setSocket(socketInstance);

    setCurrentChatId(roomId);
    initializeChatRoom(roomId);

    const cleanup = setupSocketListeners(socketInstance);

    return () => {
      if (cleanup) cleanup();

      setCurrentChatId(null);
    };
  }, [roomId, connect, setCurrentChatId, initializeChatRoom, setupSocketListeners]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !roomId || isSending) return;

    setIsSending(true);

    try {
      if (socket) {
        socket.emit("sendMessage", {
          chatId: roomId,
          content: message.trim(),
          images: [],
        });
      }

      const tempMessage: ChatMessage = {
        id: Date.now().toString(),
        chatId: roomId,
        userId: user_id,
        content: message.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { id: user_id, nickname: "임시 사용자" },
      };

      addMessage(roomId, tempMessage);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }, [message, socket, roomId, isSending]);

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value);
    },
    [socket, roomId],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const loadMoreMessages = useCallback(async () => {
    if (!roomId || !currentRoom?.hasNextPage || currentRoom?.isLoadingMore) return;

    setIsLoadingMore(roomId, true);

    try {
      const response = await getChatMessages({
        chatId: roomId,
        size: 20,
        cursor: currentRoom.nextCursor || undefined,
      });

      const convertedMessages = response.messages.map((msg) =>
        convertApiMessageToChatMessage(msg, roomId),
      );

      addOlderMessages(roomId, convertedMessages.reverse());
      setNextCursor(roomId, response.nextCursor);
      setHasNextPage(roomId, !!response.nextCursor);
    } catch (error) {
      console.error("Failed to load more messages:", error);
      showToast("메시지를 불러오는데 실패했습니다.", "error");
    } finally {
      setIsLoadingMore(roomId, false);
    }
  }, [
    roomId,
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
