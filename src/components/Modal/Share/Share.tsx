import { useToast } from "@/hooks/useToast";
import styles from "./Share.module.scss";
import { ShareBtnProps } from "@/components/Detail/ShareBtn/ShareBtn.types";
import { modalState } from "@/states/modalState";
import { useRecoilState } from "recoil";
import Button from "@/components/Button/Button";
import { serviceUrl } from "@/constants/serviceurl";
import IconComponent from "@/components/Asset/Icon";

export default function Share({ feedId, title, image }: ShareBtnProps) {
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const url = `${serviceUrl}feeds/${feedId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("클립보드에 복사되었습니다.", "success");
      setModal({ isOpen: false, type: null, data: null });
    } catch {
      showToast("클립보드 복사에 실패했습니다.", "error");
    }
  };

  const handleKaKaoShare = () => {
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
        title: "그림 커뮤니티 그리미티",
        description: title,
        imageUrl: image,
        link: { mobileWebUrl: url, webUrl: url },
      },
    });

    setModal({ isOpen: false, type: null, data: null });
  };

  const handleTwitterShare = () => {
    const text = "이 그림 어때요?";
    window.open("https://twitter.com/intent/tweet?text=" + text + "&url=" + url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        <img src="/image/logo.svg" width={120} height={34} alt="logo" loading="lazy" />
        <p className={styles.text}>그리미티의 그림을 공유해보세요!</p>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          size="l"
          type="outlined-assistive"
          onClick={copyToClipboard}
          leftIcon={<IconComponent name="copy" size={20} />}
        >
          링크 복사하기
        </Button>
        <Button
          size="l"
          type="outlined-assistive"
          onClick={handleTwitterShare}
          leftIcon={<IconComponent name="twitter" size={20} />}
        >
          트위터에 공유
        </Button>
        <Button
          size="l"
          type="outlined-assistive"
          onClick={handleKaKaoShare}
          leftIcon={<IconComponent name="kakaotalk" size={20} />}
        >
          카톡으로 공유
        </Button>
      </div>
    </div>
  );
}
