import { ReactNode } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

import { useMyData } from "@/api/users/getMe";
import { deleteMe } from "@/api/users/deleteMe";

import { useModalStore, useNewModalStore } from "@/states/modalStore";
import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

import { useLogout } from "@/hooks/useLogout";
import { useToast } from "@/hooks/useToast";

import ListItem from "@/components/common/Cell/ListItem/ListItem";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import NicknameEditModal from "@/components/Settings/NicknameEditModal/NicknameEditModal";
import ProfileUrlEditModal from "@/components/Settings/ProfileUrlEditModal/ProfileUrlEditModal";

import styles from "./AccountSettings.module.scss";

export default function AccountSettings() {
  const router = useRouter();
  const { data: myData } = useMyData();
  const openModal = useModalStore((s) => s.openModal);
  const openNewModal = useNewModalStore((s) => s.openModal);
  const logout = useLogout();
  const { showToast } = useToast();
  const { setAccessToken, setIsLoggedIn, setUserId } = useAuthStore.getState();
  const resetChat = useChatStore((s) => s.reset);

  const openBareModal = (render: (close: () => void) => ReactNode) => {
    openNewModal(uuidv4(), render, undefined, false, undefined, true);
  };

  const openNicknameEdit = () => openBareModal((close) => <NicknameEditModal onClose={close} />);
  const openUrlEdit = () => openBareModal((close) => <ProfileUrlEditModal onClose={close} />);

  const handleWithdrawal = () => {
    openModal({
      type: null,
      data: {
        title: "정말 탈퇴하시겠어요?",
        subtitle: "계정 복구는 어려워요.",
        confirmBtn: "탈퇴하기",
        onClick: async () => {
          try {
            await deleteMe();
            localStorage.clear();
            setAccessToken("");
            setIsLoggedIn(false);
            setUserId("");
            resetChat();
            showToast("회원 탈퇴 되었습니다.", "success");
            router.push("/");
          } catch {
            showToast("탈퇴 중 오류가 발생했습니다.", "error");
          }
        },
      },
      isComfirm: true,
    });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.list}>
        <ListItem
          type="rightIcon"
          text="닉네임"
          subText={myData?.name}
          onClick={openNicknameEdit}
        />
        <ListItem
          type="rightIcon"
          text="프로필 URL"
          subText={myData?.url}
          onClick={openUrlEdit}
        />
        <ListItem type="textLg" text="로그아웃" onClick={logout} />
      </div>

      <div className={styles.withdrawal}>
        <TextButton variant="assistive" size="small" onClick={handleWithdrawal}>
          탈퇴하기
        </TextButton>
      </div>
    </div>
  );
}
