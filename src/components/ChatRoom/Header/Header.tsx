import { useRouter } from "next/router";

import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import ChatLeave from "@/components/Modal/ChatLeave/ChatLeave";

import { useModal } from "@/hooks/useModal";
import { useReportModal } from "@/hooks/useReportModal";
import useGoBack from "@/hooks/useGoBack";

import type { UserBaseResponse } from "@grimity/dto";

import styles from "./Header.module.scss";

interface ChatRoomHeaderProps {
  chatId: string;
  data: UserBaseResponse | undefined;
}

const ChatRoomHeader = ({ chatId, data }: ChatRoomHeaderProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const openReportModal = useReportModal();
  const { goBack } = useGoBack();

  const handleShowLeaveModal = () => {
    openModal((close) => (
      <ChatLeave selectedChatIds={[chatId]} close={close} onSuccess={() => router.back()} />
    ));
  };

  const handleOpenReportModal = () => {
    if (!data?.id) return;
    openReportModal({ refType: "CHAT", refId: data.id });
  };

  return (
    <header className={styles.header}>
      <button className={styles.backButton} onClick={goBack} aria-label="뒤로 가기">
        <Icon name="chevron-left" size={24} color="gray-bold" />
      </button>

      <UserItem
        type="id"
        className={styles.userItem}
        profileImage={data?.image ?? undefined}
        nickname={data?.name}
        userId={data?.url}
        onProfileClick={() => data?.url && router.push(`/${data.url}`)}
      >
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <IconButton
            variant="sm"
            icon={<Icon name="siren-rounded" size={24} color="gray-bold" />}
            onClick={handleOpenReportModal}
            aria-label="유저 신고"
          />
          <IconButton
            variant="sm"
            icon={<Icon name="out" size={24} color="gray-bold" />}
            onClick={handleShowLeaveModal}
            aria-label="채팅방 나가기"
          />
        </div>
      </UserItem>
    </header>
  );
};

export default ChatRoomHeader;
