import { useGetChatsUser } from "@/api/chats/getChatsUser";

import Icon from "@/components/Asset/IconTemp";
import ChatLeave from "@/components/Modal/ChatLeave/ChatLeave";

import { useModal } from "@/hooks/useModal";

import styles from "./Header.module.scss";

interface ChatRoomHeaderProps {
  chatId: string;
}

const ChatRoomHeader = ({ chatId }: ChatRoomHeaderProps) => {
  const { openModal } = useModal();

  const { data: userData } = useGetChatsUser({ chatId });

  const handleShowLeaveModal = () => {
    openModal((close) => <ChatLeave selectedChatIds={[chatId]} close={close} />, {
      className: styles.leaveModal,
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <img
            src={userData?.image || "/image/default.svg"}
            alt="프로필 이미지"
            width={40}
            height={40}
          />
        </div>
        <div>
          <p className={styles.username}>{userData?.name}</p>
          <p className={styles.hashtag}>@{userData?.url}</p>
        </div>
      </div>

      <div className={styles.headerButtons}>
        <button type="button" className={styles.iconButton} aria-label="불편 신고">
          <Icon icon="complaint" size="xl" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="채팅방 나가기"
          onClick={handleShowLeaveModal}
        >
          <Icon icon="exit" size="xl" />
        </button>
      </div>
    </header>
  );
};

export default ChatRoomHeader;
