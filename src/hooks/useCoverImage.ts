import { createElement } from "react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { deleteMyBackgroundImage } from "@/api/users/deleteMeImage";

import Background from "@/components/Modal/Background/Background";
import { useModal } from "@/hooks/useModal";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import { useToast } from "@/hooks/useToast";

export const useCoverImage = (
  refetchUserData: () => void,
  setCoverImage: (url: string) => void,
  userData: UserData | undefined,
) => {
  const { showToast } = useToast();
  const { openModal } = useModal();

  const { mutateAsync: deleteBackgroundImage } = useMutation({
    mutationFn: deleteMyBackgroundImage,
    onSuccess: () => {
      showToast("커버 이미지가 삭제되었습니다.", "success");
      if (userData) {
        setCoverImage(userData.backgroundImage || "/image/default-cover.png");
      }
      refetchUserData();
    },
    onError: (error: AxiosError) => {
      showToast("커버 이미지 삭제에 실패했습니다.", "error");
      console.error("Image delete error:", error);
    },
  });

  const handleDeleteImage = () => {
    deleteBackgroundImage().catch(() => undefined);
  };

  /** 커버 수정 모달을 연다. 파일을 이미 골랐다면 넘기고, 아니면 모달 안에서 고른다 */
  const openCoverEditor = (file?: File) => {
    openModal(
      (close) =>
        createElement(Background, {
          file,
          currentImageSrc: userData?.backgroundImage ?? undefined,
          onDelete: userData?.backgroundImage ? () => deleteBackgroundImage() : undefined,
          onUploadSuccess: refetchUserData,
          onClose: close,
        }),
      undefined,
      { bare: true },
    );
  };

  /** 파일 입력의 change 이벤트로 커버 수정 모달을 연다 */
  const handleAddCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCoverEditor(file);
  };

  return { handleAddCover, handleDeleteImage, openCoverEditor };
};
