import { postPresignedUrls, PresignedUrlRequest } from "@/api/aws/postPresigned";
import { imageUrl } from "@/constants/imageUrl";
import { convertToWebP } from "@/utils/convertToWebP";
import { useToast } from "@/hooks/useToast";

interface UseImageUploaderOptions {
  uploadType?: PresignedUrlRequest["type"];
}

export const useImageUploader = (options: UseImageUploaderOptions = {}) => {
  const { uploadType = "chat" } = options;
  const { showToast } = useToast();

  const uploadImages = async (files: File[]): Promise<{ fileName: string; fullUrl: string }[]> => {
    try {
      // 파일 형식 검증 및 WebP 변환
      const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const processedFiles: File[] = [];

      for (const file of files) {
        if (!supportedFormats.includes(file.type)) {
          showToast(
            `${file.name}: 지원되지 않는 파일 형식입니다. (jpg, png, webp만 가능)`,
            "error",
          );
          continue;
        }

        const webpFile = file.type === "image/webp" ? file : await convertToWebP(file);
        processedFiles.push(webpFile);
      }

      if (processedFiles.length === 0) {
        throw new Error("업로드할 유효한 이미지가 없습니다.");
      }

      // Presigned URL 요청 배열 생성
      const requests: PresignedUrlRequest[] = processedFiles.map(() => ({
        type: uploadType,
        ext: "webp",
      }));

      // 여러 Presigned URL 요청
      const presignedUrls = await postPresignedUrls(requests);

      // 모든 파일을 병렬로 업로드
      const uploadPromises = processedFiles.map((file, index) =>
        fetch(presignedUrls[index].url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": "image/webp",
          },
        }),
      );

      const uploadResponses = await Promise.all(uploadPromises);

      // 업로드 실패 체크
      const failedUploads = uploadResponses.filter((response) => !response.ok);
      if (failedUploads.length > 0) {
        throw new Error(`${failedUploads.length}개 이미지 업로드 실패`);
      }

      // 업로드된 이미지 정보 배열 생성
      const imageInfos = presignedUrls.map((data) => ({
        fileName: data.imageName,
        fullUrl: `${imageUrl}/${data.imageName}`,
      }));

      return imageInfos;
    } catch (error) {
      console.error("Images upload error:", error);
      showToast("이미지 업로드에 실패했습니다.", "error");
      throw error;
    }
  };

  return { uploadImages };
};
