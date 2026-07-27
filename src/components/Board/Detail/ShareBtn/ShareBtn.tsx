import { useShareModal } from "@/hooks/useShareModal";
import IconComponent from "@/components/Asset/Icon";
import { ShareBtnProps } from "./ShareBtn.types";

export default function ShareBtn({ postId, title, thumbnail }: ShareBtnProps) {
  const { sharePost } = useShareModal();

  const handleOpenShareModal = () => {
    sharePost({ postId, title, thumbnail });
  };

  return (
    <div onClick={handleOpenShareModal}>
      <IconComponent name="share" size={24} padding={8} isBtn />
    </div>
  );
}
