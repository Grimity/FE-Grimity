import { createElement } from "react";
import { useMutation } from "@tanstack/react-query";

import { postPresignedUrl } from "@/api/images/postPresigned";
import { putProfileImage } from "@/api/users/putMeImage";
import { deleteMyProfileImage } from "@/api/users/deleteMeImage";

import ProfileImageModal from "@/components/Modal/ProfileImage/ProfileImageModal";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";

import { getImageDimensions } from "@/utils/getImageDimensions";

export const useProfileImage = (
  refetchUserData: () => void,
  setProfileImage: (url: string) => void,
  initialImageUrl: string,
) => {
  const { showToast } = useToast();
  const { openModal } = useModal();

  const { mutate: updateProfileImage } = useMutation({
    mutationFn: (imageName: string) => putProfileImage(imageName),
  });

  /** 잘라낸 이미지를 올린다. 성공 여부를 돌려준다 */
  const uploadImageToServer = async (webpFile: File) => {
    try {
      const { width, height } = await getImageDimensions(webpFile);

      const data = await postPresignedUrl({
        type: "profile",
        ext: "webp",
        width,
        height,
      });

      updateProfileImage(data.imageName);

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`${uploadResponse.status}`);
      }

      showToast("프로필을 수정했어요", "success");
      refetchUserData();
      return true;
    } catch (error) {
      console.error("Profile image upload error:", error);
      showToast("프로필 사진 업로드에 실패했습니다.", "error");
      setProfileImage(initialImageUrl);
      return false;
    }
  };

  // 파일을 고르면 바로 올리지 않고 자르기 모달을 먼저 띄운다
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
      showToast("JPG, JPEG, PNG, WEBP 파일만 업로드 가능합니다.", "error");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    openModal(
      (close) =>
        createElement(ProfileImageModal, {
          imageSrc: imageUrl,
          onSave: async (blob: Blob) => {
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            });
            setProfileImage(URL.createObjectURL(webpFile));
            return uploadImageToServer(webpFile);
          },
          onClose: () => {
            URL.revokeObjectURL(imageUrl);
            close();
          },
        }),
      undefined,
      { bare: true },
    );
  };

  const handleDeleteProfileImage = async () => {
    try {
      setProfileImage("/image/default.svg");
      await deleteMyProfileImage();
      refetchUserData();
      showToast("프로필 이미지가 삭제되었습니다.", "success");
    } catch (error) {
      showToast("프로필 이미지 삭제에 실패했습니다.", "error");
      console.error("Image delete error:", error);
      setProfileImage(initialImageUrl);
    }
  };

  return { handleFileChange, handleDeleteProfileImage };
};
