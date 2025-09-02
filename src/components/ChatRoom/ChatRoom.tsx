import { useEffect, useState, useCallback, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Socket } from "socket.io-client";

import { useGetChatMessages, getChatMessages } from "@/api/chat-messages/getChatMessages";
import { usePutChatJoin } from "@/api/chats/putChatJoin";
import { usePutChatLeave } from "@/api/chats/putChatLeave";
import { usePostChatMessage } from "@/api/chat-messages/postChatMessage";

import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/useToast";
import { useImageUploader } from "@/hooks/useImageUploader";

import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import ChatRoomHeader from "@/components/ChatRoom/Header/Header";
import LazyImage from "@/components/LazyImage/LazyImage";

import type { ChatMessage } from "@/types/socket.types";
import type { NewChatMessageEventResponse } from "@grimity/dto";

import { convertApiMessageToChatMessage } from "@/utils/messageConverter";

import styles from "./ChatRoom.module.scss";

interface ChatRoomProps {
  chatId: string;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [images, setImages] = useState<{ fileName: string; fullUrl: string }[]>([]);

  const joinedSocketIdRef = useRef<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef<number>(0);
  const isUserSendingRef = useRef<boolean>(false);

  const { data: initialChatData } = useGetChatMessages(
    { chatId, size: 20 },
    { enabled: !!chatId && typeof chatId === "string" },
  );
  const { mutate: postChatMessage } = usePostChatMessage();

  const { getSocketId, getSocket } = useSocket({ autoConnect: false });
  const { user_id } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    chatRooms,
    setCurrentChatId,
    initializeChatRoom,
    addMessage,
    initializeWithMessages,
    setIsLoadingMore,
    addOlderMessages,
    setNextCursor,
    setHasNextPage,
  } = useChatStore();
  const { showToast } = useToast();

  const { uploadImages } = useImageUploader({
    uploadType: "chat",
  });

  const { mutate: joinChat } = usePutChatJoin();
  const { mutate: leaveChat } = usePutChatLeave();

  const currentRoom = chatRooms[chatId];

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const isScrolledToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return false;

    const threshold = 10;
    return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
  }, []);

  const handleScrollBehavior = useCallback(
    (type: "user-send" | "new-message" | "initial-load") => {
      switch (type) {
        case "user-send":
          // 사용자가 메시지를 보낸 경우 항상 최하단으로
          setTimeout(() => scrollToBottom(), 100);
          break;
        case "new-message":
          // 새 메시지 수신 시 사용자가 최하단에 있었다면 스크롤
          if (isScrolledToBottom()) {
            scrollToBottom();
          }
          break;
        case "initial-load":
          // 초기 로드 시 항상 최하단으로
          setTimeout(() => scrollToBottom("auto"), 100);
          break;
      }
    },
    [scrollToBottom, isScrolledToBottom],
  );

  const handleSendMessage = useCallback(async () => {
    if ((!message.trim() && images.length === 0) || !chatId || isSending) return;

    setIsSending(true);
    isUserSendingRef.current = true;

    try {
      postChatMessage({
        chatId,
        content: message.trim(),
        images: images.map((img) => img.fileName),
      });

      setMessage("");
      setImages([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
      isUserSendingRef.current = false;
    }
  }, [message, chatId, isSending, postChatMessage]);

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

    const container = messagesContainerRef.current;
    if (!container) return;

    // 페이지네이션 전 스크롤 상태 저장
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      return prevImages.filter((_, i) => i !== index);
    });
  };

  const setupSocketListeners = useCallback(
    (socketInstance: Socket) => {
      const handleNewChatMessage = (socketResponse: NewChatMessageEventResponse) => {
        if (socketResponse.chatId === chatId && socketResponse.messages?.length > 0) {
          // 모든 메시지를 ChatMessage로 변환하여 처리
          socketResponse.messages.forEach((socketMessage) => {
            const convertedMessage: ChatMessage = {
              id: socketMessage.id,
              chatId: socketResponse.chatId,
              userId: socketResponse.senderId,
              content: socketMessage.content || "",
              images: socketMessage.image ? [socketMessage.image] : [],
              createdAt: socketMessage.createdAt.toString(),
              updatedAt: socketMessage.createdAt.toString(),
              isLiked: false,
            };

            addMessage(chatId, convertedMessage);
          });

          const lastMessage = socketResponse.messages[socketResponse.messages.length - 1];

          queryClient
            .getQueryCache()
            .findAll({ queryKey: ["chats"] })
            .forEach((query) => {
              queryClient.setQueryData(query.queryKey, (oldData: any) => {
                console.log(oldData);
                if (!oldData?.chats) return oldData;

                const updatedChat = oldData.chats.find(
                  (chat: any) => chat.id === socketResponse.chatId,
                );
                if (!updatedChat) return oldData;

                const otherChats = oldData.chats.filter(
                  (chat: any) => chat.id !== socketResponse.chatId,
                );

                const updatedChatWithNewMessage = {
                  ...updatedChat,
                  lastMessage: {
                    id: lastMessage.id,
                    content: lastMessage.content,
                    image: lastMessage.image,
                    createdAt: lastMessage.createdAt,
                    updatedAt: lastMessage.createdAt,
                  },
                };

                return {
                  ...oldData,
                  chats: [updatedChatWithNewMessage, ...otherChats],
                };
              });
            });

          if (socketResponse.senderId === user_id) {
            handleScrollBehavior("user-send");
          } else {
            handleScrollBehavior("new-message");
          }
        }
      };

      socketInstance.on("newChatMessage", handleNewChatMessage);

      return () => {
        socketInstance.off("newChatMessage", handleNewChatMessage);
      };
    },
    [chatId, addMessage, user_id, handleScrollBehavior, queryClient],
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

    // 채팅방 상태 초기화
    setCurrentChatId(chatId);
    initializeChatRoom(chatId);

    const cleanup = setupSocketListeners(socketInstance);

    // 채팅방 입장
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

      lastMessageCountRef.current = 0;
      isUserSendingRef.current = false;
    };
  }, [chatId]);

  useEffect(() => {
    const messages = currentRoom?.messages;
    if (!messages || messages.length === 0) return;

    const currentMessageCount = messages.length;
    const previousMessageCount = lastMessageCountRef.current;

    // 메시지 수가 변경된 경우에만 처리
    if (currentMessageCount !== previousMessageCount) {
      const isFirstLoad = previousMessageCount === 0;
      const isNewMessageAdded = currentMessageCount > previousMessageCount;
      const isLoadingMore = currentRoom?.isLoadingMore;

      if (isFirstLoad) {
        // 초기 로드
        handleScrollBehavior("initial-load");
      } else if (isNewMessageAdded && !isLoadingMore) {
        // 새 메시지 추가 (페이지네이션 아닌 경우)
        if (isUserSendingRef.current) {
          return;
        } else {
          // 다른 사용자로부터 받은 메시지
          handleScrollBehavior("new-message");
        }
      }
      lastMessageCountRef.current = currentMessageCount;
    }
  }, [currentRoom?.messages, currentRoom?.isLoadingMore, handleScrollBehavior]);

  return (
    <section className={styles.container}>
      <ChatRoomHeader chatId={chatId} />

      <div className={styles.messagesContainer} onScroll={handleScroll} ref={messagesContainerRef}>
        {currentRoom?.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.userId === user_id ? styles.myMessage : ""}`}
          >
            {msg.images &&
              msg.images.map((src, index) => (
                <LazyImage
                  className={styles.messageImage}
                  key={index}
                  src={src}
                  alt={`${index + 1}번째 이미지`}
                  width={300}
                  height={300}
                />
              ))}
            {msg.content && <span className={styles.messageContent}>{msg.content}</span>}
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
                    <LazyImage
                      className={styles.image}
                      src={image.fullUrl}
                      alt={image.fileName}
                      width={90}
                      height={90}
                    />

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`이미지 ${index + 1} 삭제`}
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
              disabled={(!message.trim() && images.length === 0) || isSending}
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
