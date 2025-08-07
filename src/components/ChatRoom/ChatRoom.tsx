import styles from "./ChatRoom.module.scss";

interface ChatRoomProps {
  chatId: string | string[] | undefined;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  // 나중에 실제 채팅 데이터를 불러오는 로직이 여기에 추가됩니다.
  // const { data: chatMessages } = useGetChatMessages(chatId);

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        {/* 나중에 상대방 프로필 정보가 표시될 영역 */}
        <div className={styles.userInfo}>
          <div className={styles.avatar}></div>
          <span className={styles.username}>상대방 이름</span>
        </div>
      </header>
      <div className={styles.messagesContainer}>
        {/* 메시지 목록이 여기에 렌더링됩니다. */}
        <p>Chat ID: {chatId}</p>
        <p>채팅 메시지들이 표시될 공간입니다.</p>
      </div>
      <footer className={styles.footer}>
        {/* 메시지 입력창이 여기에 위치합니다. */}
        <input type="text" className={styles.input} placeholder="메시지 보내기" />
        <button className={styles.sendButton}>전송</button>
      </footer>
    </section>
  );
};

export default ChatRoom;
