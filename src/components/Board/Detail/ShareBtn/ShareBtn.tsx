import { useShareModal } from "@/hooks/useShareModal";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import { ShareBtnProps } from "./ShareBtn.types";

export default function ShareBtn({ postId, title, thumbnail }: ShareBtnProps) {
  const { sharePost } = useShareModal();

  const handleOpenShareModal = () => {
    sharePost({ postId, title, thumbnail });
  };

  return (
    <IconButton
      variant="sm"
      icon={<Icon name="share" size={20} />}
      onClick={handleOpenShareModal}
      aria-label="공유하기"
    />
  );
}
