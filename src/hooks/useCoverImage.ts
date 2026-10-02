import { createElement } from "react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { postPresignedUrl } from "@/api/images/postPresigned";
import { putBackgroundImage } from "@/api/users/putMeImage";
import { deleteMyBackgroundImage } from "@/api/users/deleteMeImage";

import Background from "@/components/Modal/Background/Background";
import { useModal } from "@/hooks/useModal";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { convertToWebP } from "@/utils/imageConverter";
import { getImageDimensions } from "@/utils/getImageDimensions";

export const useCoverImage = (
  refetchUserData: () => void,
  setCoverImage: (url: string) => void,
  userData: UserData | undefined,
) => {
  const { showToast } = useToast();
  const { openModal } = useModal();
  const { isMobile } = useDeviceStore();

  const { mutate: updateBackgroundImage } = useMutation({
    mutationFn: (imageName: string) => putBackgroundImage(imageName),
  });

  const handleAddCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 모바일 Figma에는 커버 수정 모달이 없어 바로 업로드한다
    if (!isMobile) {
      const imageUrl = URL.createObjectURL(file);
      openModal(
        (close) =>
          createElement(Background, {
            imageSrc: imageUrl,
            file,
            onUploadSuccess: refetchUserData,
            onClose: () => {
              URL.revokeObjectURL(imageUrl);
              close();
            },
          }),
        undefined,
        { bare: true },
      );
      return;
    }

    try {
      const webpFile = await convertToWebP(file);

      const { width, height } = await getImageDimensions(webpFile);

      const data = await postPresignedUrl({
        type: "background",
        ext: "webp",
        width,
        height,
      });

      updateBackgroundImage(data.imageName);

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      showToast("프로필을 수정했어요", "success");
      setCoverImage(data.imageName);
      refetchUserData();
    } catch (error) {
      console.error("File change error:", error);
      showToast("커버 이미지 업로드에 실패했습니다.", "error");
    }
  };

  const { mutate: deleteBackgroundImage } = useMutation({
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
    deleteBackgroundImage();
  };

  return { handleAddCover, handleDeleteImage };
};
