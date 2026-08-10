import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { postPresignedUrl } from "@/api/images/postPresigned";
import { putBackgroundImage } from "@/api/users/putMeImage";
import { deleteMyBackgroundImage } from "@/api/users/deleteMeImage";

import { useModalStore } from "@/states/modalStore";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { convertToWebP } from "@/utils/convertToWebP";
import { getImageDimensions } from "@/utils/getImageDimensions";

export const useCoverImage = (
  refetchUserData: () => void,
  setCoverImage: (url: string) => void,
  userData: UserData | undefined,
) => {
  const { showToast } = useToast();
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile, isTablet } = useDeviceStore();

  const { mutate: updateBackgroundImage } = useMutation({
    mutationFn: (imageName: string) => putBackgroundImage(imageName),
  });

  const handleAddCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isMobile && !isTablet) {
      const imageUrl = URL.createObjectURL(file);
      openModal({
        type: "BACKGROUND",
        data: { imageSrc: imageUrl, file, onUploadSuccess: refetchUserData },
      });
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

      showToast("커버 이미지가 변경되었습니다!", "success");
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
