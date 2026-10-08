import { createElement } from "react";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";

import { postPresignedUrl } from "@/api/images/postPresigned";
import { putProfileImage } from "@/api/users/putMeImage";
import { deleteMyProfileImage } from "@/api/users/deleteMeImage";

import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";

import { getImageDimensions } from "@/utils/getImageDimensions";

// 크롭 모달(react-image-crop 및 CSS 포함)은 열 때만 불러온다
const ProfileImageModal = dynamic(() => import("@/components/Modal/ProfileImage/ProfileImageModal"));

const DEFAULT_PROFILE_IMAGE = "/image/default.svg";

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

  const validateFile = (file: File) => {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
      showToast("JPG, JPEG, PNG, WEBP 파일만 업로드 가능합니다.", "error");
      return false;
    }
    return true;
  };

  /** 프로필 이미지 수정 모달을 연다. 파일을 이미 골랐다면 넘기고, 아니면 모달 안에서 고른다 */
  const openProfileImageEditor = (file?: File) => {
    if (file && !validateFile(file)) return;

    const hasImage = initialImageUrl !== DEFAULT_PROFILE_IMAGE;
    openModal(
      (close) =>
        createElement(ProfileImageModal, {
          initialFile: file,
          currentImageSrc: hasImage ? initialImageUrl : undefined,
          validateFile,
          onSave: async (blob: Blob, picked: File) => {
            const webpFile = new File([blob], picked.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            });
            setProfileImage(URL.createObjectURL(webpFile));
            return uploadImageToServer(webpFile);
          },
          onDelete: hasImage ? handleDeleteProfileImage : undefined,
          onClose: close,
        }),
      undefined,
      { bare: true },
    );
  };

  /** 파일 입력의 change 이벤트로 프로필 이미지 수정 모달을 연다 */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openProfileImageEditor(file);
  };

  const handleDeleteProfileImage = async () => {
    try {
      setProfileImage(DEFAULT_PROFILE_IMAGE);
      await deleteMyProfileImage();
      refetchUserData();
      showToast("프로필 이미지가 삭제되었습니다.", "success");
    } catch (error) {
      showToast("프로필 이미지 삭제에 실패했습니다.", "error");
      console.error("Image delete error:", error);
      setProfileImage(initialImageUrl);
    }
  };

  return { handleFileChange, handleDeleteProfileImage, openProfileImageEditor };
};
