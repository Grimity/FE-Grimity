import Modal from "@/components/common/PopUp/Modal/Modal";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import Icon from "@/components/common/Icon/Icon";
import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";

import { ShareModalProps } from "./ShareModal.types";
import styles from "./ShareModal.module.scss";

const KAKAO_TITLE = "그림 커뮤니티 그리미티";

export default function ShareModal({
  shareTitle,
  url,
  kakaoDescription,
  kakaoImageUrl,
  twitterText,
  onClose,
}: ShareModalProps) {
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("클립보드에 복사되었습니다.", "success");
      onClose();
    } catch {
      showToast("클립보드 복사에 실패했습니다.", "error");
    }
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`,
    );
    onClose();
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      showToast("카카오톡 SDK가 로드되지 않았습니다.", "error");
      return;
    }

    const { Kakao } = window;
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: KAKAO_TITLE,
        description: kakaoDescription,
        imageUrl: kakaoImageUrl,
        link: { mobileWebUrl: url, webUrl: url },
      },
    });

    onClose();
  };

  const content = (
    <div className={styles.list}>
      <ListItem
        type="optionCard"
        text="링크 복사하기"
        icon={<Icon name="link" size={24} color="gray-bold" />}
        onClick={handleCopyLink}
      />
      <ListItem
        type="optionCard"
        text="X로 공유"
        icon={<Icon name="xtwitter" size={24} color="gray-bold" />}
        onClick={handleTwitterShare}
      />
      <ListItem
        type="optionCard"
        text="카카오톡으로 공유"
        icon={<Icon name="kakao" size={24} color="gray-bold" />}
        onClick={handleKakaoShare}
      />
    </div>
  );

  // 모바일: 하단 BottomSheet
  if (isMobile) {
    return (
      <BottomSheet isOpen onClose={onClose} title={shareTitle} showCloseIcon>
        {content}
      </BottomSheet>
    );
  }

  // 데스크톱: 중앙 PopUp/Modal
  return (
    <Modal title={shareTitle} onClose={onClose}>
      {content}
    </Modal>
  );
}
