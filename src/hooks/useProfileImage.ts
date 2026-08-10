import { useMutation } from "@tanstack/react-query";

import { postPresignedUrl } from "@/api/images/postPresigned";
import { putProfileImage } from "@/api/users/putMeImage";
import { deleteMyProfileImage } from "@/api/users/deleteMeImage";

import { useToast } from "@/hooks/useToast";

import { convertToWebP } from "@/utils/convertToWebP";
import { getImageDimensions } from "@/utils/getImageDimensions";

export const useProfileImage = (
  refetchUserData: () => void,
  setProfileImage: (url: string) => void,
  initialImageUrl: string,
) => {
  const { showToast } = useToast();

  const { mutate: updateProfileImage } = useMutation({
    mutationFn: (imageName: string) => putProfileImage(imageName),
  });

  const uploadImageToServer = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (!fileExt || !["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
        showToast("JPG, JPEG, PNG, WEBP 파일만 업로드 가능합니다.", "error");
        return;
      }

      let webpFile = file;
      if (fileExt !== "webp") {
        webpFile = await convertToWebP(file);
      }

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

      showToast("프로필 사진이 변경되었습니다!", "success");
      refetchUserData();
    } catch (error) {
      showToast("프로필 사진 업로드에 실패했습니다.", "error");
      setProfileImage(initialImageUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      await uploadImageToServer(file);
    } catch (error) {
      setProfileImage(initialImageUrl);
      console.error("File change error:", error);
    }
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
