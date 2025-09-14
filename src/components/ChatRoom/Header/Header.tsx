import { useRouter } from "next/router";

import Icon from "@/components/Asset/IconTemp";
import ChatLeave from "@/components/Modal/ChatLeave/ChatLeave";

import { useModalStore } from "@/states/modalStore";

import { useModal } from "@/hooks/useModal";

import type { UserBaseResponse } from "@grimity/dto";

import styles from "./Header.module.scss";

interface ChatRoomHeaderProps {
  chatId: string;
  data: UserBaseResponse | undefined;
}

const ChatRoomHeader = ({ chatId, data }: ChatRoomHeaderProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const { openModal: openModalStore } = useModalStore();

  const handleShowLeaveModal = () => {
    openModal(
      (close) => (
        <ChatLeave selectedChatIds={[chatId]} close={close} onSuccess={() => router.back()} />
      ),
      {
        className: styles.leaveModal,
      },
    );
  };

  const handleOpenReportModal = () => {
    openModalStore({
      type: "REPORT",
      data: { refType: "CHAT", refId: data?.id },
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <img
            src={data?.image || "/image/default.svg"}
            alt="프로필 이미지"
            width={40}
            height={40}
          />
        </div>
        <div>
          <p className={styles.username}>{data?.name}</p>
          <p className={styles.hashtag}>@{data?.url}</p>
        </div>
      </div>

      <div className={styles.headerButtons}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="유저 신고"
          onClick={handleOpenReportModal}
        >
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
