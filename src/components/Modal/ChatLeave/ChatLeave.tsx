import Alert from "@/components/common/PopUp/Alert/Alert";

import { usePostChatsBatchDelete } from "@/api/chats/postChatsBatchDelete";

import { useToast } from "@/hooks/useToast";

interface ChatLeaveProps {
  selectedChatIds: string[];
  close: () => void;
  onSuccess?: () => void;
}

export default function ChatLeave({ selectedChatIds, close, onSuccess }: ChatLeaveProps) {
  const { showToast } = useToast();

  const { mutate: leaveChats, isPending } = usePostChatsBatchDelete();

  const handleLeaveChat = () => {
    if (!selectedChatIds.length || isPending) return;

    leaveChats(
      { ids: selectedChatIds },
      {
        onSuccess: () => {
          close();
          onSuccess?.();
        },
        onError: () => {
          showToast("채팅방 나가기에 실패했습니다", "error");
          close();
        },
      },
    );
  };

  return (
    <Alert
      variant="content"
      size="xl"
      title="채팅방을 나가시겠어요?"
      contentText={"지금까지 대화 내용이 모두 사라지고\n복구가 불가능합니다."}
      secondaryLabel="아니요"
      onSecondary={close}
      primaryLabel="채팅방 나가기"
      onPrimary={handleLeaveChat}
    />
  );
}
