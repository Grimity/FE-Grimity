import { useMutation } from "@tanstack/react-query";

import { postPresignedUrl } from "@/api/images/postPresigned";
import { putBackgroundImage } from "@/api/users/putMeImage";
import { useMyData } from "@/api/users/getMe";

import { useModalStore } from "@/states/modalStore";
import { useToast } from "@/hooks/useToast";
import { getImageDimensions } from "@/utils/getImageDimensions";

import ImageCropModal from "../ImageCrop/ImageCropModal";

// 프로필 커버 비율(4:1)에 맞춘 저장 크기
const COVER_ASPECT = 4;
const COVER_OUTPUT = { width: 1600, height: 400 };

interface BackgroundProps {
  /** 이전 모달 시스템이 넘기던 값. 더는 쓰지 않는다 */
  imageSrc?: string;
  /** 모달을 열 때 이미 고른 파일 */
  file?: File;
  /** 지금 적용된 커버 이미지 */
  currentImageSrc?: string;
  onDelete?: () => Promise<void> | void;
  onUploadSuccess?: () => void;
  /** 새 모달 시스템에서 열 때 넘긴다. 없으면 기존 모달 스토어를 닫는다 */
  onClose?: () => void;
}

export default function Background({
  file: initialFile,
  currentImageSrc,
  onDelete,
  onUploadSuccess,
  onClose,
}: BackgroundProps) {
  const { refetch } = useMyData();
  const closeLegacyModal = useModalStore((state) => state.closeModal);
  const { showToast } = useToast();

  const close = onClose ?? closeLegacyModal;

  const { mutateAsync: updateBackgroundImage } = useMutation({
    mutationFn: (imageName: string) => putBackgroundImage(imageName),
  });

  const handleSave = async (blob: Blob, file: File) => {
    try {
      const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
        type: "image/webp",
      });
      const { width, height } = await getImageDimensions(webpFile);

      const data = await postPresignedUrl({ type: "background", ext: "webp", width, height });

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        body: webpFile,
        headers: { "Content-Type": "image/webp" },
      });
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      await updateBackgroundImage(data.imageName);

      showToast("프로필을 수정했어요", "success");
      close();
      refetch();
      onUploadSuccess?.();
    } catch (error) {
      console.error("Cover image upload error:", error);
      showToast("커버 이미지 업로드에 실패했습니다.", "error");
    }
  };

  return (
    <ImageCropModal
      title="프로필 커버 수정"
      saveLabel="커버 저장"
      initialFile={initialFile}
      currentImageSrc={currentImageSrc}
      onDelete={onDelete}
      aspect={COVER_ASPECT}
      output={COVER_OUTPUT}
      variant="cover"
      onSave={handleSave}
      onClose={close}
    />
  );
}
