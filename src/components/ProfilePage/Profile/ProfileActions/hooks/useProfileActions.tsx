import { useRouter } from "next/router";

import type { UserProfileResponse } from "@grimity/dto";

import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useShareModal } from "@/hooks/useShareModal";
import { useReportModal } from "@/hooks/useReportModal";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { useFollow } from "@/hooks/useFollow";

import { usePutUserBlock } from "@/api/users/putUserBlock";
import { useDeleteUserBlock } from "@/api/users/deleteUserBlock";
import { usePostChat } from "@/api/chats/postChat";

import Blocklist from "@/components/Modal/Blocklist/Blocklist";

import styles from "../../Profile.module.scss";

interface UseProfileActionsParams {
  userId: string;
  userData: UserProfileResponse;
  refetchUserData: () => void;
}

/**
 * 프로필 액션 버튼(팔로우·차단·공유·신고·메시지 등)의 동작을 모아둔다.
 */
export function useProfileActions({
  userId,
  userData,
  refetchUserData,
}: UseProfileActionsParams) {
  const router = useRouter();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();
  const { showToast } = useToast();

  const { shareProfile } = useShareModal();
  const openReportModal = useReportModal();
  const { openModal: openOverlayModal } = useModal();

  const { handleFollowClick, handleUnfollowClick } = useFollow(userId, refetchUserData);
  const { mutate: blockUser } = usePutUserBlock();
  const { mutate: unblockUser } = useDeleteUserBlock();
  const { mutate: createChat } = usePostChat();

  /** 로그인이 필요한 동작을 감싼다 */
  const requireLogin = (action: () => void) => () => {
    if (!isLoggedIn) {
      showToast("로그인 후 가능합니다.", "warning");
      return;
    }
    action();
  };

  const openEditModal = () => {
    openModal({
      type: "PROFILE-EDIT",
      data: isMobile ? { title: "프로필 수정" } : null,
      isFill: isMobile,
    });
  };

  const openAccountSettings = () => {
    router.push("/settings/account");
  };

  const shareProfileLink = () => {
    shareProfile({ id: userData.url, name: userData.name, image: userData.image });
  };

  const openReport = requireLogin(() => {
    openReportModal({ refType: "USER", refId: userData.id });
  });

  const block = requireLogin(() => {
    blockUser(
      { id: userData.id },
      {
        onSuccess: refetchUserData,
        onError: () => showToast("차단 중 오류가 발생했습니다.", "error"),
      },
    );
  });

  const unblock = requireLogin(() => {
    unblockUser(
      { id: userData.id },
      {
        onSuccess: refetchUserData,
        onError: () => showToast("차단 해제 중 오류가 발생했습니다.", "error"),
      },
    );
  });

  const openBlocklist = requireLogin(() => {
    openOverlayModal(
      (close) => <Blocklist close={close} />,
      { className: styles.blacklist },
      { isFill: isMobile, title: "차단" },
    );
  });

  const sendMessage = requireLogin(() => {
    createChat(
      { targetUserId: userData.id },
      {
        onSuccess: (data) => router.push(`/direct/${data.id}`),
        onError: (error) => console.error("채팅방 생성 실패:", error),
      },
    );
  });

  return {
    follow: handleFollowClick,
    unfollow: handleUnfollowClick,
    openEditModal,
    openAccountSettings,
    shareProfileLink,
    openReport,
    block,
    unblock,
    openBlocklist,
    sendMessage,
  };
}
