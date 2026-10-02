import { useRouter } from "next/router";

import { useToast } from "@/hooks/useToast";
import { useFeedDeleteMany } from "@/api/generated/feeds/feeds";

import Alert from "@/components/common/PopUp/Alert/Alert";
import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";

interface AlbumDeleteProps {
  selectedFeedIds: string[];
  onClose: () => void;
  onComplete?: () => void;
}

export default function AlbumDelete({ selectedFeedIds, onClose, onComplete }: AlbumDeleteProps) {
  const { showToast } = useToast();
  const router = useRouter();

  const { mutate: deleteBatchFeeds, isPending } = useFeedDeleteMany();

  const handleDelete = () => {
    if (!selectedFeedIds.length || isPending) return;

    deleteBatchFeeds(
      { data: { ids: selectedFeedIds } },
      {
        onSuccess: () => {
          showToast("선택한 그림을 삭제했어요", "success");
          onComplete?.();
        },
        onError: () => {
          showToast("삭제에 실패했어요", "error");
        },
        onSettled: () => {
          onClose();
          router.reload();
        },
      },
    );
  };

  return (
    <Backdrop>
      <Alert
        variant="content"
        title="선택한 그림을 삭제할까요?"
        contentText="삭제 이후 되돌릴 수 없어요"
        secondaryLabel="아니요"
        onSecondary={onClose}
        primaryLabel={isPending ? "삭제 중..." : "삭제하기"}
        onPrimary={handleDelete}
      />
    </Backdrop>
  );
}
