import { useRouter } from "next/router";

import { useModalStore } from "@/states/modalStore";
import { useToast } from "@/hooks/useToast";
import { useFeedDeleteMany } from "@/api/generated/feeds/feeds";

import Alert from "@/components/common/PopUp/Alert/Alert";

export default function AlbumDelete() {
  const modalData = useModalStore((state) => state.data);
  const closeModal = useModalStore((state) => state.closeModal);
  const { showToast } = useToast();
  const router = useRouter();

  const selectedFeedIds: string[] = modalData?.selectedFeedIds ?? [];
  const selectedCount = selectedFeedIds.length;

  const { mutate: deleteBatchFeeds, isPending } = useFeedDeleteMany();

  const handleDelete = () => {
    if (!selectedFeedIds.length || isPending) return;

    deleteBatchFeeds(
      { data: { ids: selectedFeedIds } },
      {
        onSuccess: () => {
          showToast("선택한 그림을 삭제했어요.", "success");
          modalData?.onComplete?.();
        },
        onError: () => {
          showToast("삭제에 실패했습니다", "error");
        },
        onSettled: () => {
          closeModal();
          router.reload();
        },
      },
    );
  };

  return (
    <Alert
      variant="content"
      title={`${selectedCount}개의 그림을 삭제할까요?`}
      contentText="삭제 이후 되돌릴 수 없어요"
      secondaryLabel="취소"
      onSecondary={closeModal}
      primaryLabel={isPending ? "삭제 중..." : "삭제"}
      onPrimary={handleDelete}
    />
  );
}
