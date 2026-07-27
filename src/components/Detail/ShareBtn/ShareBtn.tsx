import { useShareModal } from "@/hooks/useShareModal";
import IconComponent from "@/components/Asset/Icon";
import { ShareBtnProps } from "./ShareBtn.types";

export default function ShareBtn({ feedId, title, image }: ShareBtnProps) {
  const { shareFeed } = useShareModal();

  const handleOpenShareModal = () => {
    shareFeed({ feedId, title, image });
  };

  return (
    <div onClick={handleOpenShareModal}>
      <IconComponent name="share" size={24} padding={8} isBtn />
    </div>
  );
}
