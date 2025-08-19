import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

import { useSocket } from "@/hooks/useSocket";

import { useChatStore } from "@/states/chatStore";
import { useAuthStore } from "@/states/authStore";

import type { ChatMessage } from "@/types/socket.types";

import styles from "./ChatRoom.module.scss";

interface ChatRoomProps {
  chatId: string | string[] | undefined;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const { connect, joinRoom, leaveRoom } = useSocket();
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

  const roomId = Array.isArray(chatId) ? chatId[0] : chatId;
  const currentRoom = roomId ? chatRooms[roomId] : null;

  const setupSocketListeners = useCallback(
    (socketInstance: Socket) => {
      if (!roomId) return;

      socketInstance.on("newMessage", (newMessage: ChatMessage) => {
        addMessage(roomId, newMessage);
      });

      socketInstance.on("messageDeleted", (messageId: string) => {
        removeMessage(roomId, messageId);
      });

      socketInstance.on("onlineUsers", (users) => {
        setOnlineUsers(roomId, users);
      });

      socketInstance.on("typing", ({ userId, nickname, isTyping }) => {
        if (userId !== user_id) {
          setTyping(roomId, userId, nickname, isTyping);
        }
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
    [roomId, addMessage, removeMessage, setOnlineUsers, setTyping, user_id],
  );

  useEffect(() => {
    if (!roomId) return;

    const socketInstance = connect();
    setSocket(socketInstance);

    setCurrentChatId(roomId);
    initializeChatRoom(roomId);

    const cleanup = setupSocketListeners(socketInstance);

    joinRoom(roomId);

    return () => {
      if (cleanup) cleanup();
      leaveRoom(roomId);
      setCurrentChatId(null);
    };
  }, [
    roomId,
    connect,
    joinRoom,
    leaveRoom,
    setCurrentChatId,
    initializeChatRoom,
    setupSocketListeners,
  ]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !socket || !roomId) return;

    socket.emit("sendMessage", {
      chatId: roomId,
      content: message.trim(),
      images: [],
    });

    setMessage("");

    if (isTyping) {
      socket.emit("typing", { chatId: roomId, isTyping: false });
      setIsTyping(false);
    }
  }, [message, socket, roomId, isTyping]);

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value);

      if (!socket || !roomId) return;

      const shouldShowTyping = value.trim().length > 0;

      if (shouldShowTyping !== isTyping) {
        socket.emit("typing", { chatId: roomId, isTyping: shouldShowTyping });
        setIsTyping(shouldShowTyping);
      }
    },
    [socket, roomId, isTyping],
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

  if (!roomId) {
    return <div>Invalid chat ID</div>;
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}></div>
          <span className={styles.username}>채팅방 {roomId}</span>
          {currentRoom?.onlineUsers && (
            <span className={styles.onlineCount}>({currentRoom.onlineUsers.length} 명 온라인)</span>
          )}
        </div>
      </header>

      <div className={styles.messagesContainer}>
        {currentRoom?.messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            <div className={styles.messageHeader}>
              <span className={styles.username}>{msg.user.nickname}</span>
              <span className={styles.timestamp}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className={styles.messageContent}>{msg.content}</div>
          </div>
        ))}

        {currentRoom?.typingUsers && currentRoom.typingUsers.length > 0 && (
          <div className={styles.typingIndicator}>
            {currentRoom.typingUsers.map((user) => user.nickname).join(", ")}이(가) 입력 중...
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <input
          type="text"
          className={styles.input}
          placeholder="메시지 보내기"
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          전송
        </button>
      </footer>
    </section>
  );
};

export default ChatRoom;
