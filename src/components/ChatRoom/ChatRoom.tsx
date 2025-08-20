import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Socket } from "socket.io-client";

import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/useToast";

import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";

import type { ChatMessage } from "@/types/socket.types";

import styles from "./ChatRoom.module.scss";

interface ChatRoomProps {
  chatId: string | string[] | undefined;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [images, setImages] = useState<{ name: string; originalName: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const { connect, joinRoom, leaveRoom } = useSocket();
  const { user_id } = useAuthStore();
  const {
    chatRooms,
    setCurrentChatId,
    initializeChatRoom,
    addMessage,
    removeMessage,
    setOnlineUsers,
    setTyping,
  } = useChatStore();
  const { showToast } = useToast();

  const roomId = Array.isArray(chatId) ? chatId[0] : chatId;
  const currentRoom = roomId ? chatRooms[roomId] : null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // const setupSocketListeners = useCallback(
  //   (socketInstance: Socket) => {
  //     if (!roomId) return;

  //     socketInstance.on("newMessage", (newMessage: ChatMessage) => {
  //       addMessage(roomId, newMessage);
  //     });

  //     socketInstance.on("messageDeleted", (messageId: string) => {
  //       removeMessage(roomId, messageId);
  //     });

  //     socketInstance.on("onlineUsers", (users) => {
  //       setOnlineUsers(roomId, users);
  //     });

  //     socketInstance.on("error", (error) => {
  //       console.error("Socket error:", error);
  //     });

  //     return () => {
  //       socketInstance.off("newMessage");
  //       socketInstance.off("messageDeleted");
  //       socketInstance.off("onlineUsers");
  //       socketInstance.off("typing");
  //       socketInstance.off("error");
  //     };
  //   },
  //   [roomId, addMessage, removeMessage, setOnlineUsers, setTyping, user_id],
  // );

  // useEffect(() => {
  //   if (!roomId) return;

  //   const socketInstance = connect();
  //   setSocket(socketInstance);

  //   setCurrentChatId(roomId);
  //   initializeChatRoom(roomId);
  //   joinRoom(roomId);

  //   const cleanup = setupSocketListeners(socketInstance);

  //   return () => {
  //     if (cleanup) cleanup();
  //     leaveRoom(roomId);
  //     setCurrentChatId(null);
  //   };
  // }, [roomId, connect, setCurrentChatId, initializeChatRoom, setupSocketListeners, joinRoom, leaveRoom]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !socket || !roomId || isSending) return;

    setIsSending(true);

    try {
      socket.emit("sendMessage", {
        chatId: roomId,
        content: message.trim(),
        images: [],
      });

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

  if (!roomId) {
    return <div>Invalid chat ID</div>;
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <Image
              src={currentRoom?.onlineUsers?.[0]?.profileImage || "/image/default.svg"}
              alt="프로필 이미지"
              width={40}
              height={40}
            />
          </div>
          <div>
            <p className={styles.username}>호두마루</p>
            <p className={styles.hashtag}>@username</p>
          </div>
        </div>

        <div className={styles.headerButtons}>
          <button type="button" className={styles.iconButton} aria-label="불편 신고">
            <Icon icon="complaint" size="xl" />
          </button>
          <button type="button" className={styles.iconButton} aria-label="채팅방 나가기">
            <Icon icon="exit" size="xl" />
          </button>
        </div>
      </header>

      <div className={styles.messagesContainer}>
        {currentRoom?.messages &&
          currentRoom.messages.map((msg) => (
            <div key={msg.id} className={styles.message}>
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
