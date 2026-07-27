import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { useNewModalStore } from "@/states/modalStore";
import ShareModal from "@/components/ShareModal/ShareModal";
import { ShareModalProps } from "@/components/ShareModal/ShareModal.types";
import { serviceUrl } from "@/constants/serviceurl";
import { DEFAULT_THUMBNAIL } from "@/constants/imageUrl";

type ShareConfig = Omit<ShareModalProps, "onClose">;

/**
 * 공용 공유하기 모달(디자인 시스템 PopUp/Modal 기반)을 연다.
 * ShareModal이 자체 오버레이를 가지므로 bare 옵션으로 마운트한다.
 */
export function useShareModal() {
  const open = useNewModalStore((s) => s.openModal);
  const close = useNewModalStore((s) => s.closeModal);

  const openShare = useCallback(
    (config: ShareConfig) => {
      const id = uuidv4();
      open(
        id,
        (handleClose) => <ShareModal {...config} onClose={handleClose} />,
        undefined,
        false,
        undefined,
        true,
      );
      return () => close(id);
    },
    [open, close],
  );

  const shareFeed = useCallback(
    ({ feedId, title, image }: { feedId: string; title: string; image?: string | null }) =>
      openShare({
        shareTitle: "그림 공유",
        url: `${serviceUrl}/feeds/${feedId}`,
        kakaoDescription: title,
        kakaoImageUrl: image ?? DEFAULT_THUMBNAIL,
        twitterText: "이 그림 어때요?",
      }),
    [openShare],
  );

  const sharePost = useCallback(
    ({ postId, title, thumbnail }: { postId: string; title: string; thumbnail?: string | null }) =>
      openShare({
        shareTitle: "글 공유",
        url: `${serviceUrl}/posts/${postId}`,
        kakaoDescription: title,
        kakaoImageUrl: thumbnail ?? DEFAULT_THUMBNAIL,
        twitterText: "이 글 같이 봐요!",
      }),
    [openShare],
  );

  const shareProfile = useCallback(
    ({ id, name, image }: { id: string; name: string; image?: string | null }) =>
      openShare({
        shareTitle: "프로필 공유",
        url: `${serviceUrl}/${id}`,
        kakaoDescription: name,
        kakaoImageUrl: image ?? DEFAULT_THUMBNAIL,
        twitterText: `${name}님의 프로필을 공유해보세요!`,
      }),
    [openShare],
  );

  return { shareFeed, sharePost, shareProfile };
}
