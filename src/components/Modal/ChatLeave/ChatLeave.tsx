import Button from "@/components/Button/Button";

import { usePostChatsBatchDelete } from "@/api/chats/postChatsBatchDelete";

import { useToast } from "@/hooks/useToast";

import styles from "@/components/Modal/ChatLeave/ChatLeave.module.scss";

interface ChatLeaveProps {
  selectedChatIds: string[];

  close: () => void;
}

export default function ChatLeave({ selectedChatIds, close }: ChatLeaveProps) {
  const { showToast } = useToast();

  const { mutate: leaveChats, isPending } = usePostChatsBatchDelete();

  const handleLeaveChat = () => {
    if (!selectedChatIds.length) return;

    leaveChats(
      { ids: selectedChatIds },
      {
        onSuccess: () => {
          close();
        },
        onError: () => {
          showToast("채팅방 나가기에 실패했습니다", "error");
          close();
        },
      },
    );
  };

  return (
    <div className={styles.comfirmModal}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>채팅방을 나갈까요?</h2>
        <p className={styles.subtitle}>지금까지 대화 내용이 모두 사라져요</p>
      </div>
      <div className={styles.btnsContainer}>
        <Button size="l" type="outlined-assistive" onClick={close}>
          취소
        </Button>
        <Button size="l" type="filled-primary" onClick={handleLeaveChat} disabled={isPending}>
          {isPending ? "나가는 중..." : "나가기"}
        </Button>
      </div>
    </div>
  );
}
